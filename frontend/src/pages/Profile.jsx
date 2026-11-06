import React, { useState } from 'react';
import { 
  User, Phone, Mail, MapPin, Globe, 
  Sparkles, CheckCircle2, Lock, LogOut, ShieldCheck,
  UserPlus, LogIn, ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { LANGUAGES } from '../i18n/i18n';

export default function Profile() {
  const { user, setUser, easyMode, toggleEasyMode, language, changeAppLanguage } = useApp();
  
  // Profile edit state
  const [name, setName] = useState(user?.name || 'Ramesh Gowda');
  const [mobile, setMobile] = useState(user?.mobile || '9876543210');
  const [email, setEmail] = useState(user?.email || 'ramesh.farmer@smartkrishi.in');
  const [village, setVillage] = useState(user?.village || 'Srinivaspur');
  const [district, setDistrict] = useState(user?.district || 'Kolar');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [saved, setSaved] = useState(false);

  // Auth Modal State: 'login' or 'register'
  const [authModal, setAuthModal] = useState(null); // null, 'login', 'register'
  
  // Login Form
  const [loginMobile, setLoginMobile] = useState('9876543210');
  const [loginPassword, setLoginPassword] = useState('1234');
  
  // Register Form
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('1234');
  const [regRole, setRegRole] = useState('farmer'); // 'farmer' or 'buyer'
  const [regDistrict, setRegDistrict] = useState('Kolar');
  const [regVillage, setRegVillage] = useState('Srinivaspur');
  const [regState, setRegState] = useState('Karnataka');
  
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateProfile({
        name,
        email,
        village,
        district,
        state,
        preferred_language: language,
        easy_mode: easyMode
      });
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await api.login(loginMobile, loginPassword);
      localStorage.setItem('smart_krishi_token', res.token);
      if (res.farmer) {
        setUser(res.farmer);
        setName(res.farmer.name);
        setMobile(res.farmer.mobile);
        setVillage(res.farmer.village || 'Srinivaspur');
        setDistrict(res.farmer.district || 'Kolar');
        setState(res.farmer.state || 'Karnataka');
      }
      setAuthSuccess('Logged in successfully!');
      setTimeout(() => {
        setAuthModal(null);
        setAuthSuccess('');
      }, 1000);
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check mobile and password.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!regName || !regMobile) {
      setAuthError('Please provide your name and mobile number.');
      return;
    }
    try {
      const res = await api.register({
        name: regName,
        mobile: regMobile,
        password: regPassword,
        district: regDistrict,
        village: regVillage,
        state: regState,
        preferred_language: language,
        easy_mode: easyMode
      });
      localStorage.setItem('smart_krishi_token', res.token);
      if (res.farmer) {
        setUser(res.farmer);
        setName(res.farmer.name);
        setMobile(res.farmer.mobile);
        setVillage(res.farmer.village);
        setDistrict(res.farmer.district);
        setState(res.farmer.state);
      }
      setAuthSuccess('Registration successful! Welcome to Smart KRISHI.');
      setTimeout(() => {
        setAuthModal(null);
        setAuthSuccess('');
      }, 1200);
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smart_krishi_token');
    alert("Logged out. You can sign in anytime or use default credentials.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Auth Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
            <User className="w-8 h-8 text-emerald-700" />
            <span>Profile & Account</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage your credentials, farm locations, communication language, and accessibility preferences.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => { setAuthModal('login'); setAuthError(''); setAuthSuccess(''); }}
            className="btn-kisan bg-emerald-800 text-white hover:bg-emerald-700 text-xs px-4 py-2 flex items-center space-x-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          <button
            onClick={() => { setAuthModal('register'); setAuthError(''); setAuthSuccess(''); }}
            className="btn-kisan btn-kisan-primary text-xs px-4 py-2 flex items-center space-x-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl font-bold text-sm flex items-center space-x-2 border border-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Current Active Account Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center font-black text-2xl shadow-inner">
            {user?.name ? user.name[0] : 'K'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black">{user?.name || 'Ramesh Gowda'}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-200 text-xs font-bold border border-emerald-600">
                Active Farmer
              </span>
            </div>
            <p className="text-emerald-200 text-sm mt-0.5">
              📱 {user?.mobile || '9876543210'} &bull; 📍 {user?.village || 'Srinivaspur'}, {user?.district || 'Kolar'}, {user?.state || 'Karnataka'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAuthModal('login')}
            className="bg-emerald-700/80 hover:bg-emerald-700 text-emerald-100 px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            Switch Account
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      <div className="card-kisan p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-stone-900 border-b pb-2 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Farmer & Trader Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-100 p-3 rounded-xl font-bold text-sm text-stone-900 outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Mobile Number (Mandi linked)</label>
                <input
                  type="tel"
                  disabled
                  value={mobile}
                  className="w-full bg-stone-200 p-3 rounded-xl font-bold text-sm text-stone-600 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-100 p-3 rounded-xl font-medium text-sm text-stone-900 outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Preferred Language (23 Languages)</label>
                <select
                  value={language}
                  onChange={(e) => changeAppLanguage(e.target.value)}
                  className="w-full bg-stone-100 p-3 rounded-xl font-bold text-sm text-stone-900 outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.native} ({l.name})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h2 className="text-lg font-black text-stone-900 border-b pb-2 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <span>Farm / Business Location</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Village / Taluk</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-stone-100 p-3 rounded-xl font-medium text-sm text-stone-900 outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-stone-100 p-3 rounded-xl font-medium text-sm text-stone-900 outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-stone-100 p-3 rounded-xl font-medium text-sm text-stone-900 outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h2 className="text-lg font-black text-stone-900 border-b pb-2 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Accessibility Preferences</span>
            </h2>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-stone-900 text-sm">Easy Mode (Large Text & Pictures)</h4>
                <p className="text-xs text-stone-500">
                  Enlarges buttons, highlights voice instructions, and streamlines agricultural forms for easy touch.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleEasyMode}
                className={`w-14 h-8 rounded-full p-1 transition ${
                  easyMode ? 'bg-emerald-700' : 'bg-stone-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition ${
                  easyMode ? 'translate-x-6' : 'translate-x-0'
                }`}></div>
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="btn-kisan btn-kisan-primary px-8 text-base"
            >
              Save Profile Settings
            </button>
          </div>
        </form>
      </div>

      {/* LOGIN MODAL */}
      {authModal === 'login' && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative border-2 border-emerald-600">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-black text-stone-900 flex items-center space-x-2">
                <LogIn className="w-6 h-6 text-emerald-700" />
                <span>Farmer / Buyer Login</span>
              </h3>
              <button
                onClick={() => setAuthModal(null)}
                className="text-stone-400 hover:text-stone-600 font-black text-xl"
              >
                &times;
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-red-100 text-red-800 rounded-xl text-xs font-bold border border-red-200">
                {authError}
              </div>
            )}
            {authSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Registered Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={loginMobile}
                  onChange={(e) => setLoginMobile(e.target.value)}
                  className="w-full bg-stone-100 p-3.5 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">PIN / Password</label>
                <input
                  type="password"
                  required
                  placeholder="PIN or Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-stone-100 p-3.5 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                ✨ Quick Demo: Mobile <strong>9876543210</strong>, PIN <strong>1234</strong>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModal('register')}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  Don't have an account? Register here
                </button>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModal(null)}
                  className="flex-1 py-3 text-stone-600 font-bold text-sm rounded-xl hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-kisan btn-kisan-primary text-sm py-3"
                >
                  Login Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {authModal === 'register' && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border-2 border-amber-500 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-black text-stone-900 flex items-center space-x-2">
                <UserPlus className="w-6 h-6 text-amber-600" />
                <span>Register New Account</span>
              </h3>
              <button
                onClick={() => setAuthModal(null)}
                className="text-stone-400 hover:text-stone-600 font-black text-xl"
              >
                &times;
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-red-100 text-red-800 rounded-xl text-xs font-bold border border-red-200">
                {authError}
              </div>
            )}
            {authSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">I am a</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('farmer')}
                    className={`py-2.5 rounded-xl font-black text-xs transition border ${
                      regRole === 'farmer' ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    🌾 Farmer / Producer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('buyer')}
                    className={`py-2.5 rounded-xl font-black text-xs transition border ${
                      regRole === 'buyer' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    🏢 Buyer / Mandi Trader
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-stone-100 p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    className="w-full bg-stone-100 p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Security PIN / Password</label>
                  <input
                    type="password"
                    required
                    placeholder="e.g. 1234"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-stone-100 p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Village / Town</label>
                  <input
                    type="text"
                    value={regVillage}
                    onChange={(e) => setRegVillage(e.target.value)}
                    className="w-full bg-stone-100 p-3 rounded-xl font-medium text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full bg-stone-100 p-3 rounded-xl font-medium text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full bg-stone-100 p-3 rounded-xl font-medium text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModal('login')}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  Already registered? Sign in here
                </button>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModal(null)}
                  className="flex-1 py-3 text-stone-600 font-bold text-sm rounded-xl hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-kisan btn-kisan-primary text-sm py-3"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
