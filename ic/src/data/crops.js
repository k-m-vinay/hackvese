export const crops = [
  {
    id: 'tomato',
    name: 'Tomato',
    shelfLifeDays: 7,
    baseSpoilageRate: 0.03,
    grades: [
      { grade: 'A', qualityMultiplier: 1.0 },
      { grade: 'B', qualityMultiplier: 0.85 },
      { grade: 'C', qualityMultiplier: 0.7 }
    ],
    season: 'All',
    icon: '🍅'
  },
  {
    id: 'onion',
    name: 'Onion',
    shelfLifeDays: 30,
    baseSpoilageRate: 0.005,
    grades: [
      { grade: 'A', qualityMultiplier: 1.0 },
      { grade: 'B', qualityMultiplier: 0.9 },
      { grade: 'C', qualityMultiplier: 0.75 }
    ],
    season: 'All',
    icon: '🧅'
  },
  {
    id: 'potato',
    name: 'Potato',
    shelfLifeDays: 21,
    baseSpoilageRate: 0.008,
    grades: [
      { grade: 'A', qualityMultiplier: 1.0 },
      { grade: 'B', qualityMultiplier: 0.88 },
      { grade: 'C', qualityMultiplier: 0.72 }
    ],
    season: 'All',
    icon: '🥔'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    shelfLifeDays: 180,
    baseSpoilageRate: 0.001,
    grades: [
      { grade: 'A', qualityMultiplier: 1.0 },
      { grade: 'B', qualityMultiplier: 0.92 },
      { grade: 'C', qualityMultiplier: 0.8 }
    ],
    season: 'Winter',
    icon: '🌾'
  },
  {
    id: 'rice',
    name: 'Rice',
    shelfLifeDays: 180,
    baseSpoilageRate: 0.001,
    grades: [
      { grade: 'A', qualityMultiplier: 1.0 },
      { grade: 'B', qualityMultiplier: 0.9 },
      { grade: 'C', qualityMultiplier: 0.78 }
    ],
    season: 'Summer',
    icon: '🍚'
  },
  {
    id: 'mango',
    name: 'Mango',
    shelfLifeDays: 5,
    baseSpoilageRate: 0.04,
    grades: [
      { grade: 'A', qualityMultiplier: 1.0 },
      { grade: 'B', qualityMultiplier: 0.82 },
      { grade: 'C', qualityMultiplier: 0.65 }
    ],
    season: 'Summer',
    icon: '🥭'
  }
];

export const getCropById = (id) => crops.find(c => c.id === id);
export const getCropByName = (name) => crops.find(c => c.name.toLowerCase() === name.toLowerCase());
