export const markets = [
  {
    id: 'yeshwanthpur',
    name: 'Yeshwanthpur APMC',
    location: 'Bangalore',
    distanceFromHub: 15,
    transportCostPerKm: 8,
    latitude: 13.0239,
    longitude: 77.5458,
    type: 'mandi'
  },
  {
    id: 'kr-market',
    name: 'KR Market',
    location: 'Bangalore',
    distanceFromHub: 10,
    transportCostPerKm: 10,
    latitude: 12.9647,
    longitude: 77.5755,
    type: 'retail'
  },
  {
    id: 'hubli-dharwad',
    name: 'Hubli-Dharwad APMC',
    location: 'Hubli',
    distanceFromHub: 400,
    transportCostPerKm: 5,
    latitude: 15.3647,
    longitude: 75.1240,
    type: 'mandi'
  },
  {
    id: 'mysuru',
    name: 'Mysuru APMC',
    location: 'Mysuru',
    distanceFromHub: 150,
    transportCostPerKm: 6,
    latitude: 12.2958,
    longitude: 76.6394,
    type: 'mandi'
  },
  {
    id: 'belgaum',
    name: 'Belgaum Market',
    location: 'Belgaum',
    distanceFromHub: 500,
    transportCostPerKm: 4.5,
    latitude: 15.8497,
    longitude: 74.4977,
    type: 'wholesale'
  }
];

export const getMarketById = (id) => markets.find(m => m.id === id);

export const calculateTransportCost = (market, quantity) => {
  return market.distanceFromHub * market.transportCostPerKm * (1 + quantity / 5000);
};
