import { getWeatherSpoilageMultiplier } from '../data/weather.js';
import { getCurrentPrice } from '../data/historicalPrices.js';

export const estimateSpoilage = ({ crop, quantity, market, weather, harvestDate }) => {
  const factors = [];
  
  // Time factors
  const travelTimeHours = market.distanceFromHub / 40; // avg speed 40km/h
  const travelTimeDays = travelTimeHours / 24;
  const totalTimeDays = travelTimeDays + 0.5; // handling time
  
  factors.push(`Travel and handling time: ${totalTimeDays.toFixed(1)} days`);
  
  // Environmental factors
  const weatherMultiplier = getWeatherSpoilageMultiplier(weather);
  if (weatherMultiplier > 1) {
    factors.push(`Unfavorable weather conditions increased spoilage risk by ${(weatherMultiplier - 1) * 100}%`);
  }
  
  // Grade factors - assuming grade is passed, if not default to 'A'
  // In this simple model we'll assume grade is always available or default to 1.0
  let gradeMultiplier = 1.0;
  // If crop grades exist, find the first or default
  if (crop.grades && crop.grades.length > 0) {
    // Just a basic fallback, decision engine handles grade explicitly if needed
    gradeMultiplier = 1 / crop.grades[0].qualityMultiplier; 
  }
  
  // Calculate rate
  let dailySpoilageRate = crop.baseSpoilageRate * weatherMultiplier * gradeMultiplier;
  let spoilageRate = 1 - Math.pow(1 - dailySpoilageRate, totalTimeDays);
  
  // Shelf life check
  const daysSinceHarvest = harvestDate ? 
    (new Date().getTime() - new Date(harvestDate).getTime()) / (1000 * 3600 * 24) : 0;
    
  if (daysSinceHarvest + totalTimeDays > crop.shelfLifeDays) {
    spoilageRate += 0.3; // Significant penalty for exceeding shelf life
    factors.push(`Warning: Product will exceed shelf life of ${crop.shelfLifeDays} days during transit`);
  }
  
  // Cap at 50%
  spoilageRate = Math.min(spoilageRate, 0.5);
  
  const spoiledQuantity = quantity * spoilageRate;
  const sellableQuantity = quantity - spoiledQuantity;
  
  const currentPrice = getCurrentPrice(crop.id, market.id);
  const spoilageLoss = spoiledQuantity * currentPrice;
  
  return {
    spoilageRate,
    spoiledQuantity,
    sellableQuantity,
    spoilageLoss,
    factors
  };
};
