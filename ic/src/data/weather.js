export const weatherData = {
  'yeshwanthpur': {
    location: 'Bangalore',
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    condition: 'sunny',
    forecast: [
      { temperature: 29, condition: 'sunny', rainfall: 0 },
      { temperature: 28, condition: 'cloudy', rainfall: 2 },
      { temperature: 27, condition: 'rainy', rainfall: 12 }
    ]
  },
  'kr-market': {
    location: 'Bangalore',
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    condition: 'sunny',
    forecast: [
      { temperature: 29, condition: 'sunny', rainfall: 0 },
      { temperature: 28, condition: 'cloudy', rainfall: 2 },
      { temperature: 27, condition: 'rainy', rainfall: 12 }
    ]
  },
  'hubli-dharwad': {
    location: 'Hubli',
    temperature: 36,
    humidity: 40,
    rainfall: 0,
    condition: 'sunny',
    forecast: [
      { temperature: 36, condition: 'sunny', rainfall: 0 },
      { temperature: 37, condition: 'sunny', rainfall: 0 },
      { temperature: 35, condition: 'cloudy', rainfall: 0 }
    ]
  },
  'mysuru': {
    location: 'Mysuru',
    temperature: 31,
    humidity: 85,
    rainfall: 15,
    condition: 'rainy',
    forecast: [
      { temperature: 30, condition: 'rainy', rainfall: 20 },
      { temperature: 31, condition: 'cloudy', rainfall: 5 },
      { temperature: 32, condition: 'sunny', rainfall: 0 }
    ]
  },
  'belgaum': {
    location: 'Belgaum',
    temperature: 33,
    humidity: 55,
    rainfall: 5,
    condition: 'cloudy',
    forecast: [
      { temperature: 33, condition: 'cloudy', rainfall: 0 },
      { temperature: 32, condition: 'cloudy', rainfall: 2 },
      { temperature: 31, condition: 'rainy', rainfall: 15 }
    ]
  }
};

export const getWeatherSpoilageMultiplier = (weather) => {
  if (!weather) return 1.0;
  
  let multiplier = 1.0;
  
  // Temperature effect
  if (weather.temperature > 35) {
    multiplier = 1.5;
  } else if (weather.temperature > 30) {
    multiplier = 1.2;
  }
  
  // Humidity effect
  if (weather.humidity > 80) {
    multiplier *= 1.3;
  }
  
  // Rainfall effect
  if (weather.rainfall > 10) {
    multiplier *= 1.2;
  }
  
  return multiplier;
};
