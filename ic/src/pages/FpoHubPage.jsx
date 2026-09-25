import React, { useState } from 'react';
import { 
  Users, Building, ShoppingCart, Truck, ShieldCheck, 
  ArrowUpRight, Plus, Trash2, CheckCircle2, ChevronRight,
  Sparkles, DollarSign, Award, FileSpreadsheet
} from 'lucide-react';

export const institutionalBuyers = [
  {
    id: 'bigbasket',
    name: 'BigBasket Direct Farmgate Collection Center',
    location: 'Hoskote Procurement Hub, Bengaluru Rural',
    cropAccepted: 'Tomato, Capsicum, Onion',
    minLotKg: 2000,
    offeredPriceKg: 34.5,
    settlementTerms: 'T+1 Bank NEFT',
    gradingStandard: 'Grade A (Uniform color, zero rot, 45mm+ size)',
    contact: 'procurement.south@bigbasket.com'
  },
  {
    id: 'reliance-fresh',
    name: 'Reliance Retail Fresh Distribution Center',
    location: 'Nelamangala Logistics Corridor',
    cropAccepted: 'Tomato, Potato, Mango, Greens',
    minLotKg: 3000,
    offeredPriceKg: 35.0,
    settlementTerms: 'T+2 Direct Deposit',
    gradingStandard: 'Grade A & B sorted',
    contact: 'agri.karnataka@ril.com'
  },
  {
    id: 'safal-motherdairy',
    name: 'Safal / Mother Dairy Fruit & Veg Terminal',
    location: 'Whitefield Industrial Area',
    cropAccepted: 'All Seasonal Fruits & Vegetables',
    minLotKg: 1500,
    offeredPriceKg: 33.0,
    settlementTerms: 'Same-Day Cash Voucher',
    gradingStandard: 'Cleaned, crate-packed, pest-free',
    contact: '+91 80 2845 2200'
  },
  {
    id: 'tasty-bite-puree',
    name: 'Deccan Agro & Puree Processing Plant',
    location: 'Malur Industrial Cluster, Kolar',
    cropAccepted: 'Processing Grade Tomatoes',
    minLotKg: 5000,
    offeredPriceKg: 27.0,
    settlementTerms: 'Weekly Contract Payment',
    gradingStandard: 'Grade B/C acceptable (high brix sugar content)',
    contact: 'agri-desk@deccanagro.in'
  }
];

export default function FpoHubPage() {
  const [farmers, setFarmers] = useState([
    { id: 1, name: 'Ramesh Gowda', village: 'Malur', qtyKg: 800, grade: 'A' },
    { id: 2, name: 'Suresh Patil', village: 'Bangarapet', qtyKg: 1200, grade: 'A' },
    { id: 3, name: 'Anitha Reddy', village: 'Srinivaspur', qtyKg: 1500, grade: 'A' },
    { id: 4, name: 'Basavaraj K', village: 'Vemgal', qtyKg: 2000, grade: 'B' }
  ]);

  const [newFarmerName, setNewFarmerName] = useState('');
  const [newFarmerQty, setNewFarmerQty] = useState('');

  const totalPooledQty = farmers.reduce((sum, f) => sum + f.qtyKg, 0);

  // Economic analysis
  const soloTransportCostTotal = farmers.reduce((sum, f) => {
    // Individual auto/mini truck per farmer: ~₹1,200 min each
    return sum + Math.max(1200, f.qtyKg * 2.8);
  }, 0);

  // Full 14ft heavy truck single dispatch: ₹4,200 flat
  const pooledTruckCost = Math.max(3800, Math.round(totalPooledQty * 0.95));
  const totalFreightSaved = soloTransportCostTotal - pooledTruckCost;

  // Institutional bulk buyer rate vs standard mandi spot
  const mandiSpotPrice = 28;
  const institutionalBulkPrice = 33.5;
  const bulkPricePremiumPerKg = institutionalBulkPrice - mandiSpotPrice;
  const totalBulkRevenueGain = totalPooledQty * bulkPricePremiumPerKg;

  const totalFpoBenefit = totalFreightSaved + totalBulkRevenueGain;

  const handleAddFarmer = (e) => {
    e.preventDefault();
    if (!newFarmerName || !newFarmerQty) return;
    setFarmers([
      ...farmers,
      {
        id: Date.now(),
        name: newFarmerName,
        village: 'Kolar Cluster',
        qtyKg: Number(newFarmerQty),
        grade: 'A'
      }
    ]);
    setNewFarmerName('');
    setNewFarmerQty('');
  };

  const removeFarmer = (id) => {
    if (farmers.length > 1) {
      setFarmers(farmers.filter(f => f.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-emerald-500/30">
              <Users className="w-3.5 h-3.5" /> Collective Bargaining & FPO Aggregator
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Farmer Producer Organization (FPO) Pooling Hub
            </h1>
            <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
              Combine smallholder harvests into commercial full-truckload lots to unlock direct sales with corporate buyers and slash per-kg freight expenses by up to 65%.
            </p>
          </div>
        </div>

        {/* FPO Pooling Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Member Lot Pooling Table */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  Cluster Harvest Dispatch Roster
                </h2>
                <p className="text-xs text-slate-500">
                  Manage participating farmers pooling their produce into today's collective consignment
                </p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                {farmers.length} Farmers Enrolled
              </span>
            </div>

            {/* Farmers Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="p-3 font-semibold">Farmer Name</th>
                    <th className="p-3 font-semibold">Village</th>
                    <th className="p-3 font-semibold text-right">Quantity</th>
                    <th className="p-3 font-semibold text-center">Grade</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {farmers.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900">{f.name}</td>
                      <td className="p-3 text-slate-500">{f.village}</td>
                      <td className="p-3 font-mono font-bold text-right text-slate-900">{f.qtyKg.toLocaleString()} kg</td>
                      <td className="p-3 text-center">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          Grade {f.grade}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => removeFarmer(f.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove farmer from lot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-emerald-50/60 font-bold text-slate-900 border-t border-emerald-200">
                  <tr>
                    <td colSpan={2} className="p-3 text-emerald-950 font-bold">Total Consignment Volume</td>
                    <td className="p-3 text-right text-sm text-emerald-900 font-black">{totalPooledQty.toLocaleString()} kg</td>
                    <td colSpan={2} className="p-3 text-right text-xs text-emerald-700 font-semibold">
                      {(totalPooledQty / 1000).toFixed(1)} Metric Tons
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Quick Add Farmer Form */}
            <form onSubmit={handleAddFarmer} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Farmer name..."
                value={newFarmerName}
                onChange={(e) => setNewFarmerName(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-emerald-500"
              />
              <input
                type="number"
                placeholder="Weight (kg)..."
                value={newFarmerQty}
                onChange={(e) => setNewFarmerQty(e.target.value)}
                className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </div>

          {/* Collective Economics Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-md space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Award className="w-4 h-4" /> Collective Arbitrage Impact
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Total Group Extra Income</div>
                <div className="text-3xl font-black text-emerald-400 mt-0.5">
                  + ₹{totalFpoBenefit.toLocaleString()}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Generated across {farmers.length} farmers by pooling {totalPooledQty.toLocaleString()} kg into a unified corporate lot.
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <div>
                    <div className="font-semibold text-white">Freight Cost Savings</div>
                    <div className="text-[10px] text-slate-400">Single 14ft Canter vs {farmers.length} individual autos</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-300">₹{totalFreightSaved.toLocaleString()} Saved</div>
                    <div className="text-[10px] text-slate-400">~62% freight reduction</div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <div>
                    <div className="font-semibold text-white">Direct Bulk Price Premium</div>
                    <div className="text-[10px] text-slate-400">+₹{bulkPricePremiumPerKg}/kg direct institutional rate</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-teal-300">+ ₹{totalBulkRevenueGain.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">Bypasses middleman mandi cess</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Eligible for NABARD FPO Credit Guarantee Scheme</span>
              </div>
            </div>
          </div>

        </div>

        {/* Verified Institutional Buyers Board */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" />
                Direct Corporate & Processing Buyer Board
              </h3>
              <p className="text-xs text-slate-500">
                Institutional buyers with pre-agreed bulk purchase contracts available for verified FPO dispatches
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
              e-NAM Trade Clearing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {institutionalBuyers.map(buyer => (
              <div key={buyer.id} className="p-5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{buyer.name}</h4>
                    <p className="text-xs text-slate-500">{buyer.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      ₹{buyer.offeredPriceKg} / kg
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Min {buyer.minLotKg} kg</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                  <div><strong>Accepted Crops:</strong> {buyer.cropAccepted}</div>
                  <div><strong>Grading Spec:</strong> {buyer.gradingStandard}</div>
                  <div><strong>Settlement:</strong> {buyer.settlementTerms}</div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400 font-mono text-[11px]">{buyer.contact}</span>
                  <button className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                    Book Consignment <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
