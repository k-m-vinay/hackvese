import React from 'react';
import Card from '../components/ui/Card';

export default function HowItWorksPage() {
  const steps = [
    { num: 1, title: 'Farmer Input', desc: 'Farmer enters crop details, quantity, grade, and location.' },
    { num: 2, title: 'Data Collection', desc: 'Fetch real-time mandi prices, weather forecasts, and route data.' },
    { num: 3, title: 'Data Processing', desc: 'Clean and normalize data for AI models.' },
    { num: 4, title: 'Price Estimation', desc: 'Predict expected prices based on historical trends and current volume.' },
    { num: 5, title: 'Spoilage Estimation', desc: 'Calculate transit loss using weather, distance, and crop perishability.' },
    { num: 6, title: 'Transport Calculation', desc: 'Estimate logistics cost based on distance and vehicle type.' },
    { num: 7, title: 'Net Realization', desc: 'Compute Gross Revenue minus Transport and Spoilage.' },
    { num: 8, title: 'Risk Analysis', desc: 'Assess price volatility and weather risks.' },
    { num: 9, title: 'Market Comparison', desc: 'Rank markets by Net Realization and Risk.' },
    { num: 10, title: 'Explainable Decision', desc: 'Generate clear, justified recommendations.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">How HarvestLink Works</h1>
          <p className="text-lg text-slate-600">The intelligence engine turning complex data into simple decisions.</p>
        </div>

        {/* Pipeline Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-2">Analysis Pipeline</h2>
          <div className="relative border-l-4 border-emerald-200 ml-6 space-y-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute -left-[22px] top-4 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {step.num}
                </div>
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-800">{step.title}</h3>
                  <p className="text-slate-600 mt-2">{step.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-2">System Architecture</h2>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg w-full md:w-1/4 text-center">
                <h4 className="font-bold text-blue-800">UI / Frontend</h4>
                <p className="text-sm text-blue-600">React + Tailwind</p>
              </div>
              <div className="hidden md:block text-slate-400">→</div>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg w-full md:w-1/4 text-center">
                <h4 className="font-bold text-emerald-800">API Gateway</h4>
                <p className="text-sm text-emerald-600">FastAPI</p>
              </div>
              <div className="hidden md:block text-slate-400">→</div>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg w-full md:w-1/4 text-center">
                <h4 className="font-bold text-purple-800">AI Engine</h4>
                <p className="text-sm text-purple-600">XGBoost + Models</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg w-full text-center">
                <h4 className="font-bold text-slate-800 mb-4">Data Sources</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-2 rounded shadow-sm text-sm">AGMARKNET (Prices)</div>
                  <div className="bg-white p-2 rounded shadow-sm text-sm">e-NAM (Trade)</div>
                  <div className="bg-white p-2 rounded shadow-sm text-sm">IMD (Weather)</div>
                  <div className="bg-white p-2 rounded shadow-sm text-sm">Logistics Data</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explainability Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-2">Explainable AI (SHAP)</h2>
          <Card className="p-8">
            <p className="text-slate-700 mb-4">
              We use <strong>SHAP (SHapley Additive exPlanations)</strong> values to break down our price predictions and market recommendations. This ensures our AI isn't a "black box".
            </p>
            <p className="text-slate-700">
              For every recommendation, we can tell the farmer exactly <em>why</em> a decision was made—whether the distance penalty outweighed the higher market price, or if incoming rain increased the spoilage risk too much.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
