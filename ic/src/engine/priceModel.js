export const analyzePriceTrend = (priceHistory) => {
  if (!priceHistory || priceHistory.length < 14) {
    return null;
  }
  
  const currentPrice = priceHistory[priceHistory.length - 1].price;
  
  // Calculate min/max
  const prices = priceHistory.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  // Moving averages
  const last7 = prices.slice(-7);
  const prev7 = prices.slice(-14, -7);
  
  const movingAverage7 = last7.reduce((a, b) => a + b, 0) / 7;
  const movingAverage14 = prev7.reduce((a, b) => a + b, 0) / 7; // Technically average of prev 7 days
  
  const percentageChange7d = ((movingAverage7 - movingAverage14) / movingAverage14) * 100;
  
  // Trend
  let trend = 'stable';
  if (percentageChange7d > 2.5) trend = 'rising';
  if (percentageChange7d < -2.5) trend = 'falling';
  
  // Forecast next 3 days (simple linear extrapolation from 7d trend)
  const dailyTrend = (movingAverage7 - movingAverage14) / 7;
  const forecast3d = [
    parseFloat((currentPrice + dailyTrend).toFixed(2)),
    parseFloat((currentPrice + dailyTrend * 2).toFixed(2)),
    parseFloat((currentPrice + dailyTrend * 3).toFixed(2))
  ];
  
  return {
    trend,
    avgPrice,
    minPrice,
    maxPrice,
    currentPrice,
    movingAverage7,
    movingAverage14,
    percentageChange7d,
    forecast3d
  };
};

export const getExpectedPrice = (crop, market) => {
  const { getPriceHistory } = require('../data/historicalPrices.js');
  const history = getPriceHistory(crop.id, market.id);
  
  if (!history || history.length === 0) return 0;
  
  const analysis = analyzePriceTrend(history);
  if (!analysis) return history[history.length - 1].price;
  
  // Expected price is a weighted average of current and next day forecast
  return (analysis.currentPrice * 0.7) + (analysis.forecast3d[0] * 0.3);
};

export const getPriceVolatility = (priceHistory) => {
  if (!priceHistory || priceHistory.length === 0) return 0;
  
  const prices = priceHistory.map(p => p.price);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  
  // Coefficient of Variation
  return stdDev / mean;
};
