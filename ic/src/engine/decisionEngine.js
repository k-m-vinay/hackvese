import { calculateTransportCost } from '../data/markets.js';
import { estimateSpoilage } from './spoilageModel.js';
import { getExpectedPrice, analyzePriceTrend, getPriceVolatility } from './priceModel.js';
import { getPriceHistory } from '../data/historicalPrices.js';
import { weatherData } from '../data/weather.js';

export const analyzeMarkets = ({ crop, quantity, grade, harvestDate, markets }) => {
  const results = markets.map(market => {
    // 1. Transport Cost
    const transportCost = calculateTransportCost(market, quantity);
    
    // 2. Spoilage
    const weather = weatherData[market.id];
    const spoilageResult = estimateSpoilage({ crop, quantity, market, weather, harvestDate });
    const { spoiledQuantity, spoilageRate, factors: spoilageFactors } = spoilageResult;
    
    // Adjust quality multiplier based on grade
    const gradeInfo = crop.grades?.find(g => g.grade === grade) || { qualityMultiplier: 1.0 };
    
    // 3. Price
    const expectedPriceBase = getExpectedPrice(crop, market);
    const expectedPrice = expectedPriceBase * gradeInfo.qualityMultiplier;
    
    // 4. Financials
    const sellableQty = quantity - spoiledQuantity;
    const grossRevenue = expectedPrice * sellableQty;
    const netRealization = grossRevenue - transportCost;
    const netRealizationRange = [netRealization * 0.9, netRealization * 1.1];
    
    // 5. Risk
    const history = getPriceHistory(crop.id, market.id);
    const volatility = getPriceVolatility(history);
    const distanceRisk = Math.min(1.0, market.distanceFromHub / 500);
    const riskScore = (volatility * 0.4) + (spoilageRate * 0.4) + (distanceRisk * 0.2);

    return {
      market,
      transportCost,
      spoilageResult,
      expectedPrice,
      grossRevenue,
      netRealization,
      netRealizationRange,
      riskScore,
      analysis: analyzePriceTrend(history),
      volatility
    };
  });

  // Rank by netRealization descending
  results.sort((a, b) => b.netRealization - a.netRealization);
  
  const topResult = results[0];
  const recommendation = generateRecommendation(topResult, quantity, results);

  return {
    recommendation,
    allMarkets: results,
    riskFactors: {
      marketRisk: topResult.riskScore > 0.6 ? 'High' : (topResult.riskScore > 0.3 ? 'Medium' : 'Low'),
      priceVolatility: topResult.volatility,
      spoilageExpected: topResult.spoilageResult.spoilageRate
    }
  };
};

function generateRecommendation(topResult, quantity, allResults) {
  const { market, analysis, volatility, netRealization, riskScore } = topResult;
  
  // When logic
  let when = 'Sell within the next 1-2 days';
  if (analysis) {
    if (analysis.trend === 'rising') {
      when = 'Consider waiting 1-2 days for better prices';
    } else if (analysis.trend === 'falling') {
      when = 'Sell immediately';
    }
  }

  // How logic
  let how = 'Arrange transport for mandi sale';
  if (quantity > 2000) {
    how = 'Contact wholesale buyers or FPO for bulk sale';
  } else if (market.distanceFromHub <= 15) {
    how = 'Direct sale at mandi';
  }

  // Confidence logic
  let confidence = 'Medium';
  if (volatility > 0.15 || riskScore > 0.6) {
    confidence = 'Low';
  } else if (analysis?.trend === 'stable' && market.distanceFromHub < 50) {
    confidence = 'High';
  }

  // Why logic
  const why = [];
  why.push(`Offers best net realization of ₹${netRealization.toFixed(0)}`);
  
  if (allResults.length > 1) {
    const diff = netRealization - allResults[1].netRealization;
    why.push(`Provides ₹${diff.toFixed(0)} more profit than nearest alternative`);
  }
  
  if (analysis?.trend === 'rising') {
    why.push(`Upward price trend at this location`);
  }

  if (topResult.spoilageResult.spoilageRate < 0.05) {
    why.push('Low expected spoilage risk for this route');
  }

  return {
    market,
    where: market.name,
    when,
    how,
    why,
    confidence
  };
}
