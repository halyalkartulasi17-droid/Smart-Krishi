import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Menu, X, Volume2, VolumeX, Sparkles, Bell, Globe, 
  Home, TrendingUp, Sprout, Droplets, ShoppingBag, 
  Store, CloudSun, MapPin, Calculator, BarChart3, UserCheck, Shield,
  LogIn, UserPlus, User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../i18n/i18n';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, easyMode, toggleEasyMode, language, changeAppLanguage, notificationsCount, speakText, stopSpeaking, isSpeaking } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/dashboard', label: t('nav.dashboard'), icon: Sparkles },
    { to: '/prices', label: t('nav.crop_prices'), icon: TrendingUp },
    { to: '/prediction', label: t('nav.price_prediction'), icon: BarChart3 },
    { to: '/soil', label: t('nav.soil_analysis'), icon: Sprout },
    { to: '/recommendations', label: t('nav.crop_recommendations'), icon: Shield },
    { to: '/water', label: t('nav.water_intelligence'), icon: Droplets },
    { to: '/demand', label: t('nav.crop_demand'), icon: BarChart3 },
    { to: '/buy', label: t('nav.buy_crops'), icon: ShoppingBag },
    { to: '/sell', label: t('nav.sell_crops'), icon: Store },
    { to: '/markets', label: t('nav.nearby_markets'), icon: MapPin },
    { to: '/calculator', label: t('nav.selling_calculator'), icon: Calculator },
    { to: '/weather', label: t('nav.weather'), icon: CloudSun },
    { to: '/notifications', label: t('nav.notifications'), icon: Bell, badge: notificationsCount },
    { to: '/profile', label: t('nav.profile'), icon: UserCheck }
  ];

  const handleVoiceGuidance = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(`Welcome to Smart KRISHI. Current page is ${location.pathname.replace('/', '') || 'Home'}. Choose any crop or feature using the large buttons.`);
    }
  };

  const openAuth = (mode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-lg border-b border-emerald-800">
      {/* Top Utility Bar */}
      <div className="bg-emerald-950/80 px-4 py-1.5 text-xs flex justify-between items-center border-b border-emerald-900 text-emerald-200">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-1.5"></span>
            Govt. Kisan Helpline: 1800-180-1551
          </span>
          <span className="hidden sm:inline text-emerald-400/60">|</span>
          <span className="hidden sm:inline">Agmarknet Live Mandi Updates</span>
        </div>

        {/* Easy Mode Toggle, Language, & Auth Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={handleVoiceGuidance}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
              isSpeaking ? 'bg-amber-500 text-stone-900 animate-pulse' : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
            }`}
            title="Voice instructions for this page"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{isSpeaking ? t('stop') : t('listen')}</span>
          </button>

          {/* Easy Mode Pill */}
          <button
            onClick={toggleEasyMode}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
              easyMode ? 'bg-amber-400 text-stone-950 shadow-sm' : 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${easyMode ? 'bg-emerald-800' : 'bg-stone-400'}`}></span>
            <span>{t('easy_mode')} {easyMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-medium"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span className="uppercase">{language}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-stone-900 text-stone-100 rounded-xl shadow-2xl border border-emerald-700 p-2 z-50">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider px-2 py-1 mb-1 border-b border-stone-800">
                  Select Language (23 Languages)
                </div>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      changeAppLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition ${
                      language === l.code ? 'bg-emerald-700 text-white font-bold' : 'hover:bg-stone-800 text-stone-200'
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-[10px] text-stone-400">{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-950 to-emerald-800 p-1 border-2 border-amber-400 shadow-md group-hover:scale-105 transition">
              <img src="/logo.svg" alt="Smart KRISHI Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-white">Smart</span>
                <span className="text-2xl font-black tracking-tight text-amber-400">KRISHI</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-400/30">AI</span>
              </div>
              <p className="text-[11px] text-emerald-200 font-medium hidden sm:block">
                Smart Farming. Better Prices. Higher Opportunities.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.slice(0, 8).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive ? 'bg-emerald-800 text-amber-300 shadow-inner' : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-300'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Action Badges & Prominent Login / Register */}
          <div className="flex items-center space-x-2">
            {/* Direct Login / Register Buttons */}
            <div className="hidden lg:flex items-center space-x-1.5 mr-1 bg-emerald-950/60 p-1 rounded-2xl border border-emerald-800">
              <button
                onClick={() => openAuth('login')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-100 hover:bg-emerald-800 hover:text-white transition"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>Login</span>
              </button>
              <button
                onClick={() => openAuth('register')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-stone-950 transition shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5 text-stone-950" />
                <span>Register</span>
              </button>
            </div>

            <Link
              to="/sell"
              className="hidden sm:inline-flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 px-3.5 py-2 rounded-xl font-bold text-xs border border-emerald-700 shadow-sm transition"
            >
              <Store className="w-4 h-4" />
              <span>{t('nav.sell_crops')}</span>
            </Link>

            <Link
              to="/notifications"
              className="relative p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-amber-300" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                  {notificationsCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-emerald-950 border-t border-emerald-800 px-4 pt-3 pb-6 space-y-3 max-h-[80vh] overflow-y-auto">
          {/* Mobile Login / Register Row */}
          <div className="grid grid-cols-2 gap-2 bg-emerald-900/80 p-2 rounded-2xl border border-emerald-800">
            <button
              onClick={() => openAuth('login')}
              className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-black bg-emerald-800 text-white border border-emerald-700"
            >
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>Login</span>
            </button>
            <button
              onClick={() => openAuth('register')}
              className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-black bg-amber-400 text-stone-950 shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>

          <div className="text-xs font-bold text-amber-300 uppercase px-3 py-1">
            Complete Smart KRISHI Navigation
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl text-sm font-semibold transition ${
                    isActive ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-stone-950' : 'text-amber-300'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
}
