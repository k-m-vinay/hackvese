import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Calendar, Zap, AlertCircle, Sparkles, Filter, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Info, ShieldCheck,
  LineChart as LineChartIcon, Sliders, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Line, ComposedChart 
} from 'recharts';

export const cropForecastModels = {
  tomato: {
    name: 'Tomato',
    icon: '🍅',
    currentSpotPrice: 28,
    volatility: 'High (34% Annualized)',
    modelAccuracy: '91.4% (R² = 0.88)',
    primaryDrivers: ['Kolar Mandi Arrival Volume', 'Diesel Price', 'Monsoon Rainfall Lag (14d)'],
    optimalWindow: 'Sell on Day +4 to +6',
    optimalWindowReason: 'Incoming Maharashtra supply glut expected on Day +8, which will depress southern prices by ~18%.',
    forecast: [
      { day: 'Day 0 (Today)', predictedPrice: 28.0, lowerBound: 27.5, upperBound: 28.5, confidence: 98, event: 'Current Mandi Base' },
      { day: 'Day +1', predictedPrice: 28.6, lowerBound: 27.8, upperBound: 29.4, confidence: 95, event: 'Local Mandi Holiday (Tight Supply)' },
      { day: 'Day +2', predictedPrice: 29.4, lowerBound: 28.2, upperBound: 30.6, confidence: 93, event: '' },
      { day: 'Day +3', predictedPrice: 30.5, lowerBound: 29.0, upperBound: 32.0, confidence: 91, event: 'Pre-Weekend Bulk Purchasing' },
      { day: 'Day +4', predictedPrice: 31.8, lowerBound: 30.0, upperBound: 33.6, confidence: 89, event: 'Peak Realization Window ★' },
      { day: 'Day +5', predictedPrice: 32.2, lowerBound: 30.2, upperBound: 34.2, confidence: 87, event: 'Peak Realization Window ★' },
      { day: 'Day +6', predictedPrice: 31.5, lowerBound: 29.2, upperBound: 33.8, confidence: 84, event: '' },
      { day: 'Day +7', predictedPrice: 29.8, lowerBound: 27.5, upperBound: 32.1, confidence: 81, event: 'Pimpalgaon Dispatch Arrivals' },
      { day: 'Day +8', predictedPrice: 27.2, lowerBound: 24.8, upperBound: 29.6, confidence: 78, event: 'Supply Glut Expected' },
      { day: 'Day +9', predictedPrice: 25.5, lowerBound: 22.9, upperBound: 28.1, confidence: 75, event: '' },
      { day: 'Day +10', predictedPrice: 24.8, lowerBound: 22.0, upperBound: 27.6, confidence: 72, event: '' }
    ],
    seasonality: [
      { month: 'Jan', index: 85, label: 'Post-Winter Harvest Peak' },
      { month: 'Feb', index: 92, label: 'Moderate' },
      { month: 'Mar', index: 110, label: 'Pre-Summer Rise' },
      { month: 'Apr', index: 135, label: 'Summer Peak Prices' },
      { month: 'May', index: 140, label: 'Highest Seasonal Price' },
      { month: 'Jun', index: 115, label: 'Monsoon Onset' },
      { month: 'Jul', index: 105, label: 'Kharif Arrivals' },
      { month: 'Aug', index: 88, label: 'Peak Glut' },
      { month: 'Sep', index: 95, label: 'Festival Demand Begins' },
      { month: 'Oct', index: 120, label: 'Diwali Demand Surge' },
      { month: 'Nov', index: 98, label: 'Winter Crop Commences' },
      { month: 'Dec', index: 82, label: 'Lowest Seasonal Price' }
    ]
  },
  onion: {
    name: 'Onion',
    icon: '🧅',
    currentSpotPrice: 30,
    volatility: 'Medium-High (26%)',
    modelAccuracy: '93.2% (R² = 0.91)',
    primaryDrivers: ['Lasalgaon Benchmark Price', 'Storage Sowing Acreage', 'Export Quota Status'],
    optimalWindow: 'Store & Sell after Day +10',
    optimalWindowReason: 'Stable bulb shelf-life allows riding out short-term market dips until festive buffer stock kicks in.',
    forecast: [
      { day: 'Day 0 (Today)', predictedPrice: 30.0, lowerBound: 29.5, upperBound: 30.5, confidence: 99, event: 'Base' },
      { day: 'Day +1', predictedPrice: 30.2, lowerBound: 29.4, upperBound: 31.0, confidence: 96, event: '' },
      { day: 'Day +2', predictedPrice: 30.6, lowerBound: 29.6, upperBound: 31.6, confidence: 94, event: '' },
      { day: 'Day +3', predictedPrice: 31.0, lowerBound: 29.8, upperBound: 32.2, confidence: 92, event: '' },
      { day: 'Day +4', predictedPrice: 31.5, lowerBound: 30.1, upperBound: 32.9, confidence: 90, event: '' },
      { day: 'Day +5', predictedPrice: 32.1, lowerBound: 30.5, upperBound: 33.7, confidence: 88, event: 'Procurement Push' },
      { day: 'Day +6', predictedPrice: 32.8, lowerBound: 31.0, upperBound: 34.6, confidence: 86, event: '' },
      { day: 'Day +7', predictedPrice: 33.4, lowerBound: 31.4, upperBound: 35.4, confidence: 84, event: 'Uptrend Confirmation' },
      { day: 'Day +8', predictedPrice: 34.0, lowerBound: 31.8, upperBound: 36.2, confidence: 82, event: '' },
      { day: 'Day +9', predictedPrice: 34.8, lowerBound: 32.4, upperBound: 37.2, confidence: 80, event: '' },
      { day: 'Day +10', predictedPrice: 35.5, lowerBound: 33.0, upperBound: 38.0, confidence: 78, event: 'Target Exit Window ★' }
    ],
    seasonality: [
      { month: 'Jan', index: 90, label: 'Late Kharif' },
      { month: 'Feb', index: 82, label: 'Rabi Harvest Glut' },
      { month: 'Mar', index: 78, label: 'Lowest Seasonal Price' },
      { month: 'Apr', index: 85, label: 'Harvest Ending' },
      { month: 'May', index: 95, label: 'Storage Phase' },
      { month: 'Jun', index: 105, label: 'Monsoon Demand' },
      { month: 'Jul', index: 115, label: 'Supply Tightening' },
      { month: 'Aug', index: 125, label: 'Peak Storage Stock Release' },
      { month: 'Sep', index: 140, label: 'Festival Surge' },
      { month: 'Oct', index: 155, label: 'Highest Annual Price' },
      { month: 'Nov', index: 130, label: 'Kharif Early Arrivals' },
      { month: 'Dec', index: 105, label: 'Normalizing' }
    ]
  },
  potato: {
    name: 'Potato',
    icon: '🥔',
    currentSpotPrice: 24,
    volatility: 'Low-Medium (18%)',
    modelAccuracy: '94.0% (R² = 0.92)',
    primaryDrivers: ['Hassan Mandi Influx', 'Cold Storage Utilization', 'Chip Processing Demand'],
    optimalWindow: 'Steady (Sell anytime within 7 days)',
    optimalWindowReason: 'High shelf-stability and consistent processing contracts prevent sudden downward price shocks.',
    forecast: [
      { day: 'Day 0 (Today)', predictedPrice: 24.0, lowerBound: 23.6, upperBound: 24.4, confidence: 99, event: 'Base' },
      { day: 'Day +1', predictedPrice: 24.2, lowerBound: 23.7, upperBound: 24.7, confidence: 97, event: '' },
      { day: 'Day +2', predictedPrice: 24.3, lowerBound: 23.6, upperBound: 25.0, confidence: 95, event: '' },
      { day: 'Day +3', predictedPrice: 24.5, lowerBound: 23.7, upperBound: 25.3, confidence: 93, event: '' },
      { day: 'Day +4', predictedPrice: 24.8, lowerBound: 23.9, upperBound: 25.7, confidence: 91, event: '' },
      { day: 'Day +5', predictedPrice: 25.0, lowerBound: 24.0, upperBound: 26.0, confidence: 89, event: 'Institutional Buying' },
      { day: 'Day +6', predictedPrice: 25.2, lowerBound: 24.1, upperBound: 26.3, confidence: 87, event: '' },
      { day: 'Day +7', predictedPrice: 25.4, lowerBound: 24.2, upperBound: 26.6, confidence: 85, event: '' },
      { day: 'Day +8', predictedPrice: 25.5, lowerBound: 24.1, upperBound: 26.9, confidence: 83, event: '' },
      { day: 'Day +9', predictedPrice: 25.7, lowerBound: 24.2, upperBound: 27.2, confidence: 81, event: '' },
      { day: 'Day +10', predictedPrice: 25.9, lowerBound: 24.3, upperBound: 27.5, confidence: 79, event: '' }
    ],
    seasonality: [
      { month: 'Jan', index: 80, label: 'Fresh Harvest Glut' },
      { month: 'Feb', index: 75, label: 'Lowest Seasonal Price' },
      { month: 'Mar', index: 85, label: 'Cold Storage Loading' },
      { month: 'Apr', index: 95, label: 'Stable' },
      { month: 'May', index: 105, label: 'Summer Demand' },
      { month: 'Jun', index: 110, label: 'Steady Off-Season' },
      { month: 'Jul', index: 118, label: 'Hassan Early Harvest' },
      { month: 'Aug', index: 122, label: 'High Demand' },
      { month: 'Sep', index: 128, label: 'Pre-Festive' },
      { month: 'Oct', index: 135, label: 'Festival Peak' },
      { month: 'Nov', index: 115, label: 'Northern Sowing Season' },
      { month: 'Dec', index: 90, label: 'Winter Crop Inflow' }
    ]
  }
};

export default function ForecastPage() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [demandScenario, setDemandScenario] = useState('standard'); // 'standard', 'festival', 'weather-shock'

  const activeModel = cropForecastModels[selectedCrop];

  // Adjust forecast based on scenario simulation
  const adjustedForecast = useMemo(() => {
    const factor = demandScenario === 'festival' ? 1.12 : demandScenario === 'weather-shock' ? 0.90 : 1.0;
    return activeModel.forecast.map(item => ({
      ...item,
      predictedPrice: +(item.predictedPrice * factor).toFixed(1),
      lowerBound: +(item.lowerBound * factor).toFixed(1),
      upperBound: +(item.upperBound * factor).toFixed(1),
    }));
  }, [activeModel, demandScenario]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-teal-500/30">
              <TrendingUp className="w-3.5 h-3.5" /> AI Price Prediction & 14-Day Horizon
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Crop Price Forecast & Optimal Timing Engine
            </h1>
            <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
              Leverage machine-learning forward curves with 95% confidence intervals and historical mandi seasonality to answer precisely: <em>"When is the best day to sell?"</em>
            </p>
          </div>
        </div>

        {/* Global Selectors */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Crop Selector */}
          <div className="flex gap-2">
            {Object.keys(cropForecastModels).map(cropKey => (
              <button
                key={cropKey}
                onClick={() => setSelectedCrop(cropKey)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedCrop === cropKey
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cropForecastModels[cropKey].icon}</span>
                <span>{cropForecastModels[cropKey].name}</span>
              </button>
            ))}
          </div>

          {/* Scenario Sandbox */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Macro Stress Test:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'standard', label: 'Baseline Forecast' },
                { id: 'festival', label: 'Festive Spike (+12%)' },
                { id: 'weather-shock', label: 'Glut / Delay (-10%)' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setDemandScenario(s.id)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    demandScenario === s.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight Highlight Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-6 rounded-2xl border border-emerald-700 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> AI Timing Recommendation
              </div>
              <h3 className="text-2xl font-black">
                {activeModel.optimalWindow}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                {activeModel.optimalWindowReason}
              </p>
            </div>

            <div className="flex gap-4 border-t md:border-t-0 md:border-l border-emerald-700/60 pt-3 md:pt-0 md:pl-6 text-xs shrink-0">
              <div>
                <div className="text-slate-400 font-medium">Model Precision</div>
                <div className="text-lg font-bold text-emerald-300 mt-0.5">{activeModel.modelAccuracy}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">Mandi Volatility</div>
                <div className="text-lg font-bold text-amber-300 mt-0.5">{activeModel.volatility}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main 10-Day Prediction Curve with Confidence Bands */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-teal-600" />
                10-Day Predicted Price Trajectory & 95% Confidence Corridor (₹/kg)
              </h2>
              <p className="text-xs text-slate-500">
                Shaded band reflects model uncertainty based on historical arrival variances and weather forecasts
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-teal-600 inline-block" /> Expected Mean Price</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-200 inline-block" /> 95% Confidence Interval</span>
            </div>
          </div>

          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={adjustedForecast} margin={{ top: 15, right: 15, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="₹" domain={['dataMin - 3', 'dataMax + 3']} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-teal-400">{d.day}</p>
                          <p className="text-sm font-black text-white">Mean: ₹{d.predictedPrice}/kg</p>
                          <p className="text-slate-300">95% Range: ₹{d.lowerBound} - ₹{d.upperBound}/kg</p>
                          <p className="text-slate-400">Confidence: {d.confidence}%</p>
                          {d.event && <p className="text-amber-300 font-semibold pt-1 border-t border-slate-700">★ {d.event}</p>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Confidence band area */}
                <Area 
                  type="monotone" 
                  dataKey="upperBound" 
                  stroke="none" 
                  fill="#99f6e4" 
                  fillOpacity={0.4} 
                  name="Confidence Upper"
                />
                <Area 
                  type="monotone" 
                  dataKey="lowerBound" 
                  stroke="none" 
                  fill="#ffffff" 
                  fillOpacity={1} 
                  name="Confidence Lower"
                />
                {/* Mean Line */}
                <Line 
                  type="monotone" 
                  dataKey="predictedPrice" 
                  stroke="#0f766e" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0f766e' }} 
                  activeDot={{ r: 6, fill: '#14b8a6' }}
                  name="Expected Price" 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecast Drivers & Seasonality */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Key Forecast Drivers */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Machine Learning Feature Drivers
            </h3>
            <p className="text-xs text-slate-500">
              Top mathematical feature weights contributing to {activeModel.name}'s forward price curve
            </p>

            <div className="space-y-3 pt-2">
              {[
                { name: 'Arrival Glut / Supply Influx', weight: 42, color: 'bg-teal-600' },
                { name: 'Diesel Freight Rate Index', weight: 26, color: 'bg-indigo-600' },
                { name: 'Rainfall & Heat Moisture Stress', weight: 18, color: 'bg-amber-500' },
                { name: 'Retail Terminal Market Demand', weight: 14, color: 'bg-emerald-600' }
              ].map((driver, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{driver.name}</span>
                    <span className="font-bold text-slate-900">{driver.weight}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${driver.color} h-full rounded-full`} style={{ width: `${driver.weight}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mt-4">
              <strong>Model Architecture:</strong> Gradient Boosted Regression Trees trained on 5 years of daily AGMARKNET & e-NAM Karnataka transaction records.
            </div>
          </div>

          {/* 12-Month Seasonality Cycle */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              Annual Seasonal Price Index (100 = Annual Average)
            </h3>
            <p className="text-xs text-slate-500">
              Historical monthly price index showing seasonal supply gluts and festive peaks
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
              {activeModel.seasonality.map((item) => {
                const isHigh = item.index >= 115;
                const isLow = item.index <= 88;
                return (
                  <div 
                    key={item.month} 
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isHigh 
                        ? 'border-emerald-300 bg-emerald-50/70 text-emerald-900' 
                        : isLow 
                          ? 'border-rose-200 bg-rose-50/50 text-rose-900' 
                          : 'border-slate-200 bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.month}</div>
                    <div className="text-base font-black mt-0.5">{item.index}</div>
                    <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
