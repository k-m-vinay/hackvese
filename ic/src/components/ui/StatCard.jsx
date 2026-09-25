import React from 'react';
import Card from './Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard = ({
  label,
  value,
  unit = '',
  icon: Icon,
  trend = 'neutral',
  trendValue,
  className = '',
}) => {
  const renderTrend = () => {
    if (!trendValue) return null;

    const trendConfig = {
      up: { icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      down: { icon: ArrowDownRight, color: 'text-red-600', bg: 'bg-red-50' },
      neutral: { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-50' },
    };

    const config = trendConfig[trend];
    const TrendIcon = config.icon;

    return (
      <div className={`flex items-center space-x-1 ${config.color} ${config.bg} px-2 py-1 rounded-full text-xs font-medium`}>
        <TrendIcon className="w-3 h-3" />
        <span>{trendValue}</span>
      </div>
    );
  };

  return (
    <Card className={`flex flex-col ${className}`} hover>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        {Icon && (
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-sm font-medium text-gray-500">{unit}</span>}
      </div>
      {trendValue && (
        <div className="mt-4 flex items-center">
          {renderTrend()}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
