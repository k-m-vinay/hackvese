import React, { useState } from 'react';
import { 
  CloudSun, CloudRain, Sun, Wind, Droplets, Thermometer, 
  AlertTriangle, CheckCircle2, Clock, MapPin, Compass, ShieldAlert,
  ArrowRight, Sparkles, Umbrella
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar 
} from 'recharts';

export const districtWeatherData = {
  kolar: {
    district: 'Kolar Farming Belt',
    primaryCrops: 'Tomato, Mango, Mulberry, Capsicum',
    currentTemp: 32,
    currentHumidity: 58,
    windSpeedKmh: 14,
    rainChancePct: 15,
    thermalIndex: 'Moderate Heat Stress',
    harvestRecommendation: 'Ideal Harvest Window: 05:30 AM - 09:30 AM',
    postHarvestAdvisory: 'Low rainfall risk. Ensure harvested crates are stored under tree canopy or shaded collection sheds before loading to prevent sunscald.',
    forecast: [
      { day: 'Wed (Today)', tempMax: 33, tempMin: 21, humidity: 58, rainMm: 0, condition: 'Sunny / Dry', decayRisk: 'Low' },
      { day: 'Thu', tempMax: 34, tempMin: 22, humidity: 62, rainMm: 2, condition: 'Partly Cloudy', decayRisk: 'Moderate' },
      { day: 'Fri', tempMax: 31, tempMin: 20, humidity: 75, rainMm: 14, condition: 'Thunderstorm Expected', decayRisk: 'High (Rot Risk)' },
      { day: 'Sat', tempMax: 29, tempMin: 19, humidity: 82, rainMm: 22, condition: 'Heavy Rain', decayRisk: 'Critical (Pre-harvest Rot)' },
      { day: 'Sun', tempMax: 30, tempMin: 20, humidity: 78, rainMm: 8, condition: 'Scattered Showers', decayRisk: 'Moderate-High' },
      { day: 'Mon', tempMax: 32, tempMin: 21, humidity: 65, rainMm: 0, condition: 'Clear Sky', decayRisk: 'Low' },
      { day: 'Tue', tempMax: 33, tempMin: 22, humidity: 60, rainMm: 0, condition: 'Clear Sky', decayRisk: 'Low' }
    ]
  },
  mandya: {
    district: 'Mandya - Cauvery Basin',
    primaryCrops: 'Paddy, Sugarcane, Banana, Vegetables',
    currentTemp: 30,
    currentHumidity: 72,
    windSpeedKmh: 11,
    rainChancePct: 40,
    thermalIndex: 'High Humidity - Spoilage Accelerator',
    harvestRecommendation: 'Ideal Harvest Window: 06:00 AM - 10:00 AM',
    postHarvestAdvisory: 'Elevated relative humidity accelerates fungal sporulation on soft fruit. Dry produce surfaces thoroughly prior to bagging.',
    forecast: [
      { day: 'Wed (Today)', tempMax: 31, tempMin: 22, humidity: 72, rainMm: 4, condition: 'Humid / Light Rain', decayRisk: 'Moderate' },
      { day: 'Thu', tempMax: 30, tempMin: 21, humidity: 76, rainMm: 8, condition: 'Rain Showers', decayRisk: 'Moderate' },
      { day: 'Fri', tempMax: 29, tempMin: 20, humidity: 80, rainMm: 18, condition: 'Heavy Showers', decayRisk: 'High' },
      { day: 'Sat', tempMax: 30, tempMin: 20, humidity: 74, rainMm: 5, condition: 'Overcast', decayRisk: 'Moderate' },
      { day: 'Sun', tempMax: 31, tempMin: 21, humidity: 68, rainMm: 0, condition: 'Partly Sunny', decayRisk: 'Low' },
      { day: 'Mon', tempMax: 32, tempMin: 22, humidity: 64, rainMm: 0, condition: 'Sunny', decayRisk: 'Low' },
      { day: 'Tue', tempMax: 32, tempMin: 22, humidity: 65, rainMm: 0, condition: 'Sunny', decayRisk: 'Low' }
    ]
  },
  belagavi: {
    district: 'Belagavi & Ghat Edge',
    primaryCrops: 'Onion, Potato, Maize, Sugarcane, Cotton',
    currentTemp: 29,
    currentHumidity: 65,
    windSpeedKmh: 18,
    rainChancePct: 20,
    thermalIndex: 'Mild / Favorable',
    harvestRecommendation: 'Ideal Harvest Window: 07:00 AM - 11:30 AM',
    postHarvestAdvisory: 'Excellent bulb curing weather. Field curing of onions under ambient sunlight recommended for 48 hours to tighten outer skins.',
    forecast: [
      { day: 'Wed (Today)', tempMax: 29, tempMin: 18, humidity: 65, rainMm: 0, condition: 'Clear Breezy', decayRisk: 'Low' },
      { day: 'Thu', tempMax: 30, tempMin: 19, humidity: 62, rainMm: 0, condition: 'Sunny', decayRisk: 'Low' },
      { day: 'Fri', tempMax: 30, tempMin: 19, humidity: 68, rainMm: 3, condition: 'Partly Cloudy', decayRisk: 'Low' },
      { day: 'Sat', tempMax: 28, tempMin: 18, humidity: 74, rainMm: 12, condition: 'Scattered Rain', decayRisk: 'Moderate' },
      { day: 'Sun', tempMax: 29, tempMin: 18, humidity: 70, rainMm: 2, condition: 'Overcast', decayRisk: 'Low' },
      { day: 'Mon', tempMax: 30, tempMin: 19, humidity: 60, rainMm: 0, condition: 'Clear', decayRisk: 'Low' },
      { day: 'Tue', tempMax: 31, tempMin: 20, humidity: 58, rainMm: 0, condition: 'Sunny', decayRisk: 'Low' }
    ]
  }
};

export default function WeatherAdvisoryPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('kolar');

  const weather = districtWeatherData[selectedDistrict];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-sky-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-sky-500/30">
              <CloudSun className="w-3.5 h-3.5" /> Agro-Meteorological & Spoilage Advisory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Post-Harvest Weather Intelligence & Thermal Decay Risk
            </h1>
            <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
              Real-time agro-meteorological forecasting to plan optimal harvest hours, protect produce from fungal spore germination, and avoid rain-induced transit rotting.
            </p>
          </div>
        </div>

        {/* District Selector */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2">
            {[
              { id: 'kolar', name: 'Kolar Horticultural Hub' },
              { id: 'mandya', name: 'Mandya (Cauvery Basin)' },
              { id: 'belagavi', name: 'Belagavi (North KA)' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDistrict(d.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDistrict === d.id
                    ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live IMD & Agromet Radar Synced
          </div>
        </div>

        {/* Current Micro-Climate Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Ambient Temperature</div>
              <div className="text-2xl font-black text-slate-900">{weather.currentTemp}°C</div>
              <div className="text-[11px] text-amber-600 font-semibold">{weather.thermalIndex}</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Relative Humidity</div>
              <div className="text-2xl font-black text-slate-900">{weather.currentHumidity}% RH</div>
              <div className="text-[11px] text-slate-500">Moisture Decay Factor</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Surface Wind Velocity</div>
              <div className="text-2xl font-black text-slate-900">{weather.windSpeedKmh} km/h</div>
              <div className="text-[11px] text-slate-500">Aeration Condition</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Umbrella className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">24h Precipitation Probability</div>
              <div className="text-2xl font-black text-slate-900">{weather.rainChancePct}%</div>
              <div className="text-[11px] text-indigo-600 font-semibold">Pre-Harvest Alert</div>
            </div>
          </div>
        </div>

        {/* Harvest Window & Protective Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-2xl border border-emerald-700 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Clock className="w-4 h-4" /> Optimal Harvest Window
            </div>
            <h3 className="text-xl font-bold">{weather.harvestRecommendation}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Harvesting during the early morning minimizes internal pulp heat. Produce harvested at 22°C respires at half the speed of produce harvested during midday heat (34°C), increasing shelf life by 2.5 days.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Transit & Curing Guidance
            </div>
            <h3 className="text-xl font-bold">Field-to-Mandi Protocol</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {weather.postHarvestAdvisory}
            </p>
          </div>

        </div>

        {/* 7-Day Micro-Climate & Spoilage Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            7-Day Agromet Forecast & Spoilage Hazard Level ({weather.district})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
            {weather.forecast.map((day, idx) => {
              const isRainRisk = day.rainMm > 10;
              const isModerate = day.rainMm > 2;

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                    isRainRisk 
                      ? 'border-rose-300 bg-rose-50/70 text-rose-950' 
                      : isModerate 
                        ? 'border-amber-200 bg-amber-50/50 text-amber-950' 
                        : 'border-slate-200 bg-slate-50/50 text-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">{day.day}</div>
                  <div className="text-2xl font-black mt-1">
                    {day.tempMax}°<span className="text-xs text-slate-500 font-normal"> / {day.tempMin}°</span>
                  </div>
                  <div className="text-[11px] text-slate-600">{day.condition}</div>
                  
                  <div className="pt-2 border-t border-slate-200/60 text-[10px] space-y-1">
                    <div>Rain: <strong>{day.rainMm} mm</strong></div>
                    <div>Humidity: <strong>{day.humidity}%</strong></div>
                    <div className={`font-bold mt-1 px-1.5 py-0.5 rounded text-[9px] ${
                      isRainRisk ? 'bg-rose-200 text-rose-900' : isModerate ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {day.decayRisk}
                    </div>
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
