import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function MarketComparisonTable({ marketAnalyses, recommendedMarketId }) {
  // Sort by net realization descending
  const sortedAnalyses = [...marketAnalyses].sort((a, b) => b.netRealization - a.netRealization);

  const getRankBadge = (index) => {
    switch (index) {
      case 0: return <span className="text-xl" title="1st Place">🥇</span>;
      case 1: return <span className="text-xl" title="2nd Place">🥈</span>;
      case 2: return <span className="text-xl" title="3rd Place">🥉</span>;
      default: return <span className="text-slate-400 font-bold ml-1">{index + 1}</span>;
    }
  };

  const formatCurrency = (val) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  return (
    <Card className="overflow-hidden shadow-sm border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-100 text-slate-600 font-medium">
            <tr>
              <th className="p-4">Rank / Market</th>
              <th className="p-4">Distance</th>
              <th className="p-4">Price/kg</th>
              <th className="p-4">Transport Cost</th>
              <th className="p-4">Spoilage</th>
              <th className="p-4">Sellable Qty</th>
              <th className="p-4">Gross Revenue</th>
              <th className="p-4 font-bold text-emerald-800 bg-emerald-100/50">Net Realization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedAnalyses.map((analysis, index) => {
              const isRecommended = analysis.marketId === recommendedMarketId;
              return (
                <tr 
                  key={analysis.marketId} 
                  className={`hover:bg-slate-50 transition-colors ${isRecommended ? 'bg-emerald-50/70' : ''}`}
                >
                  <td className="p-4 flex items-center gap-3">
                    {getRankBadge(index)}
                    <span className={`font-semibold ${isRecommended ? 'text-emerald-800' : 'text-slate-800'}`}>
                      {analysis.marketName}
                    </span>
                    {isRecommended && <Badge className="bg-emerald-200 text-emerald-800 text-xs ml-2">Best</Badge>}
                  </td>
                  <td className="p-4 text-slate-600">{analysis.distanceKm} km</td>
                  <td className="p-4 font-medium">₹{analysis.expectedPrice.toFixed(2)}</td>
                  <td className="p-4 text-red-600">- {formatCurrency(analysis.transportCost)}</td>
                  <td className="p-4 text-orange-600">
                    {(analysis.spoilagePercent).toFixed(1)}% (-{formatCurrency(analysis.spoilageLoss)})
                  </td>
                  <td className="p-4 text-slate-600">{analysis.sellableQuantity.toFixed(0)} kg</td>
                  <td className="p-4 text-slate-800">{formatCurrency(analysis.grossRevenue)}</td>
                  <td className={`p-4 font-bold text-lg ${isRecommended ? 'text-emerald-700 bg-emerald-100/30' : 'text-slate-800'}`}>
                    {formatCurrency(analysis.netRealization)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
