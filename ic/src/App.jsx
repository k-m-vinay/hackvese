import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import MarketsPage from './pages/MarketsPage';
import ColdStoragePage from './pages/ColdStoragePage';
import LogisticsPage from './pages/LogisticsPage';
import ForecastPage from './pages/ForecastPage';
import ModelTransparencyPage from './pages/ModelTransparencyPage';
import FpoHubPage from './pages/FpoHubPage';
import WeatherAdvisoryPage from './pages/WeatherAdvisoryPage';
import ProfitCalculatorPage from './pages/ProfitCalculatorPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/cold-storage" element={<ColdStoragePage />} />
          <Route path="/logistics" element={<LogisticsPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/model-transparency" element={<ModelTransparencyPage />} />
          <Route path="/fpo-hub" element={<FpoHubPage />} />
          <Route path="/weather-advisory" element={<WeatherAdvisoryPage />} />
          <Route path="/profit-calculator" element={<ProfitCalculatorPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
