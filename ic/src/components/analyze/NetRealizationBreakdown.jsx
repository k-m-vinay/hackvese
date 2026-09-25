import React from 'react';
import Card from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function NetRealizationBreakdown({ marketAnalyses }) {
  if (!marketAnalyses || marketAnalyses.length === 0) return null;

  // Prepare data for horizontal stacked bar chart
  const comparisonData = marketAnalyses.map(m => ({
    name: m.marketName,
    Net: Math.round(m.netRealization),
    Transport: Math.round(m.transportCost),
    Spoilage: Math.round(m.spoilageLoss),
    Gross: Math.round(m.grossRevenue)
  })).sort((a, b) => b.Net - a.Net);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
              <span className="text-slate-600">{entry.name}:</span>
              <span className="font-medium">₹{entry.value.toLocaleString()}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-slate-100 font-bold flex justify-between">
            <span>Gross Revenue:</span>
            <span>₹{(payload.reduce((sum, p) => sum + p.value, 0)).toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Net Realization Breakdown</h3>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={comparisonData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f1f5f9" />
            <XAxis type="number" tickFormatter={(value) => `₹${value/1000}k`} stroke="#94a3b8" fontSize={12} />
            <YAxis dataKey="name" type="category" width={80} stroke="#64748b" fontSize={12} fontWeight={500} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {/* Stacked bars: Net + Transport + Spoilage = Gross */}
            <Bar dataKey="Net" name="Net Realization" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Transport" name="Transport Cost" stackId="a" fill="#ef4444" />
            <Bar dataKey="Spoilage" name="Spoilage Loss" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-slate-500 text-center">
        Hover over bars to see detailed cost deductions from Gross Revenue.
      </div>
    </Card>
  );
}
