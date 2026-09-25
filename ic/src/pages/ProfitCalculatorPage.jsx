import React, { useState } from 'react';
import { 
  Calculator, Receipt, CheckCircle2, AlertTriangle, ArrowRight, 
  Printer, Download, ShieldCheck, HelpCircle, Share2, Sparkles,
  TrendingUp, DollarSign, Scale, Percent
} from 'lucide-react';

export default function ProfitCalculatorPage() {
  const [crop, setCrop] = useState('tomato');
  const [quantityKg, setQuantityKg] = useState(2500);
  const [costOfCultivationPerAcre, setCostOfCultivationPerAcre] = useState(45000);
  const [acresHarvested, setAcresHarvested] = useState(1);
  const [localTraderOffer, setLocalTraderOffer] = useState(22); // ₹/kg farmgate cash

  // Channel Calculations for quantityKg
  // Channel 1: Farmgate Middleman
  const c1Gross = quantityKg * localTraderOffer;
  const c1Transport = 0; // buyer picks up
  const c1Spoilage = 0; // buyer bears transit
  const c1Cess = 0;
  const c1NetRealization = c1Gross;
  const c1EffectivePerKg = localTraderOffer;

  // Channel 2: Nearby Mandi (25 km away)
  const c2Price = 27.5;
  const c2Gross = quantityKg * c2Price;
  const c2Transport = Math.round(25 * 14 + 350);
  const c2SpoilageRate = 0.02; // 2%
  const c2Spoilage = Math.round(c2Gross * c2SpoilageRate);
  const c2Cess = Math.round(c2Gross * 0.015);
  const c2NetRealization = c2Gross - c2Transport - c2Spoilage - c2Cess;
  const c2EffectivePerKg = +(c2NetRealization / quantityKg).toFixed(1);

  // Channel 3: Distant Super Mandi (75 km away)
  const c3Price = 33.0;
  const c3Gross = quantityKg * c3Price;
  const c3Transport = Math.round(75 * 16 + 500);
  const c3SpoilageRate = 0.045; // 4.5%
  const c3Spoilage = Math.round(c3Gross * c3SpoilageRate);
  const c3Cess = Math.round(c3Gross * 0.015);
  const c3NetRealization = c3Gross - c3Transport - c3Spoilage - c3Cess;
  const c3EffectivePerKg = +(c3NetRealization / quantityKg).toFixed(1);

  // Channel 4: HarvestLink Smart Decision Engine (FPO Pooled to Distant Super Mandi)
  const c4Price = 33.5;
  const c4Gross = quantityKg * c4Price;
  const c4Transport = Math.round(quantityKg * 0.95); // pooled bulk rate
  const c4SpoilageRate = 0.015; // aerated crates
  const c4Spoilage = Math.round(c4Gross * c4SpoilageRate);
  const c4Cess = 0; // direct FPO institutional exemption
  const c4NetRealization = c4Gross - c4Transport - c4Spoilage - c4Cess;
  const c4EffectivePerKg = +(c4NetRealization / quantityKg).toFixed(1);

  // Cultivation Cost
  const totalCultivationCost = costOfCultivationPerAcre * acresHarvested;
  const farmerNetProfitOverCosts = c4NetRealization - totalCultivationCost;

  const extraProfitOverMiddleman = c4NetRealization - c1NetRealization;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-emerald-500/30">
              <Calculator className="w-3.5 h-3.5" /> Farmgate-to-Pocket Financial Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Net Realization & 4-Channel Arbitrage Calculator
            </h1>
            <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
              Compare actual in-hand profit between selling to local village dalals, traveling to nearby mandis, or using HarvestLink’s pooled dispatch.
            </p>
          </div>
        </div>

        {/* Inputs & Parameter Sliders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            Harvest Batch & Production Economics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Crop Type</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 bg-white focus:outline-emerald-500"
              >
                <option value="tomato">Tomato (Perishable)</option>
                <option value="onion">Onion (Bulb)</option>
                <option value="potato">Potato (Tuber)</option>
                <option value="mango">Mango (Fruit)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Harvest Lot (kg)</label>
              <input
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Math.max(100, Number(e.target.value)))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Local Trader Offer (₹/kg)</label>
              <input
                type="number"
                value={localTraderOffer}
                onChange={(e) => setLocalTraderOffer(Math.max(1, Number(e.target.value)))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Cultivation Cost / Acre (₹)</label>
              <input
                type="number"
                value={costOfCultivationPerAcre}
                onChange={(e) => setCostOfCultivationPerAcre(Math.max(0, Number(e.target.value)))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 4-Channel Comparison Matrix */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">
              4-Channel Net Realization Comparison for {quantityKg.toLocaleString()} kg
            </h3>
            <span className="text-xs text-slate-500">Sorted from traditional to optimized</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Channel 1: Farmgate Middleman */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel 1</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Village Middleman (Dalal)</h4>
                <p className="text-[11px] text-slate-500">Farmgate pickup with zero transport hassle</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Offered Price:</span>
                    <span className="font-bold text-slate-900">₹{c1Price ? c1Price : localTraderOffer}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gross Value:</span>
                    <span className="text-slate-800">₹{c1Gross.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Transport Cost:</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Spoilage Loss:</span>
                    <span>₹0 (Agent absorbs)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Mandi Cess:</span>
                    <span>₹0</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Net In-Pocket Realization</div>
                <div className="text-2xl font-black text-slate-800 mt-0.5">₹{c1NetRealization.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">₹{c1EffectivePerKg} / kg net</div>
              </div>
            </div>

            {/* Channel 2: Nearby Mandi */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel 2</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Nearby Local Mandi (25 km)</h4>
                <p className="text-[11px] text-slate-500">Self-arranged transport in small auto</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mandi Price:</span>
                    <span className="font-bold text-slate-900">₹{c2Price}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gross Value:</span>
                    <span className="text-slate-800">₹{c2Gross.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>Transport Cost:</span>
                    <span>- ₹{c2Transport.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-600">
                    <span>Spoilage Loss (2%):</span>
                    <span>- ₹{c2Spoilage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Mandi Cess (1.5%):</span>
                    <span>- ₹{c2Cess.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Net In-Pocket Realization</div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">₹{c2NetRealization.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">₹{c2EffectivePerKg} / kg net</div>
              </div>
            </div>

            {/* Channel 3: Distant Super Mandi */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel 3</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Distant Super Mandi (75 km)</h4>
                <p className="text-[11px] text-slate-500">High prices but high transport overhead</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mandi Price:</span>
                    <span className="font-bold text-slate-900">₹{c3Price}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gross Value:</span>
                    <span className="text-slate-800">₹{c3Gross.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>Transport Cost:</span>
                    <span>- ₹{c3Transport.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-600">
                    <span>Spoilage Loss (4.5%):</span>
                    <span>- ₹{c3Spoilage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Mandi Cess (1.5%):</span>
                    <span>- ₹{c3Cess.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Net In-Pocket Realization</div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">₹{c3NetRealization.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">₹{c3EffectivePerKg} / kg net</div>
              </div>
            </div>

            {/* Channel 4: HarvestLink Smart Route */}
            <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-5 border-2 border-emerald-500 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                ★ Best Choice
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">HarvestLink Smart Route</span>
                <h4 className="font-bold text-white text-sm mt-0.5">FPO Pooled Direct Dispatch</h4>
                <p className="text-[11px] text-emerald-200">Shared Canter freight & aerated crates</p>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-emerald-300">Target Realization:</span>
                    <span className="font-bold text-white">₹{c4Price}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-300">Gross Value:</span>
                    <span className="text-slate-100">₹{c4Gross.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-teal-300">
                    <span>Pooled Transport:</span>
                    <span>- ₹{c4Transport.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-teal-300">
                    <span>Low Spoilage (1.5%):</span>
                    <span>- ₹{c4Spoilage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-teal-300">
                    <span>Mandi Cess:</span>
                    <span>₹0 (FPO direct)</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10">
                <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Top Net Realization</div>
                <div className="text-3xl font-black text-emerald-300 mt-0.5">₹{c4NetRealization.toLocaleString()}</div>
                <div className="text-xs font-bold text-emerald-200 mt-1">₹{c4EffectivePerKg} / kg effective</div>
              </div>
            </div>

          </div>
        </div>

        {/* Farmer Printable Decision Summary Slip */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <Receipt className="w-5 h-5" />
                HarvestLink Farmer Decision Advisory Certificate
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official economic decision memo generated by HarvestLink PS-02 Decision Support Engine
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Decision Slip
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Farmer & Crop Specifics</div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div><strong>Crop:</strong> {crop.toUpperCase()}</div>
                <div><strong>Total Quantity:</strong> {quantityKg.toLocaleString()} kg</div>
                <div><strong>Est. Farmgate Cost:</strong> ₹{totalCultivationCost.toLocaleString()}</div>
                <div><strong>Date Generated:</strong> September 25, 2026</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Decision Breakdown</div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div><strong>Recommended Channel:</strong> HarvestLink FPO Dispatch</div>
                <div><strong>Gross Revenue:</strong> ₹{c4Gross.toLocaleString()}</div>
                <div><strong>Net Deductions:</strong> ₹{(c4Transport + c4Spoilage).toLocaleString()}</div>
                <div className="text-emerald-700 font-bold"><strong>Final Net In-Hand:</strong> ₹{c4NetRealization.toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Net Wealth Generated</div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-center">
                <div className="text-[11px] text-emerald-800 font-semibold">Extra Income vs Local Middleman</div>
                <div className="text-2xl font-black text-emerald-700">+ ₹{extraProfitOverMiddleman.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-600 mt-1">
                  +{(((c4NetRealization - c1NetRealization) / c1NetRealization) * 100).toFixed(1)}% higher income
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
