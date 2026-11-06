import React, { useState } from 'react';
import { 
  UserPlus, LogIn, X, CheckCircle2, ShieldCheck, 
  MapPin, Phone, Lock, User, Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function AuthModal({ isOpen, initialMode = 'login', onClose }) {
  const { setUser, language, easyMode } = useApp();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  
  // Login fields
  const [loginMobile, setLoginMobile] = useState('9876543210');
  const [loginPassword, setLoginPassword] = useState('1234');
  
  // Register fields
  const [regRole, setRegRole] = useState('farmer'); // 'farmer' or 'buyer'
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('1234');
  const [regCompany, setRegCompany] = useState('');
  const [regVillage, setRegVillage] = useState('Srinivaspur');
  const [regDistrict, setRegDistrict] = useState('Kolar');
  const [regState, setRegState] = useState('Karnataka');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await api.login(loginMobile, loginPassword);
      if (res.token) {
        localStorage.setItem('smart_krishi_token', res.token);
      }
      if (res.farmer) {
        setUser({ ...res.farmer, role: 'farmer' });
      }
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed. Please verify your mobile and PIN.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!regName.trim() || !regMobile.trim()) {
      setError('Please provide your name and 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.register({
        name: regName.trim(),
        mobile: regMobile.trim(),
        password: regPassword,
        role: regRole,
        company_name: regCompany,
        district: regDistrict,
        village: regVillage,
        state: regState,
        preferred_language: language,
        easy_mode: easyMode
      });
      if (res.token) {
        localStorage.setItem('smart_krishi_token', res.token);
      }
      if (res.farmer) {
        setUser({ ...res.farmer, role: regRole });
      }
      setSuccess(`Registration successful as ${regRole === 'farmer' ? 'Farmer' : 'Buyer'}!`);
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Mobile may already be registered.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative border-2 border-emerald-600 animate-in fade-in my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div>
          <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SmartAI Kisan Secure Portal</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900">
            {mode === 'login' ? 'Sign In to Your Account' : 'Register New Account'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {mode === 'login'
              ? 'Enter your mobile and password or use demo credentials.'
              : 'Join as a farmer to sell harvest or as a buyer to source bulk agricultural produce.'}
          </p>

          <div className="flex border-b border-stone-200 mt-4">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 pb-3 text-sm font-black border-b-2 transition flex items-center justify-center space-x-2 ${
                mode === 'login' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`flex-1 pb-3 text-sm font-black border-b-2 transition flex items-center justify-center space-x-2 ${
                mode === 'register' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register (Farmer / Buyer)</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-xl text-xs font-bold border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Registered Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={loginMobile}
                  onChange={(e) => setLoginMobile(e.target.value)}
                  className="w-full bg-stone-100 pl-9 pr-3 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">PIN / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="PIN / Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-stone-100 pl-9 pr-3 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
              ✨ <strong>Quick Demo Access:</strong> Mobile: <code>9876543210</code> &bull; PIN: <code>1234</code>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-stone-600 font-bold text-sm rounded-xl hover:bg-stone-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-kisan btn-kisan-primary text-sm py-3"
              >
                {loading ? 'Logging in...' : 'Sign In Now'}
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Role Selection */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">I am registering as:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('farmer')}
                  className={`py-3 px-3 rounded-2xl font-black text-xs transition border flex flex-col items-center justify-center space-y-1 ${
                    regRole === 'farmer'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500'
                      : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  <span className="text-base">🌾</span>
                  <span>Farmer / Producer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('buyer')}
                  className={`py-3 px-3 rounded-2xl font-black text-xs transition border flex flex-col items-center justify-center space-y-1 ${
                    regRole === 'buyer'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400'
                      : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  <span className="text-base">🏢</span>
                  <span>Wholesale Buyer</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {regRole === 'farmer' ? 'Farmer Full Name' : 'Authorized Representative Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-stone-100 pl-9 pr-3 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {regRole === 'buyer' && (
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Company / Mandi Agency Name</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Kisan Fresh Food Logistics Pvt Ltd"
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    className="w-full bg-stone-100 pl-9 pr-3 py-3 rounded-xl font-medium text-sm outline-none"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    className="w-full bg-stone-100 pl-9 pr-3 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">PIN / Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="e.g. 1234"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-stone-100 pl-9 pr-3 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Village/Town</label>
                <input
                  type="text"
                  value={regVillage}
                  onChange={(e) => setRegVillage(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl font-medium text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">District</label>
                <input
                  type="text"
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl font-medium text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">State</label>
                <input
                  type="text"
                  value={regState}
                  onChange={(e) => setRegState(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl font-medium text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-stone-600 font-bold text-sm rounded-xl hover:bg-stone-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-kisan btn-kisan-gold text-stone-950 font-black text-sm py-3"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

