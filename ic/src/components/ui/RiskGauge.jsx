import React from 'react';

const RiskGauge = ({ value = 0, label = 'Risk Level', size = 'md' }) => {
  // Normalize value to 0-100
  const normalizedValue = Math.min(Math.max(Number(value), 0), 100);

  const sizes = {
    sm: { width: 120, height: 60, strokeWidth: 8, fontSize: '1.25rem' },
    md: { width: 160, height: 80, strokeWidth: 12, fontSize: '1.5rem' },
    lg: { width: 200, height: 100, strokeWidth: 16, fontSize: '2rem' },
  };

  const { width, height, strokeWidth, fontSize } = sizes[size] || sizes.md;
  const radius = width / 2 - strokeWidth / 2;
  const circumference = Math.PI * radius; // Half circle
  const dashoffset = circumference - (normalizedValue / 100) * circumference;

  // Determine color based on value
  const getColor = (val) => {
    if (val <= 30) return '#10b981'; // emerald-500
    if (val <= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const color = getColor(normalizedValue);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="overflow-visible">
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${height}`}
            fill="none"
            stroke="#e5e7eb" // gray-200
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d={`M ${strokeWidth / 2} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${height}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-2">
          <span className="font-bold text-gray-900" style={{ fontSize }}>
            {normalizedValue}%
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-4 text-sm font-medium text-gray-600">{label}</span>
      )}
    </div>
  );
};

export default RiskGauge;
