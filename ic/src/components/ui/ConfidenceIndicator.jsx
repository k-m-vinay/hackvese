import React from 'react';

const ConfidenceIndicator = ({ level = 'Medium', showLabel = true }) => {
  const levels = {
    Low: { bars: 1, color: 'bg-red-500', textColor: 'text-red-600' },
    Medium: { bars: 2, color: 'bg-amber-500', textColor: 'text-amber-600' },
    High: { bars: 3, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  };

  const currentConfig = levels[level] || levels['Medium'];

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-end gap-1 h-4">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={`w-1.5 rounded-sm transition-colors ${
              bar <= currentConfig.bars ? currentConfig.color : 'bg-gray-200'
            }`}
            style={{ height: `${(bar / 3) * 100}%` }}
          />
        ))}
      </div>
      {showLabel && (
        <span className={`text-xs font-medium ${currentConfig.textColor}`}>
          {level} Confidence
        </span>
      )}
    </div>
  );
};

export default ConfidenceIndicator;
