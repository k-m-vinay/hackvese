import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { crops } from '../../data/crops';
import { markets } from '../../data/markets';

export default function FarmerInputForm({ onSubmit }) {
  const [cropId, setCropId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [grade, setGrade] = useState('A');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Bangalore');
  const [selectedMarketIds, setSelectedMarketIds] = useState(markets.map(m => m.id));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!cropId) newErrors.cropId = 'Please select a crop.';
    if (!quantity || isNaN(quantity) || quantity < 1 || quantity > 50000) {
      newErrors.quantity = 'Quantity must be between 1 and 50,000 kg.';
    }
    if (!harvestDate) newErrors.harvestDate = 'Harvest date is required.';
    if (!location) newErrors.location = 'Location is required.';
    if (selectedMarketIds.length === 0) newErrors.markets = 'Select at least one market.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        cropId,
        quantity: parseFloat(quantity),
        grade,
        harvestDate,
        location,
        selectedMarketIds
      });
    }
  };

  const handleMarketToggle = (id) => {
    setSelectedMarketIds(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <Card className="p-6 md:p-8 bg-white shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Crop Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Crop Type</label>
            <select 
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${errors.cropId ? 'border-red-500' : 'border-slate-300'}`}
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
            >
              <option value="">Select a crop...</option>
              {crops.map(crop => (
                <option key={crop.id} value={crop.id}>{crop.icon} {crop.name}</option>
              ))}
            </select>
            {errors.cropId && <p className="text-red-500 text-xs mt-1">{errors.cropId}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quantity (kg)</label>
            <div className="relative">
              <input 
                type="number"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${errors.quantity ? 'border-red-500' : 'border-slate-300'}`}
                placeholder="e.g. 1000"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max="50000"
              />
              <span className="absolute right-4 top-3 text-slate-400">kg</span>
            </div>
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>

          {/* Grade */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quality Grade</label>
            <div className="flex gap-4">
              {['A', 'B', 'C'].map((g) => (
                <label key={g} className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${grade === g ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-medium' : 'border-slate-300 hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="grade" 
                    value={g} 
                    checked={grade === g} 
                    onChange={() => setGrade(g)}
                    className="sr-only"
                  />
                  Grade {g} {'★'.repeat(g === 'A' ? 3 : g === 'B' ? 2 : 1)}
                </label>
              ))}
            </div>
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Expected Sale Date</label>
            <input 
              type="date"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${errors.harvestDate ? 'border-red-500' : 'border-slate-300'}`}
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
            />
            {errors.harvestDate && <p className="text-red-500 text-xs mt-1">{errors.harvestDate}</p>}
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Your Location</label>
            <input 
              type="text"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${errors.location ? 'border-red-500' : 'border-slate-300'}`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter village, taluk or city"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Market Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Markets to Compare</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {markets.map(market => (
                <label key={market.id} className="flex items-start gap-2 p-3 border rounded-lg border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="checkbox"
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    checked={selectedMarketIds.includes(market.id)}
                    onChange={() => handleMarketToggle(market.id)}
                  />
                  <div>
                    <div className="font-medium text-sm text-slate-800">{market.name}</div>
                    <div className="text-xs text-slate-500">{market.distanceKm} km</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.markets && <p className="text-red-500 text-xs mt-1">{errors.markets}</p>}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Button type="submit" className="w-full text-lg py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md">
            Analyze Markets →
          </Button>
        </div>
      </form>
    </Card>
  );
}
