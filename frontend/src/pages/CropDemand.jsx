import React, { useState, useEffect } from 'react';
import { 
  BarChart2, TrendingUp, TrendingDown, 
  ArrowUpRight, ArrowDownRight, Sparkles, Filter 
} from 'lucide-react';
import { api } from '../services/api';
import CylinderBarChart from '../components/CylinderBarChart';

export default function CropDemand() {
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProductionDemand()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredItems = data?.comparison?.filter(item => 
    !selectedCategory || item.category === selectedCategory
  ) || [];

  // Chart data for Excel-style Cylinder Bar Chart (2025 vs 2026 Production)
  const chartData = filteredItems.slice(0, 8).map(item => ({
    name: item.crop_name,
    prod_2025: item.production_2025,
    prod_2026: item.production_2026,
    demand: item.demand_index
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
            <BarChart2 className="w-8 h-8 text-emerald-700" />
            <span>Crop Production & Market Demand Analysis</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Official comparative analysis between Previous Year (2025) and Current Year (2026) harvests.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3 py-1.5 rounded-xl font-medium">
          Source: {data?.source || 'Ministry of Agriculture & Farmers Welfare'}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span>Loading agricultural production data...</span>
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-kisan p-5 bg-white border-emerald-200">
              <div className="text-xs font-bold text-stone-500 uppercase">Highest Production Crop</div>
              <div className="text-xl font-black text-emerald-800 mt-1">
                {data.summary.highest_production?.crop_name}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                {data.summary.highest_production?.production_2026.toLocaleString()} Tonnes (2026)
              </div>
            </div>

            <div className="card-kisan p-5 bg-white border-amber-200">
              <div className="text-xs font-bold text-stone-500 uppercase">High Demand Crops Count</div>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {data.summary.high_demand_count} Crops
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Strong domestic & export consumer pull
              </div>
            </div>

            <div className="card-kisan p-5 bg-white">
              <div className="text-xs font-bold text-stone-500 uppercase">Baseline Year Compared</div>
              <div className="text-2xl font-black text-stone-900 mt-1">
                {data.years_compared.previous_year} vs {data.years_compared.current_year}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Annual kharif + rabi state aggregations
              </div>
            </div>

            <div className="card-kisan p-5 bg-white">
              <div className="text-xs font-bold text-stone-500 uppercase">Total Crops Tracked</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {data.summary.total_analyzed_crops} Crops
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Verified state directorate statistics
              </div>
            </div>
          </div>

          {/* Excel-Style Cylinder Column Graph */}
          <CylinderBarChart
            data={chartData}
            xKey="name"
            bars={[
              { dataKey: 'prod_2025', name: '2025 Production (Tonnes)', color: '#94a3b8' },
              { dataKey: 'prod_2026', name: '2026 Production (Tonnes)', color: '#16a34a' }
            ]}
            height={380}
            unit="T "
            title="Previous Year (2025) vs Current Year (2026) Total Production Comparison"
          />

          {/* Filter Pills */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-stone-500 uppercase">Filter by Category:</span>
            {['', 'Vegetable', 'Grain', 'Commercial', 'Pulse', 'Fruit'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-bold transition ${
                  selectedCategory === cat ? 'bg-emerald-800 text-white shadow-sm' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {cat || 'All Crops'}
              </button>
            ))}
          </div>

          {/* Detailed Production & Demand Comparison Table */}
          <div className="card-kisan overflow-hidden">
            <div className="p-4 bg-stone-50 border-b border-stone-200 font-extrabold text-sm text-stone-800">
              Crop Production, Demand Index, and Growth Breakdown
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-700">
                <thead className="bg-stone-100 text-stone-600 text-xs uppercase font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Crop</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">2025 Prod (T)</th>
                    <th className="py-3 px-4">2026 Prod (T)</th>
                    <th className="py-3 px-4">YoY Change</th>
                    <th className="py-3 px-4">Demand Index</th>
                    <th className="py-3 px-4">Market Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredItems.map(item => (
                    <tr key={item.crop_id} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4 font-bold text-stone-900 flex items-center space-x-2">
                        <img src={item.image_url} alt={item.crop_name} className="w-7 h-7 rounded-full object-cover border" />
                        <span>{item.crop_name}</span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-stone-500">{item.category}</td>
                      <td className="py-3 px-4">{item.production_2025.toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-stone-900">{item.production_2026.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded ${
                          item.production_change_pct >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.production_change_pct >= 0 ? '+' : ''}{item.production_change_pct}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{item.demand_index}</span>
                          <div className="w-16 bg-stone-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${item.demand_index}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-black px-2 py-0.5 rounded ${
                          item.demand_trend === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {item.demand_trend} Demand
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

