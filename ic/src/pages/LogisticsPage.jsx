import React, { useState, useMemo } from 'react';
import { 
  Truck, Navigation, Fuel, Gauge, Users, ArrowRight, ShieldCheck, 
  MapPin, Clock, DollarSign, AlertCircle, Percent, Compass, PackageCheck,
  CheckCircle2, AlertTriangle, Layers
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';

export const vehicleFleet = [
  {
    id: 'piaggio-ape',
    name: '3-Wheeler Cargo (Ape / Bajaj)',
    category: 'Local / Short Haul',
    maxPayloadKg: 600,
    baseRatePerKm: 10,
    minFare: 450,
    loadingUnloadingFee: 200,
    idealDistanceKm: '0 - 35 km',
    coolingType: 'Open Bed / Tarpaulin',
    vibrationDamageRate: 0.035, // higher bump shock
    icon: '🛺'
  },
  {
    id: 'tata-ace',
    name: 'Mini Truck (Tata Ace "Chhota Hathi")',
    category: 'Medium Rural Haul',
    maxPayloadKg: 1200,
    baseRatePerKm: 14,
    minFare: 750,
    loadingUnloadingFee: 350,
    idealDistanceKm: '15 - 120 km',
    coolingType: 'Aerated Mesh Tarpaulin',
    vibrationDamageRate: 0.022,
    icon: '🛻'
  },
  {
    id: 'bolero-pickup',
    name: 'Mahindra Bolero Maxi Truck',
    category: 'Inter-District Feeder',
    maxPayloadKg: 2000,
    baseRatePerKm: 18,
    minFare: 1100,
    loadingUnloadingFee: 500,
    idealDistanceKm: '30 - 250 km',
    coolingType: 'Covered High Bed',
    vibrationDamageRate: 0.018,
    icon: '🚚'
  },
  {
    id: 'eicher-14ft',
    name: 'Eicher 14ft Heavy Canter',
    category: 'High Volume Mandi Transit',
    maxPayloadKg: 4500,
    baseRatePerKm: 24,
    minFare: 2200,
    loadingUnloadingFee: 900,
    idealDistanceKm: '80 - 600 km',
    coolingType: 'Air-Vented Container',
    vibrationDamageRate: 0.012,
    icon: '🚛'
  },
  {
    id: 'reefer-van',
    name: 'Refrigerated Reefer Truck (Cold Chain)',
    category: 'Perishable Express',
    maxPayloadKg: 3500,
    baseRatePerKm: 34,
    minFare: 3500,
    loadingUnloadingFee: 750,
    idealDistanceKm: '100 - 800 km',
    coolingType: 'Controlled 4°C - 12°C',
    vibrationDamageRate: 0.004,
    icon: '❄️'
  }
];

export default function LogisticsPage() {
  const [distanceKm, setDistanceKm] = useState(65);
  const [cargoWeightKg, setCargoWeightKg] = useState(1200);
  const [selectedVehicleId, setSelectedVehicleId] = useState('tata-ace');
  const [cropPerishability, setCropPerishability] = useState('high'); // 'high', 'medium', 'low'
  const [roadCondition, setRoadCondition] = useState('mixed'); // 'highway', 'mixed', 'rural'
  const [isGroupPooling, setIsGroupPooling] = useState(false);
  const [poolPartners, setPoolPartners] = useState(3);

  const vehicle = vehicleFleet.find(v => v.id === selectedVehicleId) || vehicleFleet[1];

  // Capacity calculations
  const totalCargoInVehicle = isGroupPooling ? cargoWeightKg * poolPartners : cargoWeightKg;
  const capacityUtilizationPct = Math.min(100, Math.round((totalCargoInVehicle / vehicle.maxPayloadKg) * 100));
  const isOverloaded = totalCargoInVehicle > vehicle.maxPayloadKg;

  // Road factor
  const roadFactor = roadCondition === 'highway' ? 0.95 : roadCondition === 'rural' ? 1.25 : 1.1;

  // Transit hours
  const avgSpeedKmh = roadCondition === 'highway' ? 55 : roadCondition === 'rural' ? 30 : 42;
  const transitHours = +(distanceKm / avgSpeedKmh).toFixed(1);

  // Toll estimation
  const tollCharges = distanceKm > 40 ? Math.round((distanceKm / 50) * 85) : 0;

  // Freight calculation
  const totalTripFreight = Math.max(
    vehicle.minFare,
    Math.round((distanceKm * vehicle.baseRatePerKm * roadFactor) + vehicle.loadingUnloadingFee + tollCharges)
  );

  // Per farmer share
  const farmerFreightShare = isGroupPooling ? Math.round(totalTripFreight / poolPartners) : totalTripFreight;
  const freightCostPerKg = +(farmerFreightShare / cargoWeightKg).toFixed(2);

  // Spoilage calculation
  const perishabilityMultiplier = cropPerishability === 'high' ? 1.8 : cropPerishability === 'medium' ? 1.0 : 0.4;
  const roadShockMultiplier = roadCondition === 'rural' ? 1.6 : roadCondition === 'highway' ? 0.8 : 1.1;
  const transitDamagePct = +(vehicle.vibrationDamageRate * 100 * perishabilityMultiplier * roadShockMultiplier * Math.max(1, transitHours / 2)).toFixed(1);
  const transitSpoilageLossValue = Math.round(cargoWeightKg * 28 * (transitDamagePct / 100)); // assuming ₹28 avg crop

  // Comparison data for all vehicles
  const vehicleComparisonData = useMemo(() => {
    return vehicleFleet.map(v => {
      const vTotal = Math.max(v.minFare, Math.round((distanceKm * v.baseRatePerKm * roadFactor) + v.loadingUnloadingFee + tollCharges));
      const canFit = cargoWeightKg <= v.maxPayloadKg;
      return {
        name: v.name.split(' ')[0],
        cost: vTotal,
        costPerKg: +(vTotal / cargoWeightKg).toFixed(2),
        maxPayload: v.maxPayloadKg,
        canFit
      };
    });
  }, [distanceKm, roadFactor, tollCharges, cargoWeightKg]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-amber-500/30">
              <Truck className="w-3.5 h-3.5" /> Farmgate-to-Mandi Freight & Fleet Optimizer
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Agri-Logistics & Transit Damage Calculator
            </h1>
            <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
              Model precise vehicle payload economics, transit vibration shock, road conditions, and collective FPO freight pooling to save up to 60% on transportation.
            </p>
          </div>
        </div>

        {/* Interactive Logistics Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-amber-600" />
              Route & Vehicle Selector
            </h2>

            {/* Distance Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Distance to Destination Mandi:</span>
                <span className="text-amber-600 font-bold">{distanceKm} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={500}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>5 km (Local)</span>
                <span>65 km (Kolar Hub)</span>
                <span>250 km</span>
                <span>500 km (Border)</span>
              </div>
            </div>

            {/* Cargo Weight */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Your Produce Weight:</span>
                <span className="text-amber-600 font-bold">{cargoWeightKg.toLocaleString()} kg</span>
              </div>
              <input
                type="range"
                min={200}
                max={5000}
                step={50}
                value={cargoWeightKg}
                onChange={(e) => setCargoWeightKg(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Vehicle Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                Select Fleet Vehicle
              </label>
              <div className="space-y-2">
                {vehicleFleet.map(v => {
                  const fits = (isGroupPooling ? cargoWeightKg * poolPartners : cargoWeightKg) <= v.maxPayloadKg;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicleId(v.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedVehicleId === v.id
                          ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">{v.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{v.name}</h4>
                          <span className="text-xs font-bold text-amber-700">₹{v.baseRatePerKm}/km</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                          <span>Max {v.maxPayloadKg} kg • {v.coolingType}</span>
                          {!fits && <span className="text-rose-600 font-semibold">Exceeds Cap</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Road Conditions */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Transit Corridor Road Surface
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'highway', label: 'NH Highway', sub: 'Smooth (0.9x wear)' },
                  { id: 'mixed', label: 'Mixed State/SH', sub: 'Standard (1.1x)' },
                  { id: 'rural', label: 'Rural Ghat / Potholes', sub: 'Rough (1.25x)' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRoadCondition(r.id)}
                    className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                      roadCondition === r.id
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div>{r.label}</div>
                    <div className="text-[10px] font-normal text-slate-400">{r.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Collective Freight Pooling Toggle */}
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-700" />
                  <div>
                    <div className="text-xs font-bold text-emerald-900">FPO Collective Freight Pooling</div>
                    <div className="text-[11px] text-emerald-700">Split full truckload with neighboring farmers</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isGroupPooling}
                  onChange={(e) => setIsGroupPooling(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {isGroupPooling && (
                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900">Number of participating farmers:</span>
                  <div className="flex items-center gap-2">
                    {[2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setPoolPartners(n)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold ${
                          poolPartners === n ? 'bg-emerald-700 text-white' : 'bg-white border border-emerald-300 text-emerald-800'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Results & Economic Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main KPI Card */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Compass className="w-3.5 h-3.5" /> Freight Route Breakdown
                  </div>
                  <h3 className="text-xl font-bold">
                    {distanceKm} km transit via {vehicle.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Est. Travel Time</div>
                  <div className="text-lg font-bold text-slate-100 flex items-center gap-1 justify-end">
                    <Clock className="w-4 h-4 text-amber-400" /> {transitHours} Hours
                  </div>
                </div>
              </div>

              {/* KPI Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="text-[11px] text-slate-400 font-medium">Your Freight Cost</div>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">₹{farmerFreightShare.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mt-1">₹{freightCostPerKg} per kg</div>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="text-[11px] text-slate-400 font-medium">Payload Capacity</div>
                  <div className={`text-2xl font-black mt-0.5 ${isOverloaded ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {capacityUtilizationPct}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {totalCargoInVehicle} / {vehicle.maxPayloadKg} kg
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="text-[11px] text-slate-400 font-medium">Vibration Spoilage</div>
                  <div className="text-2xl font-black text-rose-400 mt-0.5">{transitDamagePct}%</div>
                  <div className="text-[10px] text-slate-400 mt-1">~₹{transitSpoilageLossValue} lost</div>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="text-[11px] text-slate-400 font-medium">FPO Pool Savings</div>
                  <div className="text-2xl font-black text-teal-400 mt-0.5">
                    {isGroupPooling ? `₹${(totalTripFreight - farmerFreightShare).toLocaleString()}` : '0%'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {isGroupPooling ? `${poolPartners}x shared` : 'Solo booking'}
                  </div>
                </div>
              </div>

              {/* Overload Alert */}
              {isOverloaded && (
                <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    Warning: Combined payload ({totalCargoInVehicle} kg) exceeds vehicle rated payload ({vehicle.maxPayloadKg} kg). Select a larger truck (e.g. Canter) or reduce lot size.
                  </span>
                </div>
              )}
            </div>

            {/* Fleet Cost Comparison Graph */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Vehicle Freight Cost Comparison for {distanceKm} km Journey
                  </h4>
                  <p className="text-xs text-slate-500">
                    Comparing total trip cost and suitability across commercial vehicles
                  </p>
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicleComparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="₹" />
                    <Tooltip 
                      formatter={(val, name, item) => [
                        `₹${val} (₹${item.payload.costPerKg}/kg)`,
                        'Total Freight'
                      ]}
                    />
                    <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                      {vehicleComparisonData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={entry.canFit ? '#d97706' : '#cbd5e1'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Best Practice Logistics Checklist */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                Transit Damage Mitigation Checklist
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Use plastic ventilated crates rather than traditional gunny sacks to cut crushing loss by 65%.</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Schedule transit between 07:00 PM and 04:00 AM to avoid midday solar thermal absorption.</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Maintain air channels between crate stacks for active convective cooling during transit.</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fasten load straps securely to prevent crate sliding during deceleration on rough rural approaches.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
