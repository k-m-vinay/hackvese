import React from 'react';
import Card from '../ui/Card';
import { getPriceHistory } from '../../data/historicalPrices';
import { analyzePriceTrend } from '../../engine/priceModel';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function PriceTrendChart({ cropId, marketId }) {
  // Fetch historical data
  const history = getPriceHistory(cropId, marketId);
  const trendAnalysis = analyzePriceTrend(history);
  
  if (!history || history.length === 0) {
    return (
      <Card className="p-6 h-full flex items-center justify-center text-slate-500">
        No price history available for this combination.
      </Card>
    );
  }

  // Create chart data combining history and 3-day simple forecast
  const lastPrice = history[history.length - 1].price;
  const trendMultiplier = trendAnalysis.trend === 'up' ? 1.02 : trendAnalysis.trend === 'down' ? 0.98 : 1.0;
  
  const chartData = [...history.map(item => ({
    date: item.date.substring(5), // Show MM-DD
    fullDate: item.date,
    historicalPrice: item.price,
    forecastPrice: null
  }))];
  
  // Add 3 days forecast
  const lastDateStr = history[history.length - 1].date;
  const lastDate = new Date(lastDateStr);
  
  for (let i = 1; i <= 3; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + i);
    const forecastVal = lastPrice * Math.pow(trendMultiplier, i);
    
    chartData.push({
      date: nextDate.toISOString().split('T')[0].substring(5),
      fullDate: nextDate.toISOString().split('T')[0],
      historicalPrice: i === 1 ? lastPrice : null, // Connect the lines
      forecastPrice: forecastVal
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{payload[0].payload.fullDate}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
              <span className="text-slate-600">{entry.name}:</span>
              <span className="font-bold">₹{entry.value.toFixed(2)}/kg</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-bold text-slate-800">Price Trend Forecast</h3>
        <div className="text-right">
          <div className="text-sm text-slate-500">Current Trend</div>
          <div className={`font-bold capitalize ${trendAnalysis.trend === 'up' ? 'text-emerald-600' : trendAnalysis.trend === 'down' ? 'text-red-500' : 'text-slate-600'}`}>
            {trendAnalysis.trend} ({trendAnalysis.volatility})
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickMargin={10} />
            <YAxis domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} stroke="#94a3b8" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            <Line 
              type="monotone" 
              dataKey="historicalPrice" 
              name="Historical Price" 
              stroke="#0f766e" 
              strokeWidth={3}
              dot={{ r: 3, fill: '#0f766e', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="forecastPrice" 
              name="Forecast" 
              stroke="#f59e0b" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
            />
            
            <ReferenceLine x={history[history.length-1].date.substring(5)} stroke="#cbd5e1" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
