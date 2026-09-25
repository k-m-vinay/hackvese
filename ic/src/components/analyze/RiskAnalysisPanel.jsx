import React from 'react';
import Card from '../ui/Card';
import RiskGauge from '../ui/RiskGauge';
import Badge from '../ui/Badge';

export default function RiskAnalysisPanel({ riskFactors, overallRisk }) {
  if (!riskFactors) return null;

  const getRiskColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getRiskBadgeColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getScorePercentage = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return 25;
      case 'medium': return 60;
      case 'high': return 90;
      default: return 50;
    }
  };

  const renderRiskFactor = (title, level, description) => {
    const percentage = getScorePercentage(level);
    
    return (
      <div className="mb-5 last:mb-0">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-slate-700 text-sm">{title}</span>
          <Badge className={`text-xs ${getRiskBadgeColor(level)}`}>{level.toUpperCase()}</Badge>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
          <div 
            className={`h-2 rounded-full ${getRiskColor(level)} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
    );
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Risk Assessment</h3>
      
      <div className="flex justify-center mb-8">
        <div className="w-48 h-48">
          <RiskGauge level={overallRisk} />
        </div>
      </div>
      
      <div className="space-y-4 flex-1">
        {renderRiskFactor(
          "Price Volatility", 
          riskFactors.priceVolatility, 
          "Historical price fluctuations in the chosen market."
        )}
        
        {renderRiskFactor(
          "Weather Risk", 
          riskFactors.weather, 
          "Impact of current weather on transit conditions and crop preservation."
        )}
        
        {renderRiskFactor(
          "Spoilage Risk", 
          riskFactors.spoilage, 
          "Likelihood of quality degradation during transport based on distance and crop type."
        )}
      </div>
    </Card>
  );
}
