import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function SensitivitySliders({ baseValues, onValuesChange }) {
  
  const handleChange = (key, value) => {
    onValuesChange({
      ...baseValues,
      [key]: parseFloat(value)
    });
  };

  const resetValues = () => {
    onValuesChange({
      transportCostMultiplier: 1,
      priceMultiplier: 1,
      spoilageMultiplier: 1
    });
  };

  const renderSlider = (key, label, value, min, max, step, formatter) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-700">{label}</label>
          <span className={`text-sm font-bold px-2 py-1 rounded bg-slate-100 ${value !== 1 ? 'text-emerald-600' : 'text-slate-600'}`}>
            {formatter(value)}
          </span>
        </div>
        <div className="relative pt-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
            <span>{formatter(min)}</span>
            <span>Default</span>
            <span>{formatter(max)}</span>
          </div>
        </div>
      </div>
    );
  };

  const isChanged = baseValues.transportCostMultiplier !== 1 || 
                    baseValues.priceMultiplier !== 1 || 
                    baseValues.spoilageMultiplier !== 1;

  return (
    <Card className="p-6 h-full border-emerald-100 bg-emerald-50/30">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-800">What-If Analysis</h3>
        </div>
        {isChanged && (
          <button 
            onClick={resetValues}
            className="text-xs flex items-center gap-1 text-slate-500 hover:text-emerald-600 transition-colors bg-white px-2 py-1 rounded border border-slate-200 shadow-sm"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>
      <p className="text-sm text-slate-600 mb-6 pb-4 border-b border-emerald-100/50">
        Adjust these factors to test scenarios and see how the recommendation changes under different conditions.
      </p>

      <div className="space-y-2">
        {renderSlider(
          'priceMultiplier',
          'Expected Market Prices',
          baseValues.priceMultiplier,
          0.7, 1.5, 0.05,
          (val) => val === 1 ? 'Current' : `${Math.round(val * 100)}%`
        )}

        {renderSlider(
          'transportCostMultiplier',
          'Transport Costs (Fuel/Demand)',
          baseValues.transportCostMultiplier,
          0.5, 2.0, 0.1,
          (val) => val === 1 ? 'Standard' : `${Math.round(val * 100)}%`
        )}

        {renderSlider(
          'spoilageMultiplier',
          'Spoilage / Perishability Rate',
          baseValues.spoilageMultiplier,
          0.5, 2.0, 0.1,
          (val) => val === 1 ? 'Expected' : `${Math.round(val * 100)}%`
        )}
      </div>
      
      {isChanged && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
          <span className="text-amber-500">ℹ️</span>
          <span>You are viewing custom scenario results. The best market might have changed based on your adjustments.</span>
        </div>
      )}
    </Card>
  );
}
