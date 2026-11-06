import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle2, TrendingUp, CloudRain, 
  ShoppingBag, ShieldAlert, Check 
} from 'lucide-react';
import { api } from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotifications()
      .then(res => {
        setNotifications(res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {}
  };

  const getIcon = (type) => {
    switch (type) {
      case 'price': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'weather': return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'enquiry': return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      default: return <Bell className="w-5 h-5 text-stone-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
            <Bell className="w-8 h-8 text-amber-500" />
            <span>Farmer Alerts & Notifications</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Real-time price spikes, meteorological warnings, and incoming purchase requests.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span>Loading notifications...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="card-kisan p-12 text-center text-stone-500">
          <p className="text-base font-bold text-stone-800">You have no new notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`card-kisan p-4 sm:p-5 flex items-start justify-between gap-4 transition ${
                n.is_read ? 'bg-white opacity-80' : 'bg-amber-50/40 border-amber-300 shadow-md'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-2xl bg-white border shadow-sm mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-stone-900 text-base">{n.title}</h3>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[11px] text-stone-400 mt-2 block">{n.created_at || 'Today'}</span>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="shrink-0 p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition text-xs font-bold flex items-center space-x-1"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

