import React, { useState } from 'react';
import { 
  Cpu, ShieldCheck, CheckCircle2, Sliders, Activity, 
  BarChart2, FileText, Lock, Sparkles, Layers, Info, 
  HelpCircle, Eye, ArrowRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';

export default function ModelTransparencyPage() {
  const [activeTab, setActiveTab] = useState('shap'); // 'shap', 'metrics', 'fairness'
  const [simulatedCrop, setSimulatedCrop] = useState('tomato');
  const [distanceKm, setDistanceKm] = useState(70);
  const [gradeMultiplier, setGradeMultiplier] = useState(1.0); // Grade A

  // Simulated SHAP contributions to net realization
  const shapWaterfallData = [
    { feature: 'Base Value (State Avg)', value: 24.5, isBase: true },
    { feature: 'High Grade A Quality', value: +4.8, isPositive: true },
    { feature: 'Kolar Mandi Premium', value: +3.2, isPositive: true },
    { feature: 'Freight Distance Penalty', value: -3.8, isPositive: false },
    { feature: 'Ambient Heat Decay (32°C)', value: -1.7, isPositive: false },
    { feature: 'Off-Peak Arrival Timing', value: +1.5, isPositive: true }
  ];

  const totalCalculatedNet = shapWaterfallData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-purple-500/30">
              <Cpu className="w-3.5 h-3.5" /> Explainable AI (XAI) Architecture
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Model Transparency & Decision Provenance
            </h1>
            <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
              No black-box algorithms. Inspect Shapley additive explanations (SHAP), feature weights, loss metrics, and mathematical accountability driving every recommendation.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-4">
          {[
            { id: 'shap', label: 'SHAP Explainability & Feature Importance', icon: Activity },
            { id: 'metrics', label: 'Model Benchmarks & Metrics (R², MAE)', icon: BarChart2 },
            { id: 'fairness', label: 'Algorithmic Fairness & Smallholder Ethics', icon: ShieldCheck }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-700 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: SHAP EXPLAINABILITY */}
        {activeTab === 'shap' && (
          <div className="space-y-6">
            
            {/* Real SHAP Visualizations from Model Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Price Model: SHAP Summary Plot
                    </h3>
                    <p className="text-xs text-slate-500">
                      Visualizing feature impacts across 10,000+ mandi transactions
                    </p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                    XGBoost / RF
                  </span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-center">
                  <img 
                    src="/images/price_shap_summary.png" 
                    alt="Price SHAP Summary Plot" 
                    className="max-h-72 object-contain rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Red indicates high feature value, blue indicates low. <strong>Distance</strong> and <strong>arrival volume</strong> exhibit the highest impact magnitude on mandi pricing.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Spoilage Model: Feature Importance
                    </h3>
                    <p className="text-xs text-slate-500">
                      Gini impurity importance for post-harvest decay estimation
                    </p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Random Forest
                  </span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-center">
                  <img 
                    src="/images/spoilage_feature_importance.png" 
                    alt="Spoilage Feature Importance" 
                    className="max-h-72 object-contain rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ambient temperature and transit travel hours constitute over 68% of the total spoilage risk weight for perishable horticultural crops.
                </p>
              </div>

            </div>

            {/* Interactive SHAP Waterfall Simulation */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  SHAP Waterfall Decomposition for a Typical Recommendation
                </h3>
                <p className="text-xs text-slate-500">
                  How HarvestLink explains to a farmer why Kolar Mandi is selected over Bengaluru KR Market
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {shapWaterfallData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${item.isBase ? 'bg-slate-500' : item.isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="text-xs font-semibold text-slate-800">{item.feature}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`font-mono font-bold ${item.isBase ? 'text-slate-700' : item.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.value > 0 && !item.isBase ? `+₹${item.value}` : `₹${item.value}`}/kg
                      </span>
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-xl bg-purple-900 text-white flex justify-between items-center shadow-inner">
                  <div>
                    <span className="text-xs text-purple-200 uppercase font-bold tracking-wider">Final Explainable Output</span>
                    <h4 className="text-lg font-bold">Estimated Net Realization</h4>
                  </div>
                  <div className="text-2xl font-black text-purple-300">
                    ₹{totalCalculatedNet.toFixed(1)} / kg
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MODEL BENCHMARKS */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price Model R² Score</div>
                <div className="text-4xl font-black text-emerald-600 mt-2">0.914</div>
                <p className="text-xs text-slate-500 mt-1">91.4% variance explained across 52 mandi clusters</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mean Absolute Error (MAE)</div>
                <div className="text-4xl font-black text-indigo-600 mt-2">₹1.42</div>
                <p className="text-xs text-slate-500 mt-1">Average price deviation within 5% of actual settlement</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Spoilage RMSE</div>
                <div className="text-4xl font-black text-purple-600 mt-2">1.8%</div>
                <p className="text-xs text-slate-500 mt-1">Validated against field decay ground-truth benchmarks</p>
              </div>
            </div>

            {/* Model Architecture Specifications */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Hybrid Two-Tier Inference Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Tier 1: Price Estimator (Gradient Boosted Regressor)</h4>
                  <p>Trained on multi-year AGMARKNET price datasets with rolling 7-day lagged price, day-of-week demand indicators, fuel index, and arrival volumes.</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Cross-validation: 5-Fold Time-Series Split</li>
                    <li>Hyperparameters: max_depth=6, n_estimators=300, learning_rate=0.05</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Tier 2: Post-Harvest Spoilage & Heat Engine</h4>
                  <p>Calibrated using physical agricultural extension perishability curves, respiration rate Q10 temperature coefficient, and road transit shock penalties.</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Respiration Model: Arrhenius temperature dependence</li>
                    <li>Transit Factor: Road classification vibration coefficient</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ALGORITHMIC FAIRNESS */}
        {activeTab === 'fairness' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="max-w-3xl">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Ethical Principles & Smallholder Protection
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                How HarvestLink guards against market manipulation, cartels, and information asymmetry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-slate-900 text-sm">Anti-Predatory Pricing</h4>
                <p className="text-xs text-slate-600">
                  Flags artificial price dips orchestrated by local trading rings. Notifies farmers when nearby mandis offer 15%+ higher real returns.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                <h4 className="font-bold text-slate-900 text-sm">Zero Sponsored Mandis</h4>
                <p className="text-xs text-slate-600">
                  All recommendations strictly follow mathematical net realization. No commercial commission or sponsored ranking is permitted in the recommendation engine.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                <h4 className="font-bold text-slate-900 text-sm">Explainable In Vernacular</h4>
                <p className="text-xs text-slate-600">
                  Calculations are articulated using plain-language arithmetic so farmers without data science backgrounds can verify the numbers before traveling.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
