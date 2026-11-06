import React, { useState, useEffect } from 'react';
import { 
  Droplets, AlertTriangle, ShieldCheck, 
  Calendar, CheckCircle2, TrendingDown, Info 
} from 'lucide-react';
import { api } from '../services/api';
import CylinderBarChart from '../components/CylinderBarChart';

export default function WaterIntelligence() {
  const [district, setDistrict] = useState('Kolar');
  const [waterData, setWaterData] = useState(null);
  const [loading, setLoading] = useState(true);

  const districts = ['Kolar', 'Bengaluru Rural', 'Nashik', 'Pune', 'Ludhiana', 'Guntur', 'Indore'];

  useEffect(() => {
    setLoading(true);
    api.getWaterIntelligence(district)
      .then(res => {
        setWaterData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [district]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
            <Droplets className="w-8 h-8 text-blue-600" />
            <span>Water Intelligence & Ground Water Records</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Groundwater depth measurements, historical rainfall patterns, and drought risk forecasting.
          </p>
        </div>

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="bg-white border border-stone-300 px-4 py-2.5 rounded-xl font-bold text-sm text-stone-800 outline-none shadow-sm"
        >
          {districts.map(d => (
            <option key={d} value={d}>{d} District</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span>Loading verified groundwater and hydro-geological records...</span>
        </div>
      ) : waterData ? (
        <div className="space-y-8">
          {/* Status Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-kisan p-5 bg-white border-blue-200">
              <div className="text-xs font-bold text-stone-500 uppercase">Current Groundwater Level</div>
              <div className="text-3xl font-black text-blue-700 mt-1">
                {waterData.current_groundwater_level_mbgl} <span className="text-sm font-normal text-stone-500">mbgl</span>
              </div>
              <div className="text-xs text-stone-500 mt-1">
                meters below ground level (Status: <span className="font-bold text-stone-800">{waterData.groundwater_status}</span>)
              </div>
            </div>

            <div className="card-kisan p-5 bg-white border-emerald-200">
              <div className="text-xs font-bold text-stone-500 uppercase">Yearly Rainfall Received</div>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {waterData.cumulative_rainfall_mm} <span className="text-sm font-normal text-stone-500">mm</span>
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Verified IMD gauge station measurement
              </div>
            </div>

            <div className="card-kisan p-5 bg-white border-amber-200">
              <div className="text-xs font-bold text-stone-500 uppercase">Data Verification Source</div>
              <div className="text-lg font-black text-stone-900 mt-1">CGWB & IMD</div>
              <div className="text-xs text-stone-500 mt-1">
                Status: <span className="font-bold text-emerald-700">{waterData.data_type}</span>
              </div>
            </div>
          </div>

          {/* Excel-Style Cylinder Column Graph comparing 2025 vs 2026 Water Levels */}
          <CylinderBarChart
            data={waterData.monthly_chart}
            xKey="month"
            bars={[
              { dataKey: 'gw_2025', name: '2025 Water Depth (mbgl)', color: '#64748b' },
              { dataKey: 'gw_2026', name: '2026 Water Depth (mbgl)', color: '#0284c7' }
            ]}
            height={360}
            unit="m "
            title={`${waterData.district} — 2-Year Monthly Groundwater Depth Comparison`}
          />

          {/* Supported Predictions for 7 Days, 3 Months, 6 Months */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-stone-900">
              Water Availability Predictions (7 Days, 3 Months, 6 Months)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {waterData.predictions.map((p, idx) => (
                <div key={idx} className="card-kisan p-5 space-y-3 border-t-4 border-blue-600 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">
                        {p.period.replace('_', ' ').toUpperCase()} Horizon
                      </span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded ${
                        p.shortage_risk === 'Low' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {p.shortage_risk} Shortage Risk
                      </span>
                    </div>

                    <div className="text-2xl font-black text-stone-900">
                      {p.predicted_water_level} mbgl
                    </div>
                    <div className="text-xs text-stone-500">
                      Expected Rainfall: <span className="font-bold">{p.predicted_rainfall_mm} mm</span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed pt-1">
                      {p.water_availability_summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <div className="text-xs font-bold text-emerald-800">
                      Recommended Low-Water Crops:
                      <div className="font-normal text-stone-700 mt-0.5">
                        {p.suitable_low_water_crops.join(', ')}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-blue-800">
                      High-Water Crops (Only with drip):
                      <div className="font-normal text-stone-700 mt-0.5">
                        {p.suitable_high_water_crops.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card-kisan p-12 text-center text-stone-500 space-y-2">
          <Info className="w-10 h-10 text-amber-500 mx-auto" />
          <p className="text-base font-bold text-stone-800">
            Not enough water-level data for a reliable prediction.
          </p>
          <p className="text-xs text-stone-400">
            Please select an adjacent district with verified CGWB telemetry stations.
          </p>
        </div>
      )}
    </div>
  );
}

