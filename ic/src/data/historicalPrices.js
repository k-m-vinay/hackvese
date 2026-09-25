const generatePriceData = (min, max, volatility, days = 30) => {
  const data = [];
  const today = new Date();
  let currentPrice = min + (max - min) / 2;
  
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay();
    
    // Random walk with mean reversion
    let change = (Math.random() - 0.5) * volatility;
    
    // Mean reversion
    if (currentPrice > max) change -= volatility * 0.5;
    if (currentPrice < min) change += volatility * 0.5;
    
    // Weekend effect (higher demand/prices)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      change += volatility * 0.3;
    }
    
    currentPrice = Math.max(min, Math.min(max, currentPrice + change));
    
    data.push({
      date: d.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  return data;
};

const marketIds = ['yeshwanthpur', 'kr-market', 'hubli-dharwad', 'mysuru', 'belgaum'];
const cropConfigs = {
  'tomato': { min: 25, max: 40, volatility: 5 },
  'onion': { min: 18, max: 35, volatility: 3 },
  'potato': { min: 15, max: 25, volatility: 1.5 },
  'wheat': { min: 22, max: 30, volatility: 0.5 },
  'rice': { min: 35, max: 50, volatility: 1 },
  'mango': { min: 40, max: 80, volatility: 6 }
};

export const historicalPrices = {};

// Generate data for all crops and markets
Object.entries(cropConfigs).forEach(([cropId, config]) => {
  historicalPrices[cropId] = {};
  marketIds.forEach(marketId => {
    // Add some regional price difference
    let regionalModifier = 1.0;
    if (marketId === 'kr-market') regionalModifier = 1.1; // Retail is higher
    if (marketId === 'hubli-dharwad') regionalModifier = 0.9;
    
    historicalPrices[cropId][marketId] = generatePriceData(
      config.min * regionalModifier,
      config.max * regionalModifier,
      config.volatility * regionalModifier
    );
  });
});

export const getCurrentPrice = (cropId, marketId) => {
  try {
    const history = historicalPrices[cropId][marketId];
    return history[history.length - 1].price;
  } catch (e) {
    return 0;
  }
};

export const getPriceHistory = (cropId, marketId) => {
  try {
    return historicalPrices[cropId][marketId] || [];
  } catch (e) {
    return [];
  }
};
