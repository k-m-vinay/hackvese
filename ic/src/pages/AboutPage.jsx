import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">About HarvestLink</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Empowering Indian farmers to make data-driven selling decisions that maximize their actual net realization, not just chase the highest gross price.
          </p>
        </div>

        <section className="mb-16">
          <Card className="p-8 bg-emerald-50/50 border-emerald-100">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">The Problem Context</h2>
            <p className="text-slate-700 mb-4">
              Indian farmers face a critical decision post-harvest: where to sell their produce. Often, they lack real-time visibility into market prices across different Mandis. Even when price information is available, choosing the market with the highest offering price does not always guarantee the highest profit.
            </p>
            <p className="text-slate-700">
              Hidden costs such as transportation logistics and transit spoilage (especially for perishable crops) often erode margins. HarvestLink solves this by calculating the true <strong>Net Realization</strong>.
            </p>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">React 18</Badge>
            <Badge className="bg-cyan-100 text-cyan-800 px-4 py-2 text-sm">Tailwind CSS</Badge>
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">Python</Badge>
            <Badge className="bg-teal-100 text-teal-800 px-4 py-2 text-sm">FastAPI</Badge>
            <Badge className="bg-orange-100 text-orange-800 px-4 py-2 text-sm">XGBoost</Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">SHAP (Explainable AI)</Badge>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Roadmap</h2>
          <div className="space-y-4">
            {[
              { phase: 'Phase 1 (Current)', desc: 'Core Net Realization Engine & Basic UI' },
              { phase: 'Phase 2', desc: 'Predictive Pricing Models & Weather Integration' },
              { phase: 'Phase 3', desc: 'Mobile App (React Native) & Multilingual Support' },
              { phase: 'Phase 4', desc: 'Logistics Partner Integration (Uber for Tractors)' },
            ].map((r, i) => (
              <Card key={i} className="p-6 flex items-center gap-6">
                <div className="font-bold text-emerald-600 min-w-[120px]">{r.phase}</div>
                <div className="text-slate-700">{r.desc}</div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((member) => (
              <Card key={member} className="p-6 text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 border-4 border-white shadow-sm"></div>
                <h3 className="font-bold text-slate-800">Team Member {member}</h3>
                <p className="text-slate-500 text-sm">Role / Specialization</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center mt-20 pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm font-medium">
            Innovators Conclave 2026 — Karnataka Pre-Launch, AgriTech Track PS-02
          </p>
        </section>
      </div>
    </div>
  );
}
