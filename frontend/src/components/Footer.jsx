import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, Heart, ExternalLink, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-24 sm:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 p-1 border border-amber-400">
                <img src="/logo.svg" alt="Smart KRISHI" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                Smart <span className="text-amber-400">KRISHI</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Smart Farming. Better Prices. Higher Opportunities. Dedicated full-stack platform empowering Indian farmers with verified market intelligence, AI predictions, and fair trading.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-300 font-semibold bg-stone-800/80 p-2.5 rounded-lg border border-stone-700">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Toll Free Kisan Call Centre: 1800-180-1551</span>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center space-x-1.5">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Farmer Tools</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/prices" className="hover:text-amber-300 transition">Today's Mandi Prices</Link></li>
              <li><Link to="/prediction" className="hover:text-amber-300 transition">AI Price Forecasts</Link></li>
              <li><Link to="/soil" className="hover:text-amber-300 transition">Soil Health & Recommendations</Link></li>
              <li><Link to="/water" className="hover:text-amber-300 transition">Groundwater Intelligence</Link></li>
              <li><Link to="/calculator" className="hover:text-amber-300 transition">Net Return Calculator</Link></li>
              <li><Link to="/weather" className="hover:text-amber-300 transition">Weather Advisory</Link></li>
            </ul>
          </div>

          {/* Marketplace & Trade */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">Direct Mandi Trade</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sell" className="hover:text-amber-300 transition">Sell Your Harvest (Zero Commission)</Link></li>
              <li><Link to="/buy" className="hover:text-amber-300 transition">Browse Agricultural Listings</Link></li>
              <li><Link to="/markets" className="hover:text-amber-300 transition">Nearby APMC Mandis</Link></li>
              <li><Link to="/demand" className="hover:text-amber-300 transition">Production vs Demand Trends</Link></li>
              <li><Link to="/profile" className="hover:text-amber-300 transition">Farmer Profile & Language Settings</Link></li>
            </ul>
          </div>

          {/* Official Agricultural Disclaimers */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Advisory & Compliance</span>
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Price predictions are algorithmic statistical estimates and not guaranteed market prices. Market arrivals data modeled on Agmarknet / DMI. Weather data provided via Open-Meteo & IMD.
            </p>
            <div className="pt-2 text-xs text-stone-500">
              Built for Indian Agriculture Hackathon 2026. Designed for mobile-first accessibility across 23 languages.
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Smart KRISHI. All rights reserved.
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Empowering farmers across Bharat with AI & Open Data</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

