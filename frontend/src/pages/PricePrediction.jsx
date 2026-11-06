import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BarChart3, Calendar, TrendingUp, TrendingDown, 
  Minus, ShieldAlert, Sparkles, CheckCircle2, Info 
} from 'lucide-react';
import { api } from '../services/api';
import CylinderBarChart from '../components/CylinderBarChart';

export default function PricePrediction() {
  const [searchParams] = useSearchParams();
  const initialCropId = searchParams.get('crop_id') || 1;

  const [crops, setCrops] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState(initialCropId);
  const [period, setPeriod] = useState('3m');
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCrops().then(setCrops).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getPricePrediction(selectedCropId, period)
      .then(res => {
        setPredictionData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCropId, period]);

  const periods = [
    { key: '7d', label: '7 Days (Immediate)' },
    { key: '3m', label: '3 Months (Quarterly)' },
    { key: '6m', label: '6 Months (Season)' },
    { key: '2y', label: '2 Years (Long Term)' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Official Advisory Warning */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-amber-600" />
            <span>AI Crop Price Prediction</span>
          </h1>

          <div className="bg-amber-100 text-amber-900 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border border-amber-300">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Machine Learning Time-Series Model</span>
          </div>
        </div>

        {/* Required Mandatory Disclaimer */}
        <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-xs sm:text-sm text-amber-900 font-semibold flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Predictions are estimates, not guaranteed prices. Always verify with local APMC mandis before harvest.</span>
        </div>
      </div>

      {/* Picture-Based Crop Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
          Select Crop for Machine Learning Forecast
        </label>
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-thin">
          {crops.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCropId(c.id)}
              className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-2xl shrink-0 border transition ${
                Number(selectedCropId) === c.id
                  ? 'bg-amber-400 text-stone-950 border-amber-500 font-black shadow-md ring-2 ring-amber-400'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-amber-400 font-bold'
              }`}
            >
              <img src={c.image_url} alt={c.name} className="w-8 h-8 rounded-full object-cover border" />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prediction Period Buttons (Min 56px action touch target) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`btn-kisan text-sm transition ${
              period === p.key
                ? 'btn-kisan-primary border-emerald-800 shadow-md'
                : 'bg-white text-stone-800 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Prediction Results Display */}
      {loading ? (
        <div className="text-center py-20 text-stone-500">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="font-bold">Computing time-series regression and seasonal wave models...</span>
        </div>
      ) : predictionData && predictionData.sufficient_data ? (
        <div className="space-y-6">
          {/* Key Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Price */}
            <div className="card-kisan p-5 bg-white">
              <div className="text-xs font-bold text-stone-500 uppercase">Current Baseline Price</div>
              <div className="text-2xl font-black text-stone-900 mt-1">₹{predictionData.current_price}</div>
              <div className="text-xs text-stone-400">per Quintal (Modal)</div>
            </div>

            {/* Projected Average */}
            <div className="card-kisan p-5 bg-white border-amber-300">
              <div className="text-xs font-bold text-amber-700 uppercase">Projected Average Price</div>
              <div className="text-2xl font-black text-amber-600 mt-1">₹{predictionData.predicted_average}</div>
              <div className="text-xs text-stone-500">
                Range: ₹{predictionData.min_expected} - ₹{predictionData.max_expected}
              </div>
            </div>

            {/* Trend Direction */}
            <div className="card-kisan p-5 bg-white">
              <div className="text-xs font-bold text-stone-500 uppercase">Forecast Trend</div>
              <div className="flex items-center space-x-2 mt-1">
                {predictionData.trend === 'Rising' ? (
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                ) : predictionData.trend === 'Falling' ? (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                ) : (
                  <Minus className="w-6 h-6 text-stone-500" />
                )}
                <span className={`text-2xl font-black ${
                  predictionData.trend === 'Rising' ? 'text-emerald-700' : (predictionData.trend === 'Falling' ? 'text-red-700' : 'text-stone-700')
                }`}>
                  {predictionData.trend} ({predictionData.percentage_change > 0 ? `+${predictionData.percentage_change}%` : `${predictionData.percentage_change}%`})
                </span>
              </div>
              <div className="text-xs text-stone-400">Over {period.toUpperCase()} horizon</div>
            </div>

            {/* Model Confidence & Accuracy */}
            <div className="card-kisan p-5 bg-white">
              <div className="text-xs font-bold text-stone-500 uppercase">Model Accuracy</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">{predictionData.model_accuracy}%</div>
              <div className="text-[11px] text-stone-500">
                MAE: ±₹{predictionData.mae} • RMSE: ±₹{predictionData.rmse}
              </div>
            </div>
          </div>

          {/* Best Selling Period Callout */}
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center space-x-3 text-emerald-950">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
            <div>
              <div className="font-extrabold text-sm sm:text-base">Recommended Selling Strategy:</div>
              <div className="text-xs sm:text-sm text-emerald-800 font-medium">{predictionData.best_selling_period}</div>
            </div>
          </div>

          {/* Excel-Style Cylinder Column Graph */}
          <CylinderBarChart
            data={predictionData.chart_data}
            xKey="date"
            bars={[{ dataKey: 'price', name: 'Price (₹/Quintal)', color: '#16a34a' }]}
            height={380}
            unit="₹"
            title={`${predictionData.crop_name} — Historical & AI Projected Mandi Rates (${period.toUpperCase()})`}
          />
        </div>
      ) : (
        <div className="card-kisan p-8 text-center space-y-3">
          <Info className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">
            {predictionData?.warning || 'Insufficient historical data for this crop'}
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {predictionData?.disclaimer || 'Predictions are estimates, not guaranteed prices.'}
          </p>
        </div>
      )}
    </div>
  );
}

