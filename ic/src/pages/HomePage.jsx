import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Truck, Leaf, IndianRupee, BarChart3, ClipboardList, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 text-white overflow-hidden py-24">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">
              Don't Just See Market Prices.<br />
              <span className="text-emerald-200">Understand What They Mean for Your Harvest.</span>
            </h1>
            <p className="text-xl text-emerald-50">
              HarvestLink is an agricultural decision support tool that maximizes your net realization by analyzing prices, distance, spoilage, and weather.
            </p>
            <div className="pt-4">
              <Link to="/analyze">
                <Button className="bg-white text-emerald-800 hover:bg-emerald-50 text-lg px-8 py-4 font-bold rounded-lg shadow-lg flex items-center gap-2">
                  Analyze Your Harvest <TrendingUp className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-96 hidden md:block">
            {/* Abstract visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-10 right-10 animate-bounce p-4 bg-white/20 rounded-xl backdrop-blur-md border border-white/30">
              <IndianRupee className="w-12 h-12 text-emerald-200" />
            </div>
            <div className="absolute bottom-20 left-10 animate-bounce p-4 bg-white/20 rounded-xl backdrop-blur-md border border-white/30 delay-100">
              <Truck className="w-12 h-12 text-emerald-200" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-white/20 rounded-full backdrop-blur-md border border-white/30 delay-200">
              <Leaf className="w-16 h-16 text-emerald-200" />
            </div>
            <div className="absolute bottom-40 right-20 animate-bounce p-4 bg-white/20 rounded-xl backdrop-blur-md border border-white/30 delay-300">
              <BarChart3 className="w-12 h-12 text-emerald-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Highest Price ≠ Highest Profit</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Consider a tomato harvest of 1,000 kg. A distant market might offer a higher price per kg, but transport and spoilage eat away your profits.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-red-200 bg-red-50/30 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-bl-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Market A (City Market)</h3>
                <div className="flex justify-between items-center py-2 border-b border-red-100">
                  <span className="text-slate-600">Price Offered</span>
                  <span className="font-semibold text-lg">₹30/kg</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-red-100">
                  <span className="text-slate-600">Distance</span>
                  <span className="text-slate-800">80 km</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-red-100 text-red-600">
                  <span>Transport Cost</span>
                  <span>- ₹6,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-red-100 text-red-600">
                  <span>Spoilage (8%)</span>
                  <span>- ₹2,400</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-slate-800 text-lg">Net Realization</span>
                  <span className="font-bold text-slate-800 text-xl">₹21,600</span>
                </div>
              </div>
            </Card>
            
            <Card className="border-emerald-200 bg-emerald-50/50 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white p-2 rounded-bl-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Market B (Local Mandi)</h3>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                  <span className="text-slate-600">Price Offered</span>
                  <span className="font-semibold text-lg">₹28/kg</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                  <span className="text-slate-600">Distance</span>
                  <span className="text-slate-800">25 km</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100 text-red-600">
                  <span>Transport Cost</span>
                  <span>- ₹2,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100 text-red-600">
                  <span>Spoilage (2%)</span>
                  <span>- ₹560</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-emerald-700 text-lg">Net Realization</span>
                  <span className="font-bold text-emerald-700 text-xl">₹25,440</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How HarvestLink Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-t-emerald-500">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <ClipboardList className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="inline-block bg-slate-200 text-slate-600 font-bold w-8 h-8 rounded-full mb-4 leading-8">1</div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Input Harvest</h3>
              <p className="text-slate-600">Enter your crop type, quantity, quality grade, and current location.</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-t-emerald-500">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="inline-block bg-slate-200 text-slate-600 font-bold w-8 h-8 rounded-full mb-4 leading-8">2</div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">AI Analyzes Markets</h3>
              <p className="text-slate-600">Our engine compares real-time prices, calculates transport costs, and estimates spoilage.</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-t-emerald-500">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="inline-block bg-slate-200 text-slate-600 font-bold w-8 h-8 rounded-full mb-4 leading-8">3</div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Get Recommendation</h3>
              <p className="text-slate-600">Receive a clear, actionable recommendation on where and when to sell for maximum profit.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Comprehensive Analysis</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'Multi-Factor Analysis', desc: 'Considers price, distance, road quality, and weather.', icon: BarChart3 },
              { title: 'Explainable Decisions', desc: 'Understand exactly why a specific market is recommended.', icon: ClipboardList },
              { title: 'Risk Assessment', desc: 'Evaluates price volatility and spoilage risks.', icon: TrendingUp },
              { title: 'Real-Time Pricing', desc: 'Integrates with AGMARKNET for up-to-date mandi prices.', icon: IndianRupee },
              { title: 'Spoilage Prediction', desc: 'Estimates transit losses based on crop type and weather.', icon: Leaf },
              { title: 'Interactive Sensitivity', desc: 'Play with what-if scenarios to see impact on profits.', icon: Truck }
            ].map((f, i) => (
              <Card key={i} className="p-6 flex items-start gap-4">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <f.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-emerald-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Make Smarter Selling Decisions?</h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">Join farmers maximizing their true earnings by switching from gross price to net realization thinking.</p>
          <Link to="/analyze">
            <Button className="bg-white text-emerald-800 hover:bg-emerald-50 text-lg px-8 py-4 font-bold rounded-lg shadow-lg">
              Start Analysis Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
