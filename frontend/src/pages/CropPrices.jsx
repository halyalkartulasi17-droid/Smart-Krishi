import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Search, Filter, ArrowUpDown, 
  MapPin, Calendar, Sparkles, AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';

export default function CropPrices() {
  const [prices, setPrices] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('modal_desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCrops().then(setCrops).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    let params = `sort=${sortBy}`;
    if (selectedCrop) params += `&crop=${selectedCrop}`;
    if (selectedState) params += `&state=${selectedState}`;
    if (search) params += `&search=${encodeURIComponent(search)}`;

    api.getTodayPrices(params)
      .then(res => {
        setPrices(res.prices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCrop, selectedState, search, sortBy]);

  const states = ['Karnataka', 'Maharashtra', 'Punjab', 'Madhya Pradesh', 'Andhra Pradesh', 'Tamil Nadu', 'Uttar Pradesh'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-emerald-700" />
            <span>Today's Mandi Prices</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Real-time daily modal, minimum, and maximum prices per quintal from major APMC mandis.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3 py-1.5 rounded-xl flex items-center space-x-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Source: Agmarknet (DMI Government of India)</span>
        </div>
      </div>

      {/* Picture-Based Crop Selection (Accessible for Farmers) */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
          Select Crop (Tap photo to filter)
        </label>
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCrop('')}
            className={`px-4 py-3 rounded-2xl font-bold text-sm shrink-0 border transition ${
              !selectedCrop ? 'bg-emerald-800 text-white border-emerald-900 shadow-md' : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-400'
            }`}
          >
            All Crops ({crops.length})
          </button>
          {crops.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCrop(c.code === selectedCrop ? '' : c.code)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-2xl shrink-0 border transition ${
                selectedCrop === c.code
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-400'
              }`}
            >
              <img src={c.image_url} alt={c.name} className="w-8 h-8 rounded-full object-cover border" />
              <span className="font-bold text-sm">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-kisan p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search crop or mandi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-100 pl-9 pr-3 py-2.5 rounded-xl text-sm border-none focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>

        {/* State Filter */}
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-stone-100 px-3 py-2.5 rounded-xl text-sm border-none focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-stone-800"
        >
          <option value="">All States (India)</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Sort Filter */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-stone-100 px-3 py-2.5 rounded-xl text-sm border-none focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-stone-800"
        >
          <option value="modal_desc">Highest Price First (₹)</option>
          <option value="modal_asc">Lowest Price First (₹)</option>
          <option value="name">Crop Name (A-Z)</option>
        </select>

        {/* Total Badge */}
        <div className="text-right text-xs font-bold text-stone-500 hidden lg:block">
          Showing {prices.length} mandis
        </div>
      </div>

      {/* Prices Grid */}
      {loading ? (
        <div className="text-center py-16 text-stone-500">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span>Loading live Mandi prices...</span>
        </div>
      ) : prices.length === 0 ? (
        <div className="text-center py-16 card-kisan p-8 space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">No prices match your filter.</h3>
          <p className="text-sm text-stone-500">Try selecting "All Crops" or changing the state.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prices.map((p) => (
            <div
              key={p.id}
              className="card-kisan p-5 flex flex-col justify-between hover:border-emerald-500 transition group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {p.category}
                  </span>
                  <span className="text-stone-400 font-medium">{p.date}</span>
                </div>

                <h3 className="text-xl font-extrabold text-stone-900 group-hover:text-emerald-800 transition">
                  {p.crop_name}
                </h3>
                <div className="flex items-center space-x-1 text-xs text-stone-600 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">{p.market_name}</span>
                  <span>• {p.district}, {p.state}</span>
                </div>
              </div>

              {/* Price Details */}
              <div className="mt-5 pt-4 border-t border-stone-100">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-stone-500 font-bold uppercase">Modal Price:</span>
                  <span className="text-2xl font-black text-emerald-800">
                    ₹{p.modal_price}
                    <span className="text-xs font-normal text-stone-500 ml-1">/Quintal</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-stone-600 mb-3">
                  <div>Min Rate: <span className="font-bold text-stone-800">₹{p.min_price}</span></div>
                  <div className="text-right">Max Rate: <span className="font-bold text-stone-800">₹{p.max_price}</span></div>
                  <div className="col-span-2 text-[11px] text-stone-500">
                    Daily Arrivals: <span className="font-bold">{p.arrival_tonnes} tonnes</span>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/prediction?crop_id=${p.crop_id}`}
                    className="flex-1 text-center py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-sm transition"
                  >
                    AI Forecast
                  </Link>
                  <Link
                    to={`/calculator?crop_id=${p.crop_id}&price=${p.modal_price}`}
                    className="flex-1 text-center py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                  >
                    Calculate Profit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

