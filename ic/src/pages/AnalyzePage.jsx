import React, { useState } from 'react';
import { analyzeMarkets } from '../engine/decisionEngine';
import FarmerInputForm from '../components/analyze/FarmerInputForm';
import MarketComparisonTable from '../components/analyze/MarketComparisonTable';
import RecommendationCard from '../components/analyze/RecommendationCard';
import NetRealizationBreakdown from '../components/analyze/NetRealizationBreakdown';
import PriceTrendChart from '../components/analyze/PriceTrendChart';
import RiskAnalysisPanel from '../components/analyze/RiskAnalysisPanel';
import SensitivitySliders from '../components/analyze/SensitivitySliders';
import Button from '../components/ui/Button';

export default function AnalyzePage() {
  const [step, setStep] = useState('input');
  const [formData, setFormData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [multipliers, setMultipliers] = useState({
    transportCostMultiplier: 1,
    priceMultiplier: 1,
    spoilageMultiplier: 1
  });

  const handleFormSubmit = async (data) => {
    setFormData(data);
    runAnalysis(data, multipliers);
  };

  const handleValuesChange = (newMultipliers) => {
    setMultipliers(newMultipliers);
    if (formData) {
      runAnalysis(formData, newMultipliers);
    }
  };

  const runAnalysis = (data, mults) => {
    // In a real app this might be async
    const result = analyzeMarkets({ ...data, ...mults });
    setAnalysisResult(result);
    setStep('results');
  };

  const handleNewAnalysis = () => {
    setStep('input');
    setFormData(null);
    setAnalysisResult(null);
    setMultipliers({
      transportCostMultiplier: 1,
      priceMultiplier: 1,
      spoilageMultiplier: 1
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {step === 'input' && (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Analyze Your Harvest</h1>
            <FarmerInputForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {step === 'results' && analysisResult && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-800">Analysis Results</h1>
              <Button onClick={handleNewAnalysis} variant="outline">
                New Analysis
              </Button>
            </div>

            {/* Recommendation Row */}
            <div className="w-full">
              <RecommendationCard 
                recommendation={analysisResult.recommendation} 
                topMarketAnalysis={analysisResult.marketAnalyses[0]} 
              />
            </div>

            {/* Table Row */}
            <div className="w-full">
              <MarketComparisonTable 
                marketAnalyses={analysisResult.marketAnalyses} 
                recommendedMarketId={analysisResult.recommendation.marketId} 
              />
            </div>

            {/* Breakdown & Risk Row */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-3/5">
                <NetRealizationBreakdown marketAnalyses={analysisResult.marketAnalyses} />
              </div>
              <div className="w-full lg:w-2/5">
                <RiskAnalysisPanel 
                  riskFactors={analysisResult.recommendation.riskFactors} 
                  overallRisk={analysisResult.recommendation.overallRisk} 
                />
              </div>
            </div>

            {/* Charts & Sensitivity Row */}
            <div className="flex flex-col lg:flex-row gap-6 pb-12">
              <div className="w-full lg:w-3/5">
                <PriceTrendChart 
                  cropId={formData.cropId} 
                  marketId={analysisResult.recommendation.marketId} 
                />
              </div>
              <div className="w-full lg:w-2/5">
                <SensitivitySliders 
                  baseValues={multipliers} 
                  onValuesChange={handleValuesChange} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
