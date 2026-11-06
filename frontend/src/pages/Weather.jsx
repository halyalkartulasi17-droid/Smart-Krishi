import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Droplets, Wind, Thermometer, 
  MapPin, ShieldCheck, Calendar, Sun, CloudRain 
} from 'lucide-react';
import { api } from '../services/api';

export default function Weather() {
  const [district, setDistrict] = useState('Kolar');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const districts = ['Kolar', 'Bengaluru', 'Nashik', 'Pune', 'Ludhiana', 'Guntur', 'Indore', 'Agra'];

  useEffect(() => {
    setLoading(true);
    api.getWeather(district)
      .then(res => {
        setWeather(res);
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
            <CloudSun className="w-8 h-8 text-amber-500" />
            <span>Agricultural Weather Advisory</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Real-time meteorological indicators, rainfall probability, and 7-day agricultural forecasts.
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
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span>Connecting to Open-Meteo satellite weather radar...</span>
        </div>
      ) : weather ? (
        <div className="space-y-8">
          {/* Main Today Weather Card */}
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-800 px-3 py-1 rounded-full text-xs text-amber-300 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{weather.district}, {weather.state}</span>
              </div>
              <div className="text-5xl sm:text-7xl font-black">{weather.temperature}°C</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-100">{weather.condition}</div>
              <p className="text-xs text-emerald-300">Data Feed: {weather.source}</p>
            </div>

            {/* Weather Gauges Grid */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/60 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-200">
                  <Droplets className="w-4 h-4 text-blue-300" />
                  <span>Humidity</span>
                </div>
                <div className="text-2xl font-black text-white">{weather.humidity}%</div>
              </div>

              <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/60 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-200">
                  <Wind className="w-4 h-4 text-emerald-300" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-2xl font-black text-white">{weather.wind_speed} km/h</div>
              </div>

              <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/60 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-200">
                  <CloudRain className="w-4 h-4 text-blue-400" />
                  <span>Rainfall (Today)</span>
                </div>
                <div className="text-2xl font-black text-white">{weather.rainfall_mm} mm</div>
              </div>

              <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/60 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-200">
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span>UV Index</span>
                </div>
                <div className="text-2xl font-black text-white">Moderate (5)</div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-stone-900 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-emerald-700" />
              <span>7-Day Agricultural Weather Forecast</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((f, i) => (
                <div key={i} className="card-kisan p-4 text-center space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-500 uppercase">{f.day}</div>
                    <div className="text-[11px] text-stone-400">{f.date}</div>
                  </div>

                  <div className="py-2">
                    <CloudSun className="w-8 h-8 text-amber-500 mx-auto" />
                    <div className="text-xs font-bold text-stone-800 mt-1">{f.condition}</div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-stone-100">
                    <div className="text-sm font-black text-stone-900">{f.max_temp}°C</div>
                    <div className="text-xs text-stone-400">Min: {f.min_temp}°C</div>
                    <div className="text-[10px] text-blue-600 font-bold">Rain: {f.rain_prob}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

