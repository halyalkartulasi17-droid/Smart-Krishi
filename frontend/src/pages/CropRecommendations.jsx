import React, { useState, useEffect } from 'react';
import { 
  Shield, Sprout, Droplets, TrendingUp, 
  CloudSun, CheckCircle2, ArrowRight, AlertTriangle 
} from 'lucide-react';
import { api } from '../services/api';

export default function CropRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [soilType, setSoilType] = useState('Red');
  const [waterSource, setWaterSource] = useState('Borewell');
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = () => {
    setLoading(true);
    api.getSmartRecommendations({ soil_type: soilType, water_source: waterSource })
      .then(res => {
        setRecommendations(res.recommendations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecommendations();
  }, [soilType, waterSource]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
          <Shield className="w-8 h-8 text-emerald-700" />
          <span>Smart Farming Recommendations</span>
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Synthesizes Soil Health + Water Availability + Weather Patterns + Market Demand Index to guide optimal crop selection.
        </p>
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-xs sm:text-sm text-amber-900 font-semibold flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <span>Smart farming recommendations are advisories to support decisions, not guaranteed yield or profit.</span>
      </div>

      {/* Parameter Controls */}
      <div className="card-kisan p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-stone-700 uppercase block mb-1.5">Select Your Soil Type</label>
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            className="w-full bg-stone-100 p-3 rounded-xl font-bold text-sm text-stone-800 outline-none"
          >
            <option value="Red">Red Soil (Loamy / Sandy Loam)</option>
            <option value="Black">Black Soil (Regur / Cotton Soil)</option>
            <option value="Alluvial">Alluvial Soil (River Basin)</option>
            <option value="Clay">Clay Soil</option>
            <option value="Sandy">Sandy Soil</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 uppercase block mb-1.5">Primary Irrigation Source</label>
          <select
            value={waterSource}
            onChange={(e) => setWaterSource(e.target.value)}
            className="w-full bg-stone-100 p-3 rounded-xl font-bold text-sm text-stone-800 outline-none"
          >
            <option value="Borewell">Borewell (Moderate Water)</option>
            <option value="Canal">Canal / Reservoir (Abundant Water)</option>
            <option value="Rainfed">Rainfed / Dryland (Low Water)</option>
          </select>
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="text-center py-20 text-stone-500">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span>Synthesizing multi-factor agricultural models...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item, idx) => (
            <div
              key={item.crop_id}
              className="card-kisan p-5 flex flex-col justify-between hover:border-emerald-500 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                    Rank #{idx + 1} Candidate
                  </span>
                  <span className="text-sm font-black text-emerald-700">
                    {item.composite_score}% Score
                  </span>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={item.image_url}
                    alt={item.crop_name}
                    className="w-16 h-16 rounded-2xl object-cover border"
                  />
                  <div>
                    <h3 className="text-xl font-black text-stone-900 group-hover:text-emerald-800 transition">
                      {item.crop_name}
                    </h3>
                    <p className="text-xs text-stone-500">{item.growing_season} • {item.growing_days} Days</p>
                  </div>
                </div>

                {/* Match Metrics breakdown */}
                <div className="space-y-1.5 text-xs text-stone-600 mb-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="flex justify-between">
                    <span>Soil Compatibility:</span>
                    <span className="font-bold text-stone-900">{item.soil_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Alignment:</span>
                    <span className="font-bold text-stone-900">{item.water_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Demand Index:</span>
                    <span className="font-bold text-stone-900">{item.market_score}%</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  <span className="font-bold text-emerald-800">Why Recommend: </span>
                  {item.explanation}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">Advisory guidance</span>
                <a
                  href={`/prediction?crop_id=${item.crop_id}`}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center"
                >
                  View Market Prices <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

