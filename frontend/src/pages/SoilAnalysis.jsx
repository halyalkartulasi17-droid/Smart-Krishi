import React, { useState } from 'react';
import { 
  Sprout, Upload, CheckCircle2, AlertCircle, 
  Droplet, Thermometer, Calendar, ArrowRight, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';

export default function SoilAnalysis() {
  const [soilType, setSoilType] = useState('Red');
  const [ph, setPh] = useState(6.5);
  const [nitrogen, setNitrogen] = useState(110);
  const [phosphorus, setPhosphorus] = useState(55);
  const [potassium, setPotassium] = useState(50);
  const [moisture, setMoisture] = useState(48);
  const [waterAvail, setWaterAvail] = useState('Borewell');
  const [location, setLocation] = useState('Karnataka');

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const soilTypes = ['Black', 'Red', 'Alluvial', 'Laterite', 'Sandy', 'Clay', 'Loamy'];
  const waterSources = ['Borewell', 'Canal', 'Rainfed', 'Drip Irrigation'];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.analyzeSoil({
        soil_type: soilType,
        ph: parseFloat(ph),
        nitrogen: parseFloat(nitrogen),
        phosphorus: parseFloat(phosphorus),
        potassium: parseFloat(potassium),
        moisture: parseFloat(moisture),
        water_availability: waterAvail,
        location: location
      });
      setAnalysisResult(res);
    } catch (err) {
      alert("Failed to analyze soil. Please check values.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
          <Sprout className="w-8 h-8 text-emerald-700" />
          <span>Soil Health & Crop Recommendation</span>
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Input your soil test laboratory report parameters or select standard soil profiles to discover the top 5 most suitable crops.
        </p>
      </div>

      {/* Main Analysis Form & Visual Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 card-kisan p-6 space-y-5">
          <h2 className="font-extrabold text-stone-900 text-lg border-b pb-3">Soil Test Parameters</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Soil Type */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase block mb-1.5">
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-stone-100 p-3 rounded-xl text-sm font-bold text-stone-800 border-none focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {soilTypes.map(st => (
                  <option key={st} value={st}>{st} Soil</option>
                ))}
              </select>
            </div>

            {/* pH Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-stone-700 uppercase mb-1">
                <span>Soil pH</span>
                <span className="text-emerald-700 font-extrabold text-sm">{ph}</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>4.5 (Acidic)</span>
                <span>7.0 (Neutral)</span>
                <span>9.0 (Alkaline)</span>
              </div>
            </div>

            {/* N-P-K Inputs */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">N (kg/ha)</label>
                <input
                  type="number"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-bold text-stone-900 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">P (kg/ha)</label>
                <input
                  type="number"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-bold text-stone-900 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">K (kg/ha)</label>
                <input
                  type="number"
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-bold text-stone-900 outline-none"
                />
              </div>
            </div>

            {/* Water Source */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase block mb-1.5">
                Water Availability
              </label>
              <select
                value={waterAvail}
                onChange={(e) => setWaterAvail(e.target.value)}
                className="w-full bg-stone-100 p-3 rounded-xl text-sm font-bold text-stone-800 border-none focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {waterSources.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* Submit Action Button (56px touch target) */}
            <button
              type="submit"
              disabled={loading}
              className="btn-kisan btn-kisan-primary w-full mt-2"
            >
              {loading ? 'Analyzing Soil...' : 'Run Soil Analysis'}
            </button>
          </form>
        </div>

        {/* Right 2 Columns: Top 5 Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {analysisResult ? (
            <div className="space-y-6">
              {/* Health Score Summary Banner */}
              <div className="card-kisan p-5 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-200 font-bold uppercase">Soil Profile Identified</div>
                  <h3 className="text-2xl font-black">
                    {analysisResult.soil_analysis.soil_type} Soil • {analysisResult.soil_analysis.ph_status} (pH {analysisResult.soil_analysis.ph})
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1">
                    NPK Ratio: {analysisResult.soil_analysis.nitrogen}:{analysisResult.soil_analysis.phosphorus}:{analysisResult.soil_analysis.potassium} kg/ha
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex flex-col items-center justify-center font-black">
                  <span className="text-lg">Top 5</span>
                  <span className="text-[9px] uppercase">Crops</span>
                </div>
              </div>

              {/* Recommendations Cards */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-stone-900 text-lg">Top 5 Recommended Crops</h3>

                {analysisResult.top_recommendations.map((rec) => (
                  <div
                    key={rec.crop_id}
                    className="card-kisan p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-emerald-500 transition"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={rec.image_url}
                        alt={rec.crop_name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-600"
                      />
                      <span className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center shadow-md">
                        #{rec.rank}
                      </span>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-extrabold text-stone-900">{rec.crop_name}</h4>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full">
                          {rec.suitability_score}% Match
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-600 pt-1">
                        <div>Season: <span className="font-bold text-stone-800">{rec.growing_season}</span></div>
                        <div>Duration: <span className="font-bold text-stone-800">{rec.growing_duration}</span></div>
                        <div>Water: <span className="font-bold text-stone-800">{rec.water_requirement}</span></div>
                      </div>

                      <p className="text-xs text-stone-600 pt-1 leading-relaxed">
                        <span className="font-bold text-emerald-800">Why Suitable: </span>
                        {rec.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Agronomic Health Tips */}
              <div className="card-kisan p-5 bg-stone-50 border-emerald-200">
                <h4 className="font-extrabold text-stone-800 text-sm mb-2 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Agronomic Soil Care Advisory</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                  {analysisResult.soil_health_tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card-kisan p-12 text-center space-y-4">
              <Sprout className="w-14 h-14 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold text-stone-900">Discover What Grows Best in Your Field</h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                Adjust the soil type and NPK levels on the left and tap "Run Soil Analysis" to view algorithmic recommendations.
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-kisan btn-kisan-primary"
              >
                Run Quick Demo Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

