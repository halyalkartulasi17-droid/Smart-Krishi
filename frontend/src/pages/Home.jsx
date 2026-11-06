import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, Sprout, Droplets, ShoppingBag, 
  Store, ShieldCheck, ArrowRight, CheckCircle2, 
  Sparkles, Bot, Phone, MapPin, Calculator, BarChart2 
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { t } = useTranslation();
  const { easyMode, speakText } = useApp();
  const [previewPrices, setPreviewPrices] = useState([]);

  useEffect(() => {
    api.getTodayPrices('sort=modal_desc')
      .then(res => {
        if (res.prices) setPreviewPrices(res.prices.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ca8a04_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 border border-amber-300/40 text-amber-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI-Powered Indian Agricultural Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Smart <span className="text-amber-400">KRISHI</span>
          </h1>

          <p className="text-xl sm:text-2xl text-emerald-100 font-semibold max-w-2xl mx-auto">
            Smart Farming. Better Prices. Higher Opportunities.
          </p>

          <p className="text-sm sm:text-base text-emerald-200/90 max-w-xl mx-auto">
            Empowering Indian farmers with live Agmarknet prices, AI price forecasting, soil analysis, water intelligence, and a zero-commission marketplace.
          </p>

          {/* Large Action Buttons (Min 56px touch target for farmers) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="btn-kisan btn-kisan-gold w-full sm:w-auto text-stone-950 px-8 space-x-2 text-lg shadow-lg hover:scale-105 transition"
            >
              <span>{t('get_started')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/buy"
              className="btn-kisan w-full sm:w-auto px-8 space-x-2 text-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-black shadow-lg hover:scale-105 transition flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Buy Crops (Procurement)</span>
            </Link>

            <Link
              to="/sell"
              className="btn-kisan btn-kisan-primary w-full sm:w-auto px-8 space-x-2 text-lg bg-emerald-800 hover:bg-emerald-700 shadow-lg hover:scale-105 transition flex items-center justify-center"
            >
              <Store className="w-5 h-5 text-amber-300" />
              <span>Sell Crops (Camera Upload)</span>
            </Link>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-emerald-800/80">
            <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800">
              <div className="text-2xl font-black text-amber-400">23</div>
              <div className="text-xs text-emerald-200">Indian Languages</div>
            </div>
            <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800">
              <div className="text-2xl font-black text-emerald-300">100%</div>
              <div className="text-xs text-emerald-200">Verified Agmarknet</div>
            </div>
            <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800">
              <div className="text-2xl font-black text-amber-400">₹0</div>
              <div className="text-xs text-emerald-200">Farmer Commission</div>
            </div>
            <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800">
              <div className="text-2xl font-black text-emerald-300">7-Day to 2-Yr</div>
              <div className="text-xs text-emerald-200">AI Price Predictions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Mandi Prices Preview Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-emerald-700" />
              <span>{t('today_prices')}</span>
            </h2>
            <p className="text-xs text-stone-500">Live prices from key APMC mandis (Agmarknet feed)</p>
          </div>
          <Link
            to="/prices"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{t('view_all')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewPrices.map((item) => (
            <div
              key={item.id}
              className="card-kisan p-5 flex flex-col justify-between hover:border-emerald-500 transition"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span>{item.district}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">{item.crop_name}</h3>
                <p className="text-xs text-stone-500">{item.market_name}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-emerald-800">₹{item.modal_price}</span>
                  <span className="text-xs text-stone-500 ml-1">/Quintal</span>
                </div>
                <Link
                  to={`/prediction?crop_id=${item.crop_id}`}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                >
                  Forecast
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-stone-900">Everything a Farmer Needs to Succeed</h2>
          <p className="text-sm text-stone-600 mt-2">
            Built from the ground up for Indian farmers with picture-based crops, clear Malayalam, Kannada, Hindi, and 20 other languages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Soil Analysis */}
          <div className="card-kisan p-6 space-y-4 border-t-4 border-emerald-600">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sprout className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Soil Analysis & Recommendations</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Analyze Black, Red, Alluvial, Laterite, and Sandy soils. Get the top 5 most profitable crops tailored to your soil NPK and pH levels.
            </p>
            <Link to="/soil" className="inline-flex items-center text-sm font-bold text-emerald-700 hover:text-emerald-800">
              Test Soil Suitability <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 2: Price Forecasting */}
          <div className="card-kisan p-6 space-y-4 border-t-4 border-amber-500">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <BarChart2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">AI Price Forecasting (7d to 2yr)</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Machine learning models analyze historical prices and seasonal cycles to pinpoint the best selling window and price trends.
            </p>
            <Link to="/prediction" className="inline-flex items-center text-sm font-bold text-amber-700 hover:text-amber-800">
              View Price Trends <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 3: Water Intelligence */}
          <div className="card-kisan p-6 space-y-4 border-t-4 border-blue-500">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Droplets className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Water Intelligence & Drought Risk</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              2-year groundwater records, rainfall tracking, and drought risk alerts. Identifies suitable low-water crops for water-stressed regions.
            </p>
            <Link to="/water" className="inline-flex items-center text-sm font-bold text-blue-700 hover:text-blue-800">
              Check Water Table <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 4: Buy & Sell */}
          <div className="card-kisan p-6 space-y-4 border-t-4 border-purple-500">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Direct Buy & Sell Marketplace</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Sell your harvest directly to verified agricultural buyers. Upload crop details, receive direct purchase enquiries, and maximize revenue.
            </p>
            <Link to="/sell" className="inline-flex items-center text-sm font-bold text-purple-700 hover:text-purple-800">
              List Your Produce <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 5: Selling Calculator */}
          <div className="card-kisan p-6 space-y-4 border-t-4 border-teal-500">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Calculator className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Selling & Transport Calculator</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Gross Revenue − Transport Cost − Mandi Charges. Compares mandis within 150 km to find the highest net cash in your pocket.
            </p>
            <Link to="/calculator" className="inline-flex items-center text-sm font-bold text-teal-700 hover:text-teal-800">
              Calculate Profit <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 6: Kisan Mitra Chatbot */}
          <div className="card-kisan p-6 space-y-4 border-t-4 border-amber-600">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Multilingual Kisan Mitra</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Floating AI companion available in 23 Indian languages. Ask by voice or text about crop diseases, pest remedies, and mandi prices.
            </p>
            <button
              onClick={() => speakText("Kisan Mitra is here to help you in 23 languages.")}
              className="inline-flex items-center text-sm font-bold text-amber-700 hover:text-amber-800"
            >
              Ask Kisan Mitra <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works & Farmer Benefits */}
      <section className="bg-emerald-950 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto shadow-xl">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl font-black">How Smart KRISHI Works for You</h2>
          <p className="text-emerald-200 text-sm">
            Three simple steps to transform your agricultural decisions and income.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-emerald-900/60 p-6 rounded-2xl border border-emerald-800 space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="font-bold text-lg text-white">Select Crop or Soil</h3>
            <p className="text-sm text-emerald-200">
              Pick your crop with clear pictures or input your soil type to get scientific, climate-ready guidance.
            </p>
          </div>

          <div className="bg-emerald-900/60 p-6 rounded-2xl border border-emerald-800 space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="font-bold text-lg text-white">Compare Mandi Prices</h3>
            <p className="text-sm text-emerald-200">
              Check live rates across APMC mandis and preview AI price forecast trends before deciding when to harvest.
            </p>
          </div>

          <div className="bg-emerald-900/60 p-6 rounded-2xl border border-emerald-800 space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="font-bold text-lg text-white">Sell at the Best Price</h3>
            <p className="text-sm text-emerald-200">
              Use the Net Return Calculator to select the most profitable market or list directly for verified bulk buyers.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/dashboard"
            className="btn-kisan btn-kisan-gold text-stone-950 px-10 text-lg shadow-xl"
          >
            Open Farmer Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}

