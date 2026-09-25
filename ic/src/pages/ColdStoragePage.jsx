import React, { useState, useMemo } from 'react';
import { 
  ThermometerSnowflake, Warehouse, Calendar, Clock, DollarSign, 
  TrendingUp, AlertOctagon, CheckCircle2, ChevronRight, Info, ShieldAlert,
  ArrowUpRight, Sparkles, Droplets, SunMedium
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Legend 
} from 'recharts';

export const coldStorageFacilities = [
  {
    id: 'kolar-cold-1',
    name: 'Kolar Agro Cold Chain Logistics Hub',
    location: 'Vemgal Industrial Area, Kolar',
    distanceKm: 62,
    totalCapacityMT: 5000,
    availableCapacityMT: 1450,
    tempRange: '2°C to 12°C',
    humidityRange: '85% - 95% RH',
    dailyRatePerKg: 0.035,
    enwrFinancingAvailable: true,
    supportedCrops: ['Tomato', 'Mango', 'Chilli', 'Capsicum'],
    contact: '+91 8152 243910'
  },
  {
    id: 'bengaluru-cold-2',
    name: 'Yeshwanthpur Terminal Controlled Atmosphere Depot',
    location: 'APMC Yard Gate 4, Bengaluru',
    distanceKm: 19,
    totalCapacityMT: 8000,
    availableCapacityMT: 890,
    tempRange: '0°C to 15°C',
    humidityRange: '90% - 98% RH',
    dailyRatePerKg: 0.045,
    enwrFinancingAvailable: true,
    supportedCrops: ['All Fruits & Vegetables', 'Onion', 'Potato'],
    contact: '+91 80 2337 8492'
  },
  {
    id: 'mysuru-cold-3',
    name: 'Cauvery Agri Cold Storage & Sorting Unit',
    location: 'Nanjangud Road, Mysuru',
    distanceKm: 148,
    totalCapacityMT: 3500,
    availableCapacityMT: 1200,
    tempRange: '3°C to 10°C',
    humidityRange: '85% - 90% RH',
    dailyRatePerKg: 0.030,
    enwrFinancingAvailable: true,
    supportedCrops: ['Mango', 'Banana', 'Vegetables'],
    contact: '+91 821 249 1104'
  },
  {
    id: 'hassan-potato-cold',
    name: 'Hassan Multi-Chamber Tuber & Cold Store',
    location: 'Boovanahalli, Hassan',
    distanceKm: 180,
    totalCapacityMT: 12000,
    availableCapacityMT: 3400,
    tempRange: '4°C to 8°C (CIPC treated)',
    humidityRange: '90% - 95% RH',
    dailyRatePerKg: 0.022,
    enwrFinancingAvailable: true,
    supportedCrops: ['Potato Seed & Table', 'Onion', 'Ginger'],
    contact: '+91 8172 268420'
  }
];

export default function ColdStoragePage() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [quantity, setQuantity] = useState(2000);
  const [currentMarketPrice, setCurrentMarketPrice] = useState(26);
  const [expectedFuturePrice, setExpectedFuturePrice] = useState(34);
  const [storageDays, setStorageDays] = useState(10);
  const [storageMethod, setStorageMethod] = useState('cold-chain');
  const [ambientTemp, setAmbientTemp] = useState(31);
  const [relativeHumidity, setRelativeHumidity] = useState(65);

  const cropPresets = {
    tomato: {
      name: 'Tomato',
      icon: '🍅',
      ambientShelfLife: 6,
      coldShelfLife: 24,
      optimalTemp: '10°C - 13°C',
      optimalRH: '90 - 95%',
      coldStorageSpoilagePerDay: 0.25, // % per day
      ambientSpoilagePerDay: 4.5,
      weightLossPerDay: 0.15
    },
    onion: {
      name: 'Onion',
      icon: '🧅',
      ambientShelfLife: 28,
      coldShelfLife: 150,
      optimalTemp: '0°C - 2°C',
      optimalRH: '65 - 70%',
      coldStorageSpoilagePerDay: 0.08,
      ambientSpoilagePerDay: 0.8,
      weightLossPerDay: 0.05
    },
    potato: {
      name: 'Potato',
      icon: '🥔',
      ambientShelfLife: 21,
      coldShelfLife: 120,
      optimalTemp: '4°C - 8°C',
      optimalRH: '90 - 95%',
      coldStorageSpoilagePerDay: 0.09,
      ambientSpoilagePerDay: 1.1,
      weightLossPerDay: 0.06
    },
    mango: {
      name: 'Mango',
      icon: '🥭',
      ambientShelfLife: 5,
      coldShelfLife: 20,
      optimalTemp: '12°C - 14°C',
      optimalRH: '85 - 90%',
      coldStorageSpoilagePerDay: 0.35,
      ambientSpoilagePerDay: 5.8,
      weightLossPerDay: 0.2
    }
  };

  const activeCrop = cropPresets[selectedCrop];

  // Storage cost calculations
  const dailyStorageRate = storageMethod === 'cold-chain' ? 0.035 : storageMethod === 'zecc' ? 0.008 : 0;
  const totalStorageFee = quantity * dailyStorageRate * storageDays;
  
  const dailySpoilageRate = storageMethod === 'cold-chain' 
    ? activeCrop.coldStorageSpoilagePerDay 
    : storageMethod === 'zecc' 
      ? activeCrop.ambientSpoilagePerDay * 0.45 
      : activeCrop.ambientSpoilagePerDay * (ambientTemp > 30 ? 1.4 : 1.0);

  const cumulativeSpoilagePct = Math.min(95, dailySpoilageRate * storageDays);
  const sellableWeight = Math.round(quantity * (1 - cumulativeSpoilagePct / 100));
  
  // Economics
  const immediateSellRevenue = quantity * currentMarketPrice;
  const delayedGrossRevenue = sellableWeight * expectedFuturePrice;
  const netDelayedRealization = delayedGrossRevenue - totalStorageFee;
  const netDifference = netDelayedRealization - immediateSellRevenue;
  const isProfitableToWait = netDifference > 0;

  // Chart data: 1 to 21 days
  const simulationChartData = useMemo(() => {
    const points = [];
    for (let day = 0; day <= 21; day += 1) {
      const coldSpoil = Math.min(95, day * activeCrop.coldStorageSpoilagePerDay);
      const ambientSpoil = Math.min(100, day * activeCrop.ambientSpoilagePerDay * (ambientTemp > 30 ? 1.3 : 1.0));
      
      const coldFee = quantity * 0.035 * day;
      const interpolatedPrice = currentMarketPrice + ((expectedFuturePrice - currentMarketPrice) * (day / 14));
      
      const coldNet = (quantity * (1 - coldSpoil / 100) * interpolatedPrice) - coldFee;
      const ambientNet = (quantity * (1 - ambientSpoil / 100) * interpolatedPrice);
      
      points.push({
        day: `Day ${day}`,
        coldSellablePct: Math.max(0, +(100 - coldSpoil).toFixed(1)),
        ambientSellablePct: Math.max(0, +(100 - ambientSpoil).toFixed(1)),
        coldNetRevenue: Math.round(coldNet),
        ambientNetRevenue: Math.round(ambientNet),
        immediateBaseline: immediateSellRevenue
      });
    }
    return points;
  }, [activeCrop, ambientTemp, currentMarketPrice, expectedFuturePrice, quantity, immediateSellRevenue]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-cyan-500/30">
              <ThermometerSnowflake className="w-3.5 h-3.5" /> Post-Harvest Preservation & Holding Economics
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Cold Storage & Shelf-Life Break-Even Optimizer
            </h1>
            <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
              Determine scientifically whether paying for cold storage to delay sales beats selling immediately at distress farmgate prices.
            </p>
          </div>
        </div>

        {/* Input Configuration & Simulation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Preservation & Price Parameters
            </h2>

            {/* Crop Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                Select Produce
              </label>
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(cropPresets).map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedCrop(key)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                      selectedCrop === key
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-lg mb-0.5">{cropPresets[key].icon}</div>
                    <div>{cropPresets[key].name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Lot Volume (Quantity):</span>
                <span className="text-indigo-600 font-bold">{quantity.toLocaleString()} kg</span>
              </div>
              <input 
                type="range" 
                min={200} 
                max={15000} 
                step={100}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Prices Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Today's Spot Price</label>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={currentMarketPrice}
                    onChange={(e) => setCurrentMarketPrice(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-900 font-bold text-sm focus:outline-indigo-500"
                  />
                  <span className="text-[11px] text-slate-400">/kg</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <label className="text-[11px] font-semibold text-emerald-700 block mb-1">Target Future Price</label>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={expectedFuturePrice}
                    onChange={(e) => setExpectedFuturePrice(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-2 py-1 text-emerald-900 font-bold text-sm focus:outline-emerald-500"
                  />
                  <span className="text-[11px] text-emerald-600">/kg</span>
                </div>
              </div>
            </div>

            {/* Storage Duration */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Planned Storage Holding Time:</span>
                <span className="text-indigo-600 font-bold">{storageDays} Days</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={30} 
                value={storageDays}
                onChange={(e) => setStorageDays(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Immediate (1d)</span>
                <span>10 Days</span>
                <span>20 Days</span>
                <span>30 Days</span>
              </div>
            </div>

            {/* Storage Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                Storage Method
              </label>
              <div className="space-y-2">
                {[
                  { id: 'cold-chain', label: 'Commercial Cold Storage Depot', sub: '₹0.035/kg/day • 90%+ quality retention', icon: ThermometerSnowflake },
                  { id: 'zecc', label: 'Zero Energy Cool Chamber (ZECC)', sub: '₹0.008/kg/day • On-farm evaporative cooler', icon: Droplets },
                  { id: 'ambient', label: 'Ambient Farm Shed Storage', sub: '₹0.00 • High heat decay risk', icon: SunMedium }
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setStorageMethod(opt.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      storageMethod === opt.id
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <opt.icon className={`w-5 h-5 mt-0.5 ${storageMethod === opt.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                      <div className="text-[11px] text-slate-500">{opt.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather inputs if ambient */}
            {storageMethod !== 'cold-chain' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <SunMedium className="w-4 h-4 text-amber-600" />
                  Farm Ambient Temperature: {ambientTemp}°C
                </div>
                <input
                  type="range"
                  min={20}
                  max={42}
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <p className="text-[11px] text-amber-700">
                  {ambientTemp > 32 
                    ? '⚠️ Extreme heat accelerates microbial decay, ethylene production, and moisture shriveling.' 
                    : 'Moderate ambient conditions.'}
                </p>
              </div>
            )}

          </div>

          {/* Decision Verdict & Financial Comparison */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Recommendation Card */}
            <div className={`p-6 rounded-2xl border shadow-md transition-all ${
              isProfitableToWait 
                ? 'bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white border-emerald-500/30' 
                : 'bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 text-white border-rose-500/30'
            }`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 ${
                    isProfitableToWait ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {isProfitableToWait ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertOctagon className="w-3.5 h-3.5" />}
                    {isProfitableToWait ? 'Holding Recommended' : 'Immediate Sale Advised'}
                  </div>
                  <h3 className="text-2xl font-black">
                    {isProfitableToWait 
                      ? `Store for ${storageDays} Days → Gain +₹${Math.abs(netDifference).toLocaleString()} Net Extra`
                      : `Sell Now → Storing Leads to ₹${Math.abs(netDifference).toLocaleString()} Net Loss`}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    {isProfitableToWait
                      ? `The anticipated price bump of ₹${expectedFuturePrice - currentMarketPrice}/kg overcomes the ₹${Math.round(totalStorageFee).toLocaleString()} storage rent and ${(cumulativeSpoilagePct).toFixed(1)}% expected moisture/spoilage loss.`
                      : `Produce degradation and holding fees outpace expected price gains. Fresh spot sale preserves higher net liquidity.`}
                  </p>
                </div>
              </div>

              {/* Economic Summary Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-300 font-medium">Spot Sale Income</div>
                  <div className="text-lg font-black text-white mt-0.5">₹{immediateSellRevenue.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">@ ₹{currentMarketPrice}/kg today</div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-300 font-medium">Est. Storage Fees</div>
                  <div className="text-lg font-black text-rose-300 mt-0.5">- ₹{Math.round(totalStorageFee).toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">{storageDays} days holding</div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-300 font-medium">Sellable Quantity</div>
                  <div className="text-lg font-black text-amber-300 mt-0.5">{sellableWeight.toLocaleString()} kg</div>
                  <div className="text-[10px] text-slate-400">{cumulativeSpoilagePct.toFixed(1)}% spoilage</div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-300 font-medium">Net Realization</div>
                  <div className={`text-lg font-black mt-0.5 ${isProfitableToWait ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{Math.round(netDelayedRealization).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">₹{(netDelayedRealization / quantity).toFixed(1)}/kg effective</div>
                </div>
              </div>
            </div>

            {/* Quality Retention & Revenue Trajectory Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    21-Day Holding Revenue Trajectory: Cold Chain vs Ambient Shed
                  </h4>
                  <p className="text-xs text-slate-500">
                    Net cash realization considering continuous spoilage deterioration and daily rental fees
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationChartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} interval={2} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="₹" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(val, name) => [
                        `₹${Number(val).toLocaleString()}`, 
                        name === 'coldNetRevenue' ? 'Cold Storage Net' : name === 'ambientNetRevenue' ? 'Ambient Shed Net' : 'Immediate Spot Sale'
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    <Line type="monotone" dataKey="coldNetRevenue" name="Cold Chain Net Realization" stroke="#059669" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="ambientNetRevenue" name="Ambient Shed Net Realization" stroke="#dc2626" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="immediateBaseline" name="Immediate Sell Today Baseline" stroke="#64748b" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* Cold Storage Facility Locator */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-indigo-600" />
                Verified Cold Storage Units & e-NWR Depots
              </h3>
              <p className="text-xs text-slate-500">
                Partner cold rooms with WDRA accredited Electronic Negotiable Warehouse Receipt (e-NWR) pledge loan support
              </p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold border border-indigo-200">
              NABARD / WDRA Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coldStorageFacilities.map((facility) => (
              <div key={facility.id} className="p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{facility.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{facility.location} • {facility.distanceKm} km away</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-lg">
                    ₹{facility.dailyRatePerKg} / kg / day
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-white rounded-lg border border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400">Available Space</div>
                    <div className="font-bold text-slate-800">{facility.availableCapacityMT} MT</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Temp Range</div>
                    <div className="font-bold text-slate-800">{facility.tempRange}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Humidity</div>
                    <div className="font-bold text-slate-800">{facility.humidityRange}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    e-NWR 75% Pledge Loan
                  </div>
                  <a 
                    href={`tel:${facility.contact}`}
                    className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                  >
                    Book Space <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
