import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <Leaf className="h-5 w-5 text-slate-950" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">HarvestLink</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Explainable AI-based post-harvest market decision support system converting fragmented mandi prices, perishability decay, and logistics freight into maximum net income for farmers.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Karnataka APMC & e-NAM Sync Active</span>
            </div>
          </div>

          {/* Core Decision Engines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Core Engines</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <NavLink to="/analyze" className="hover:text-emerald-400 transition-colors">Decision Engine (Analyze)</NavLink>
              </li>
              <li>
                <NavLink to="/markets" className="hover:text-emerald-400 transition-colors">Live Mandi Intelligence</NavLink>
              </li>
              <li>
                <NavLink to="/cold-storage" className="hover:text-emerald-400 transition-colors">Cold Storage & Preservation</NavLink>
              </li>
              <li>
                <NavLink to="/logistics" className="hover:text-emerald-400 transition-colors">Logistics & Route Optimizer</NavLink>
              </li>
              <li>
                <NavLink to="/forecast" className="hover:text-emerald-400 transition-colors">AI Price Forecasting</NavLink>
              </li>
            </ul>
          </div>

          {/* Intelligence Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Intelligence & XAI</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <NavLink to="/model-transparency" className="hover:text-emerald-400 transition-colors">Model Transparency (SHAP)</NavLink>
              </li>
              <li>
                <NavLink to="/fpo-hub" className="hover:text-emerald-400 transition-colors">FPO Pooling & Bulk Hub</NavLink>
              </li>
              <li>
                <NavLink to="/weather-advisory" className="hover:text-emerald-400 transition-colors">Agro-Weather Advisory</NavLink>
              </li>
              <li>
                <NavLink to="/profit-calculator" className="hover:text-emerald-400 transition-colors">Net Realization Calculator</NavLink>
              </li>
            </ul>
          </div>

          {/* Project & Conclave */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Conclave 2026</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <NavLink to="/how-it-works" className="hover:text-emerald-400 transition-colors">System Architecture</NavLink>
              </li>
              <li>
                <NavLink to="/about" className="hover:text-emerald-400 transition-colors">About & Track 06 Team</NavLink>
              </li>
              <li>
                <span className="text-slate-500">Problem Statement: PS-02</span>
              </li>
              <li>
                <span className="text-slate-500">Karnataka Pre-Launch</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 HarvestLink — Post-Harvest Market Decision Support System. Open AgriTech Architecture.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Track 06 — AgriTech</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Innovators Conclave 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
