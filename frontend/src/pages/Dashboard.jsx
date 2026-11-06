import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, BarChart2, Sprout, Droplets, 
  Store, Calculator, CloudSun, Bell, Shield, 
  ArrowRight, CheckCircle2, AlertTriangle, Plus 
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, easyMode, speakText } = useApp();
  const [weather, setWeather] = useState(null);
  const [topPrices, setTopPrices] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getWeather(user?.district || 'Kolar'),
      api.getTodayPrices('sort=modal_desc'),
      api.getMyListings()
    ]).then(([wRes, pRes, lRes]) => {
      setWeather(wRes);
      if (pRes.prices) setTopPrices(pRes.prices.slice(0, 6));
      if (lRes) setMyListings(lRes.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const quickActions = [
    { to: '/prices', label: "Today's Mandi Rates", icon: TrendingUp, color: 'bg-emerald-600', text: 'text-white' },
    { to: '/prediction', label: 'AI Price Forecast', icon: BarChart2, color: 'bg-amber-500', text: 'text-stone-950' },
    { to: '/soil', label: 'Soil Health Analysis', icon: Sprout, color: 'bg-lime-600', text: 'text-white' },
    { to: '/water', label: 'Water Intelligence', icon: Droplets, color: 'bg-blue-600', text: 'text-white' },
    { to: '/sell', label: 'Sell Your Crop', icon: Store, color: 'bg-amber-400', text: 'text-stone-950' },
    { to: '/calculator', label: 'Net Profit Calculator', icon: Calculator, color: 'bg-teal-600', text: 'text-white' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Weather Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs text-amber-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>Easy Mode Active • {user?.village}, {user?.district}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Namaste, {user?.name || 'Kisan Bandhu'}! 🌾
          </h1>
          <p className="text-emerald-200 text-sm max-w-xl">
            Welcome to your Smart KRISHI agricultural command center. Check today's prices, weather updates, and soil recommendations.
          </p>
        </div>

        {/* Live Weather Widget */}
        {weather && (
          <div className="bg-emerald-950/70 border border-emerald-700/60 p-4 rounded-2xl flex items-center space-x-4 min-w-[240px]">
            <CloudSun className="w-12 h-12 text-amber-400" />
            <div>
              <div className="text-2xl font-black text-white">{weather.temperature}°C</div>
              <div className="text-xs text-emerald-200">{weather.condition}</div>
              <div className="text-[11px] text-amber-300">Humidity: {weather.humidity}% • {weather.district}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Big Touch Action Grid (Min 56px main action buttons) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">Key Farming Actions</h2>
          <button
            onClick={() => speakText("Here are your quick farming actions: Mandi rates, AI Price forecast, Soil analysis, Water table, Sell crops, and Profit calculator.")}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            🔊 Listen Options
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.to}
                className="btn-kisan flex-col items-center justify-center p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition group text-center"
                style={{ minHeight: '110px' }}
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} ${action.text} flex items-center justify-center mb-2 group-hover:scale-110 transition`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-emerald-800 leading-tight">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Mandi Prices Preview & Active Listings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Mandi Rates */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <span>Today's Highest Mandi Prices</span>
            </h2>
            <Link to="/prices" className="text-xs font-bold text-emerald-700 hover:underline">
              View All Mandis →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topPrices.map((p) => (
              <div key={p.id} className="card-kisan p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-stone-900 text-base">{p.crop_name}</h4>
                    <p className="text-xs text-stone-500">{p.market_name} ({p.state})</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-extrabold text-emerald-800">₹{p.modal_price}</div>
                    <div className="text-[10px] text-stone-400">Min: ₹{p.min_price} • Max: ₹{p.max_price}</div>
                  </div>
                  <Link
                    to={`/prediction?crop_id=${p.crop_id}`}
                    className="text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 px-3 py-1.5 rounded-lg transition"
                  >
                    AI Forecast
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Marketplace Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900 flex items-center space-x-2">
              <Store className="w-5 h-5 text-amber-600" />
              <span>Your Crop Listings</span>
            </h2>
            <Link to="/sell" className="text-xs font-bold text-emerald-700 hover:underline">
              + New Listing
            </Link>
          </div>

          <div className="card-kisan p-5 space-y-4">
            {myListings.length > 0 ? (
              myListings.map((l) => (
                <div key={l.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-stone-900">{l.crop_name}</div>
                    <div className="text-xs text-stone-500">{l.quantity_quintals} Q @ ₹{l.price_per_quintal}/Q</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">{l.enquiries_count} Buyer Enquiries</div>
                  </div>
                  <Link
                    to="/sell"
                    className="text-xs bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg"
                  >
                    Manage
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-stone-500 space-y-3">
                <p className="text-sm">You have no active crop listings.</p>
                <Link to="/sell" className="btn-kisan btn-kisan-primary text-xs px-4 py-2">
                  List Your Harvest
                </Link>
              </div>
            )}

            <div className="pt-2 border-t border-stone-100">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Zero commission trading direct between farmers and APMC registered buyers.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

