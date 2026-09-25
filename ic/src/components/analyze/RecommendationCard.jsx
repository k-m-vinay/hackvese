import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ConfidenceIndicator from '../ui/ConfidenceIndicator';
import { CheckCircle, MapPin, Clock, Truck } from 'lucide-react';

export default function RecommendationCard({ recommendation, topMarketAnalysis }) {
  if (!recommendation || !topMarketAnalysis) return null;

  const formatCurrency = (val) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  return (
    <Card className="relative overflow-hidden border-2 border-emerald-500 shadow-xl bg-white">
      <div className="bg-emerald-600 text-white py-2 px-4 font-bold text-center tracking-widest text-sm">
        AI RECOMMENDED STRATEGY
      </div>
      
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
            Sell at {topMarketAnalysis.marketName}
          </h2>
          <p className="text-emerald-700 font-medium text-lg">
            Expected Net Realization: {formatCurrency(topMarketAnalysis.netRealization)}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold">
              <MapPin className="text-emerald-500 w-5 h-5" /> WHERE
            </div>
            <p className="text-slate-600 text-sm">
              <strong>{topMarketAnalysis.marketName}</strong><br />
              Distance: {topMarketAnalysis.distanceKm} km<br />
              Market Type: Wholesale Mandi
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold">
              <Clock className="text-emerald-500 w-5 h-5" /> WHEN
            </div>
            <p className="text-slate-600 text-sm">
              <strong>{recommendation.timing}</strong><br />
              Price Trend: Stable<br />
              Weather: Favorable for transport
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold">
              <Truck className="text-emerald-500 w-5 h-5" /> HOW
            </div>
            <p className="text-slate-600 text-sm">
              <strong>Standard Transport</strong><br />
              Est. Cost: {formatCurrency(topMarketAnalysis.transportCost)}<br />
              Est. Spoilage: {topMarketAnalysis.spoilagePercent.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
          <h3 className="font-bold text-slate-800 mb-4">Why this market?</h3>
          <ul className="space-y-2">
            {recommendation.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            Estimated Range: <span className="font-medium text-slate-700">{formatCurrency(topMarketAnalysis.netRealization * 0.95)} — {formatCurrency(topMarketAnalysis.netRealization * 1.05)}</span>
          </div>
          <ConfidenceIndicator score={recommendation.confidenceScore} />
        </div>
      </div>
    </Card>
  );
}
