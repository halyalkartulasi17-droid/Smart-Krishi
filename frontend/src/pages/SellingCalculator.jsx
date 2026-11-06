import React, { useState, useEffect } from 'react';
import { 
  Calculator, Truck, TrendingUp, AlertTriangle, 
  Award, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { api } from '../services/api';

export default function SellingCalculator() {
  const [crops, setCrops] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState(1);
  const [quantity, setQuantity] = useState(50);
  const [ratePerKm, setRatePerKm] = useState(18);
  const [handlingFee, setHandlingFee] = useState(35);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCrops().then(setCrops).catch(() => {});
  }, []);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.calculateNetReturn({
        crop_id: selectedCropId,
        quantity_quintals: parseFloat(quantity),
        transport_rate_per_km: parseFloat(ratePerKm),
        other_expenses_per_q: parseFloat(handlingFee)
      });
      setResult(res);
    } catch (err) {
      alert("Calculation error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [selectedCropId, quantity, ratePerKm, handlingFee]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
          <Calculator className="w-8 h-8 text-teal-700" />
          <span>Selling & Transport Net Return Calculator</span>
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Gross Revenue = Quantity × Price • Net Return = Revenue − Logistics & Handling Expenses.
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-xs sm:text-sm text-amber-900 font-semibold flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <span>Calculations are estimates based on standard transport rates. Actual logistics costs may vary. Never promises profit.</span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 card-kisan p-5 bg-stone-50">
        <div>
          <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Select Crop</label>
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="w-full bg-white p-3 rounded-xl font-bold text-sm text-stone-800 border outline-none"
          >
            {crops.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Harvest Quantity (Quintals)</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-white p-2.5 rounded-xl font-bold text-sm text-stone-900 border outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Transport Rate (₹/km)</label>
          <input
            type="number"
            min="5"
            value={ratePerKm}
            onChange={(e) => setRatePerKm(e.target.value)}
            className="w-full bg-white p-2.5 rounded-xl font-bold text-sm text-stone-900 border outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Mandi Handling Fee (₹/Q)</label>
          <input
            type="number"
            min="0"
            value={handlingFee}
            onChange={(e) => setHandlingFee(e.target.value)}
            className="w-full bg-white p-2.5 rounded-xl font-bold text-sm text-stone-900 border outline-none"
          />
        </div>
      </div>

      {/* Top 3 Net Return Markets */}
      {result && result.top_3_markets && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-stone-900 flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Top 3 Most Profitable Mandis for Your Lot</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.top_3_markets.map((m) => (
              <div
                key={m.market_id}
                className={`card-kisan p-5 flex flex-col justify-between border-2 ${
                  m.rank === 1 ? 'border-amber-400 bg-gradient-to-b from-amber-50/40 to-white shadow-lg' : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      m.rank === 1 ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                    }`}>
                      #{m.rank} Best Return
                    </span>
                    <span className="text-xs text-stone-500 font-semibold">{m.distance_km} km away</span>
                  </div>

                  <h3 className="text-xl font-black text-stone-900">{m.market_name}</h3>
                  <p className="text-xs text-stone-500">{m.district}, {m.state}</p>

                  {/* Financial Breakdown */}
                  <div className="mt-4 space-y-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Mandi Rate:</span>
                      <span className="font-bold text-stone-900">₹{m.modal_price_per_q}/Q</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Gross Revenue:</span>
                      <span className="font-bold text-stone-900">₹{m.gross_revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Transport Cost:</span>
                      <span className="font-bold">− ₹{m.transport_cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Mandi Loading/Fees:</span>
                      <span className="font-bold">− ₹{m.other_expenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase block">Estimated Net Cash:</span>
                    <span className="text-2xl font-black text-emerald-800">
                      ₹{m.net_return.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Realized / Q:</span>
                    <span className="text-sm font-bold text-stone-800">₹{m.net_price_realized_per_q}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

