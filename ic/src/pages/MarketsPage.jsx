import React, { useState, useMemo } from 'react';
import { 
  Building2, Search, TrendingUp, TrendingDown, MapPin, 
  Truck, ArrowRight, ShieldCheck, RefreshCw, BarChart3, 
  SlidersHorizontal, CheckCircle2, AlertTriangle, Layers, Info
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, LineChart, Line, CartesianGrid 
} from 'recharts';

export const mandiDatabase = [
  {
    id: 'kolar',
    name: 'Kolar APMC Mandi',
    district: 'Kolar',
    distanceKm: 68,
    type: 'APMC Super-Yard',
    tradingStatus: 'Active (Peak Trading)',
    operatingHours: '04:30 AM - 01:00 PM',
    crops: {
      tomato: { modalPrice: 32, minPrice: 26, maxPrice: 38, arrivalQty: 1850, trend: +3.2, qualityPremium: 'Grade A +15%' },
      onion: { modalPrice: 28, minPrice: 22, maxPrice: 33, arrivalQty: 920, trend: -1.4, qualityPremium: 'Grade A +10%' },
      potato: { modalPrice: 24, minPrice: 19, maxPrice: 27, arrivalQty: 640, trend: +0.8, qualityPremium: 'Grade A +8%' },
      mango: { modalPrice: 65, minPrice: 48, maxPrice: 82, arrivalQty: 410, trend: +5.0, qualityPremium: 'Grade A +20%' },
      wheat: { modalPrice: 29, minPrice: 25, maxPrice: 31, arrivalQty: 310, trend: 0.0, qualityPremium: 'Grade A +5%' },
      rice: { modalPrice: 38, minPrice: 34, maxPrice: 42, arrivalQty: 550, trend: +1.1, qualityPremium: 'Grade A +7%' }
    },
    features: ['E-NAM Integrated', 'Cold Room (500 MT)', 'Assay Lab', 'Direct Weighbridge'],
    commissionFee: '1.5%',
    liquidity: 'Very High',
    badge: 'Asia’s 2nd Largest Tomato Hub'
  },
  {
    id: 'yeshwanthpur',
    name: 'Yeshwanthpur APMC',
    district: 'Bengaluru Urban',
    distanceKm: 18,
    type: 'APMC Mandi',
    tradingStatus: 'Active',
    operatingHours: '05:00 AM - 03:00 PM',
    crops: {
      tomato: { modalPrice: 30, minPrice: 24, maxPrice: 35, arrivalQty: 2200, trend: +1.8, qualityPremium: 'Grade A +12%' },
      onion: { modalPrice: 31, minPrice: 25, maxPrice: 36, arrivalQty: 1450, trend: +2.1, qualityPremium: 'Grade A +14%' },
      potato: { modalPrice: 26, minPrice: 21, maxPrice: 30, arrivalQty: 1100, trend: +1.5, qualityPremium: 'Grade A +10%' },
      mango: { modalPrice: 72, minPrice: 55, maxPrice: 90, arrivalQty: 380, trend: +4.2, qualityPremium: 'Grade A +18%' },
      wheat: { modalPrice: 31, minPrice: 27, maxPrice: 34, arrivalQty: 780, trend: +0.5, qualityPremium: 'Grade A +6%' },
      rice: { modalPrice: 41, minPrice: 36, maxPrice: 46, arrivalQty: 920, trend: +1.6, qualityPremium: 'Grade A +8%' }
    },
    features: ['Metro Connectivity', 'Terminal Market Hub', 'Daily e-NAM Tenders', 'Cold Chain Hub'],
    commissionFee: '2.0%',
    liquidity: 'Exceptional',
    badge: 'Capital Metro Terminal'
  },
  {
    id: 'kr-market',
    name: 'KR Market (City Wholesale)',
    district: 'Bengaluru Central',
    distanceKm: 12,
    type: 'Direct Wholesale/Retail',
    tradingStatus: 'High Volume Trading',
    operatingHours: '03:00 AM - 12:00 PM',
    crops: {
      tomato: { modalPrice: 34, minPrice: 28, maxPrice: 40, arrivalQty: 980, trend: +4.0, qualityPremium: 'Direct Buyer Premium' },
      onion: { modalPrice: 33, minPrice: 27, maxPrice: 38, arrivalQty: 820, trend: +1.9, qualityPremium: 'Grade A +12%' },
      potato: { modalPrice: 27, minPrice: 22, maxPrice: 31, arrivalQty: 600, trend: +0.9, qualityPremium: 'Grade A +8%' },
      mango: { modalPrice: 78, minPrice: 60, maxPrice: 98, arrivalQty: 250, trend: +6.1, qualityPremium: 'Retail Premium +25%' },
      wheat: { modalPrice: 30, minPrice: 26, maxPrice: 33, arrivalQty: 220, trend: 0.0, qualityPremium: 'Standard' },
      rice: { modalPrice: 43, minPrice: 38, maxPrice: 48, arrivalQty: 410, trend: +2.0, qualityPremium: 'Grade A +10%' }
    },
    features: ['Instant Cash Settlement', 'Restaurant & Bulk Buyers', 'No Mandi Cess on Retail', 'High Demand'],
    commissionFee: '1.0% + Porterage',
    liquidity: 'High',
    badge: 'Direct Consumption Demand'
  },
  {
    id: 'mysuru',
    name: 'Mysuru Bandipalya APMC',
    district: 'Mysuru',
    distanceKm: 145,
    type: 'APMC Regional Hub',
    tradingStatus: 'Active',
    operatingHours: '05:30 AM - 02:00 PM',
    crops: {
      tomato: { modalPrice: 27, minPrice: 22, maxPrice: 32, arrivalQty: 890, trend: -0.8, qualityPremium: 'Grade A +10%' },
      onion: { modalPrice: 29, minPrice: 24, maxPrice: 34, arrivalQty: 760, trend: +0.5, qualityPremium: 'Grade A +9%' },
      potato: { modalPrice: 25, minPrice: 20, maxPrice: 29, arrivalQty: 540, trend: +0.4, qualityPremium: 'Grade A +7%' },
      mango: { modalPrice: 62, minPrice: 45, maxPrice: 75, arrivalQty: 520, trend: -1.2, qualityPremium: 'Local Alphonso Premium' },
      wheat: { modalPrice: 28, minPrice: 24, maxPrice: 31, arrivalQty: 410, trend: -0.5, qualityPremium: 'Grade A +5%' },
      rice: { modalPrice: 40, minPrice: 35, maxPrice: 44, arrivalQty: 680, trend: +1.0, qualityPremium: 'Grade A +8%' }
    },
    features: ['Highway Access NH-275', 'Direct FPO Allotment', 'Warehouse Receipt Financing'],
    commissionFee: '1.5%',
    liquidity: 'Moderate to High',
    badge: 'Southern Karnataka Center'
  },
  {
    id: 'hubli-dharwad',
    name: 'Hubballi Amargol APMC',
    district: 'Dharwad',
    distanceKm: 410,
    type: 'State Mega Market',
    tradingStatus: 'High Volume Trading',
    operatingHours: '06:00 AM - 04:00 PM',
    crops: {
      tomato: { modalPrice: 25, minPrice: 20, maxPrice: 30, arrivalQty: 1650, trend: -2.1, qualityPremium: 'Grade A +8%' },
      onion: { modalPrice: 27, minPrice: 21, maxPrice: 32, arrivalQty: 2400, trend: -3.5, qualityPremium: 'North-KA Hub' },
      potato: { modalPrice: 23, minPrice: 18, maxPrice: 26, arrivalQty: 1300, trend: -1.0, qualityPremium: 'Grade A +6%' },
      mango: { modalPrice: 58, minPrice: 42, maxPrice: 70, arrivalQty: 690, trend: -2.0, qualityPremium: 'Grade A +12%' },
      wheat: { modalPrice: 27, minPrice: 23, maxPrice: 30, arrivalQty: 1800, trend: -0.3, qualityPremium: 'Durum Wheat Spec' },
      rice: { modalPrice: 37, minPrice: 32, maxPrice: 41, arrivalQty: 1250, trend: +0.4, qualityPremium: 'Grade A +6%' }
    },
    features: ['Rail Siding Terminal', 'Export Quality Testing', 'Private Cold Storage (2,000 MT)'],
    commissionFee: '1.5%',
    liquidity: 'Very High',
    badge: 'North Karnataka Gateway'
  },
  {
    id: 'belagavi',
    name: 'Belagavi APMC Market',
    district: 'Belagavi',
    distanceKm: 505,
    type: 'Inter-State Border Hub',
    tradingStatus: 'Active',
    operatingHours: '05:00 AM - 02:30 PM',
    crops: {
      tomato: { modalPrice: 26, minPrice: 20, maxPrice: 31, arrivalQty: 1100, trend: +0.5, qualityPremium: 'Grade A +9%' },
      onion: { modalPrice: 28, minPrice: 23, maxPrice: 33, arrivalQty: 1850, trend: +1.2, qualityPremium: 'Maharashtra Transit' },
      potato: { modalPrice: 24, minPrice: 19, maxPrice: 28, arrivalQty: 950, trend: +0.6, qualityPremium: 'Grade A +7%' },
      mango: { modalPrice: 60, minPrice: 46, maxPrice: 76, arrivalQty: 480, trend: +1.5, qualityPremium: 'Ratnagiri Route' },
      wheat: { modalPrice: 28, minPrice: 24, maxPrice: 31, arrivalQty: 1150, trend: 0.0, qualityPremium: 'Grade A +5%' },
      rice: { modalPrice: 39, minPrice: 34, maxPrice: 43, arrivalQty: 840, trend: +0.8, qualityPremium: 'Grade A +7%' }
    },
    features: ['Goa & MH Transit Link', 'Border Arbitrage Advantage', 'Weigh-in-Motion Bridge'],
    commissionFee: '1.8%',
    liquidity: 'High',
    badge: 'Cross-Border Trading Hub'
  },
  {
    id: 'davanagere',
    name: 'Davanagere APMC Market',
    district: 'Davanagere',
    distanceKm: 260,
    type: 'Central APMC',
    tradingStatus: 'Active',
    operatingHours: '06:00 AM - 01:30 PM',
    crops: {
      tomato: { modalPrice: 28, minPrice: 22, maxPrice: 33, arrivalQty: 740, trend: +1.2, qualityPremium: 'Grade A +11%' },
      onion: { modalPrice: 29, minPrice: 24, maxPrice: 35, arrivalQty: 890, trend: +0.8, qualityPremium: 'Grade A +10%' },
      potato: { modalPrice: 25, minPrice: 20, maxPrice: 29, arrivalQty: 420, trend: +0.3, qualityPremium: 'Grade A +7%' },
      mango: { modalPrice: 64, minPrice: 48, maxPrice: 78, arrivalQty: 310, trend: +2.1, qualityPremium: 'Grade A +14%' },
      wheat: { modalPrice: 29, minPrice: 25, maxPrice: 32, arrivalQty: 620, trend: +0.2, qualityPremium: 'Grade A +6%' },
      rice: { modalPrice: 40, minPrice: 35, maxPrice: 45, arrivalQty: 780, trend: +1.3, qualityPremium: 'Grade A +8%' }
    },
    features: ['Central Karnataka Hub', 'Processing Mill Tie-ups', 'Direct e-NAM Clearing'],
    commissionFee: '1.5%',
    liquidity: 'Moderate',
    badge: 'Central Ag Hub'
  },
  {
    id: 'hassan',
    name: 'Hassan APMC Market',
    district: 'Hassan',
    distanceKm: 185,
    type: 'Sub-Regional Mandi',
    tradingStatus: 'Active',
    operatingHours: '06:30 AM - 01:00 PM',
    crops: {
      tomato: { modalPrice: 27, minPrice: 21, maxPrice: 31, arrivalQty: 620, trend: -0.5, qualityPremium: 'Grade A +8%' },
      onion: { modalPrice: 28, minPrice: 22, maxPrice: 33, arrivalQty: 540, trend: -0.2, qualityPremium: 'Grade A +7%' },
      potato: { modalPrice: 26, minPrice: 21, maxPrice: 31, arrivalQty: 890, trend: +1.9, qualityPremium: 'Hassan Potato Hub Special' },
      mango: { modalPrice: 61, minPrice: 44, maxPrice: 74, arrivalQty: 290, trend: +1.0, qualityPremium: 'Grade A +10%' },
      wheat: { modalPrice: 28, minPrice: 24, maxPrice: 31, arrivalQty: 290, trend: 0.0, qualityPremium: 'Grade A +5%' },
      rice: { modalPrice: 39, minPrice: 34, maxPrice: 43, arrivalQty: 510, trend: +0.6, qualityPremium: 'Grade A +7%' }
    },
    features: ['Major Potato Growing Belt', 'Grading & Sorting Center', 'Farmer Rest House'],
    commissionFee: '1.5%',
    liquidity: 'Moderate',
    badge: 'Karnataka Potato Capital'
  }
];

export default function MarketsPage() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [comparedMandiIds, setComparedMandiIds] = useState(['kolar', 'yeshwanthpur']);
  const [quantity, setQuantity] = useState(1000);

  const cropNames = [
    { id: 'tomato', name: 'Tomato', icon: '🍅' },
    { id: 'onion', name: 'Onion', icon: '🧅' },
    { id: 'potato', name: 'Potato', icon: '🥔' },
    { id: 'mango', name: 'Mango', icon: '🥭' },
    { id: 'wheat', name: 'Wheat', icon: '🌾' },
    { id: 'rice', name: 'Rice', icon: '🍚' }
  ];

  const districts = ['all', ...Array.from(new Set(mandiDatabase.map(m => m.district)))];

  const filteredMandis = useMemo(() => {
    return mandiDatabase.filter(mandi => {
      const matchesSearch = mandi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            mandi.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict = selectedDistrict === 'all' || mandi.district === selectedDistrict;
      return matchesSearch && matchesDistrict;
    });
  }, [searchQuery, selectedDistrict]);

  const chartData = useMemo(() => {
    return filteredMandis.map(m => {
      const cropData = m.crops[selectedCrop] || { modalPrice: 0 };
      return {
        name: m.name.replace(' APMC', '').replace(' Market', ''),
        modalPrice: cropData.modalPrice,
        minPrice: cropData.minPrice,
        maxPrice: cropData.maxPrice,
        distance: m.distanceKm,
        arrivals: cropData.arrivalQty
      };
    }).sort((a, b) => b.modalPrice - a.modalPrice);
  }, [filteredMandis, selectedCrop]);

  const toggleCompare = (mandiId) => {
    if (comparedMandiIds.includes(mandiId)) {
      if (comparedMandiIds.length > 1) {
        setComparedMandiIds(comparedMandiIds.filter(id => id !== mandiId));
      }
    } else {
      if (comparedMandiIds.length < 3) {
        setComparedMandiIds([...comparedMandiIds, mandiId]);
      } else {
        setComparedMandiIds([comparedMandiIds[1], comparedMandiIds[2], mandiId]);
      }
    }
  };

  const comparedMandis = mandiDatabase.filter(m => comparedMandiIds.includes(m.id));

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Mandi Intelligence & e-NAM Feed
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Real-Time Mandi Explorer & Arbitrage Engine
            </h1>
            <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
              Track arrival volumes, modal price spreads, and transport premiums across Karnataka’s primary mandis to uncover where true net margins reside.
            </p>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            
            {/* Crop Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {cropNames.map(crop => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCrop === crop.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{crop.icon}</span>
                  <span>{crop.name}</span>
                </button>
              ))}
            </div>

            {/* Lot size input */}
            <div className="flex items-center gap-2 text-sm bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <span className="text-slate-500 font-medium">Farmer Quantity:</span>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(100, Number(e.target.value)))}
                className="w-24 bg-white border border-slate-300 rounded px-2 py-0.5 text-slate-900 font-bold text-right focus:outline-emerald-500"
              />
              <span className="text-slate-500">kg</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
            {/* Search Input */}
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search mandi name or district (e.g., Kolar, Yeshwanthpur, Dharwad)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* District Filter */}
            <div className="sm:col-span-4">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent capitalize"
              >
                <option value="all">All Districts ({mandiDatabase.length} Mandis)</option>
                {districts.filter(d => d !== 'all').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Visual Price Comparison Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Modal Mandi Prices for {cropNames.find(c => c.id === selectedCrop)?.name} (₹/kg)
              </h2>
              <p className="text-xs text-slate-500">
                Comparing current trading prices across active regional mandis sorted by peak realization
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> High Price</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-500 inline-block" /> Moderate</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Base Price</span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#475569' }} 
                  interval={0} 
                  angle={-15} 
                  textAnchor="end" 
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#475569' }} 
                  unit="₹" 
                  domain={[0, 'dataMax + 10']} 
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-emerald-400">{data.name}</p>
                          <p>Modal Price: <span className="font-bold text-white">₹{data.modalPrice}/kg</span></p>
                          <p>Price Range: ₹{data.minPrice} - ₹{data.maxPrice}/kg</p>
                          <p>Daily Arrivals: {data.arrivals} Quintals</p>
                          <p>Est. Distance: {data.distance} km</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="modalPrice" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.modalPrice >= 32 ? '#059669' : entry.modalPrice >= 28 ? '#0d9488' : '#d97706'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Side-by-Side Arbitrage Sandbox */}
        <div className="bg-emerald-950 text-white p-6 rounded-2xl shadow-lg border border-emerald-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b border-emerald-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <SlidersHorizontal className="w-4 h-4" /> Live Arbitrage & Net Realization Compare
              </div>
              <h3 className="text-xl font-bold">
                Select up to 3 Mandis to Compare Net In-Hand Income for {quantity.toLocaleString()} kg of {cropNames.find(c => c.id === selectedCrop)?.name}
              </h3>
            </div>
            <div className="text-xs text-emerald-300 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-700">
              Transport estimated at ₹7.5/km baseline + spoilage factor
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparedMandis.map((mandi) => {
              const cropData = mandi.crops[selectedCrop] || { modalPrice: 25, trend: 0 };
              const grossRevenue = quantity * cropData.modalPrice;
              const transportCost = Math.round(mandi.distanceKm * 7.5 * (1 + quantity / 4000));
              const spoilageRate = mandi.distanceKm > 200 ? 0.06 : mandi.distanceKm > 50 ? 0.03 : 0.015;
              const spoilageCost = Math.round(grossRevenue * spoilageRate);
              const netRealization = grossRevenue - transportCost - spoilageCost;
              const effectivePricePerKg = (netRealization / quantity).toFixed(1);

              return (
                <div key={mandi.id} className="bg-slate-900/90 rounded-xl p-5 border border-emerald-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-emerald-400 uppercase">{mandi.district}</span>
                        <h4 className="font-bold text-white text-base">{mandi.name}</h4>
                      </div>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {mandi.distanceKm} km
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Modal Listed Price:</span>
                        <span className="font-bold text-white">₹{cropData.modalPrice}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Gross Sale Value:</span>
                        <span className="text-slate-200">₹{grossRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>Est. Transport Cost:</span>
                        <span>- ₹{transportCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-amber-400">
                        <span>Expected Spoilage ({(spoilageRate * 100).toFixed(1)}%):</span>
                        <span>- ₹{spoilageCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Net In-Hand Revenue</div>
                        <div className="text-2xl font-black text-emerald-400">₹{netRealization.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-slate-400">Effective Realization</div>
                        <div className="text-sm font-bold text-white">₹{effectivePricePerKg} / kg</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mandis Cards Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">
              Active Regional Mandis ({filteredMandis.length})
            </h3>
            <span className="text-xs text-slate-500">Click "Compare" to update sandbox above</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMandis.map((mandi) => {
              const cropData = mandi.crops[selectedCrop] || { modalPrice: 0, minPrice: 0, maxPrice: 0, arrivalQty: 0, trend: 0 };
              const isCompared = comparedMandiIds.includes(mandi.id);

              return (
                <div 
                  key={mandi.id} 
                  className={`bg-white rounded-xl p-5 border transition-all duration-200 shadow-sm ${
                    isCompared ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {mandi.district}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {mandi.distanceKm} km from hub
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{mandi.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{mandi.type} • {mandi.operatingHours}</p>
                    </div>

                    <button
                      onClick={() => toggleCompare(mandi.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                        isCompared 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isCompared ? 'Comparing ✓' : '+ Compare'}
                    </button>
                  </div>

                  {/* Price Banner */}
                  <div className="mt-4 bg-slate-50 rounded-lg p-3 grid grid-cols-3 gap-2 text-center border border-slate-100">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Modal Price</div>
                      <div className="text-lg font-black text-slate-900">₹{cropData.modalPrice}</div>
                      <div className="text-[10px] text-slate-400">per kg</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Min - Max Range</div>
                      <div className="text-xs font-bold text-slate-700 mt-1">₹{cropData.minPrice} - ₹{cropData.maxPrice}</div>
                      <div className="text-[10px] text-slate-400">spread ₹{cropData.maxPrice - cropData.minPrice}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Daily Arrivals</div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">{cropData.arrivalQty} Qtl</div>
                      <div className={`text-[10px] font-semibold flex items-center justify-center gap-0.5 ${cropData.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {cropData.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {cropData.trend > 0 ? `+${cropData.trend}%` : `${cropData.trend}%`}
                      </div>
                    </div>
                  </div>

                  {/* Features & Commission */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {mandi.features.map((feat, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <span>Mandi Cess: <strong className="text-slate-700">{mandi.commissionFee}</strong></span>
                    <span>Liquidity: <strong className="text-emerald-700">{mandi.liquidity}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
