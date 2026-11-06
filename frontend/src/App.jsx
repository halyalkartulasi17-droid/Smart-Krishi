import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import KisanMitraChat from './components/KisanMitraChat';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CropPrices from './pages/CropPrices';
import PricePrediction from './pages/PricePrediction';
import SoilAnalysis from './pages/SoilAnalysis';
import CropRecommendations from './pages/CropRecommendations';
import WaterIntelligence from './pages/WaterIntelligence';
import CropDemand from './pages/CropDemand';
import BuyCrops from './pages/BuyCrops';
import SellCrops from './pages/SellCrops';
import NearbyMarkets from './pages/NearbyMarkets';
import SellingCalculator from './pages/SellingCalculator';
import Weather from './pages/Weather';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-200">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prices" element={<CropPrices />} />
            <Route path="/prediction" element={<PricePrediction />} />
            <Route path="/soil" element={<SoilAnalysis />} />
            <Route path="/recommendations" element={<CropRecommendations />} />
            <Route path="/water" element={<WaterIntelligence />} />
            <Route path="/demand" element={<CropDemand />} />
            <Route path="/buy" element={<BuyCrops />} />
            <Route path="/sell" element={<SellCrops />} />
            <Route path="/markets" element={<NearbyMarkets />} />
            <Route path="/calculator" element={<SellingCalculator />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <KisanMitraChat />
      </div>
    </BrowserRouter>
  );
}

