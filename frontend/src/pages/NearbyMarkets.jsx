import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, TrendingUp, Phone, 
  ExternalLink, Building2, Search 
} from 'lucide-react';
import { api } from '../services/api';

export default function NearbyMarkets() {
  const [markets, setMarkets] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMarkets()
      .then(res => {
        setMarkets(res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = markets.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.district.toLowerCase().includes(search.toLowerCase()) ||
    m.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-emerald-700" />
            <span>Nearby APMC Mandis</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Locate registered agricultural produce market committee yards and terminal mandis across India.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search mandi or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-stone-300 pl-9 pr-4 py-2.5 rounded-xl text-sm font-semibold outline-none shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span>Loading APMC market network...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(m => (
            <div key={m.id} className="card-kisan p-5 flex flex-col justify-between hover:border-emerald-500 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {m.market_type}
                  </span>
                  <span className="text-xs text-stone-400 font-semibold">{m.state}</span>
                </div>

                <h3 className="text-xl font-extrabold text-stone-900">{m.name}</h3>
                <p className="text-xs text-stone-500 mt-1">District: <strong className="text-stone-800">{m.district}</strong></p>

                <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
                  <div>Coordinates: {m.latitude.toFixed(4)}° N, {m.longitude.toFixed(4)}° E</div>
                  <div>Trading Timings: 04:00 AM – 02:00 PM (Auction & Direct Sales)</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={`https://maps.google.com/?q=${m.latitude},${m.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1" />
                  <span>Get Driving Directions</span>
                </a>

                <a
                  href={`/prices?state=${m.state}&district=${m.district}`}
                  className="text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 px-3 py-1.5 rounded-lg"
                >
                  View Rates
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

