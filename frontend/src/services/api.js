const API_BASE = '/api';

export async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = localStorage.getItem('smart_krishi_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (mobile, password) => fetchJson('/auth/login', { method: 'POST', body: JSON.stringify({ mobile, password }) }),
  register: (data) => fetchJson('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => fetchJson('/auth/profile'),
  updateProfile: (data) => fetchJson('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Crops & Prices
  getCrops: (lang = 'en') => fetchJson(`/crops?lang=${lang}`),
  getCrop: (id, lang = 'en') => fetchJson(`/crops/${id}?lang=${lang}`),
  getTodayPrices: (params = '') => fetchJson(`/prices/today?${params}`),
  getMarkets: (lang = 'en') => fetchJson(`/prices/markets?lang=${lang}`),

  // Predictions
  getPricePrediction: (cropId, period = '3m', marketId = '') => 
    fetchJson(`/prediction/price?crop_id=${cropId}&period=${period}${marketId ? `&market_id=${marketId}` : ''}`),

  // Soil
  analyzeSoil: (data) => fetchJson('/soil/analyze', { method: 'POST', body: JSON.stringify(data) }),

  // Production & Demand
  getProductionDemand: (crop = '') => fetchJson(`/production-demand/compare?crop=${crop}`),

  // Water
  getWaterIntelligence: (district = 'Kolar') => fetchJson(`/water/intelligence?district=${district}`),

  // Smart Recommendations
  getSmartRecommendations: (data) => fetchJson('/recommendations/smart', { method: 'POST', body: JSON.stringify(data) }),

  // Marketplace
  getListings: (query = '') => fetchJson(`/marketplace/listings?${query}`),
  createListing: (data) => fetchJson('/marketplace/listings', { method: 'POST', body: JSON.stringify(data) }),
  deleteListing: (id) => fetchJson(`/marketplace/listings/${id}`, { method: 'DELETE' }),
  sendEnquiry: (data) => fetchJson('/marketplace/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  getMyListings: () => fetchJson('/marketplace/my-listings'),

  // Buyer Crop Procurement Requests
  getBuyerCropRequests: () => fetchJson('/marketplace/buyer-requests'),
  postBuyerCropRequest: (data) => fetchJson('/marketplace/buyer-requests', { method: 'POST', body: JSON.stringify(data) }),

  // User Mutual Reviews
  getReviews: (params = '') => fetchJson(`/reviews?${params}`),
  submitReview: (data) => fetchJson('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // Calculator
  calculateNetReturn: (data) => fetchJson('/calculator/net-return', { method: 'POST', body: JSON.stringify(data) }),

  // Weather
  getWeather: (district = 'Kolar') => fetchJson(`/weather/current?district=${district}`),

  // Alerts & Notifications
  getAlerts: () => fetchJson('/alerts'),
  createAlert: (data) => fetchJson('/alerts', { method: 'POST', body: JSON.stringify(data) }),
  deleteAlert: (id) => fetchJson(`/alerts/${id}`, { method: 'DELETE' }),
  getNotifications: () => fetchJson('/notifications'),
  markNotificationRead: (id) => fetchJson(`/notifications/${id}/read`, { method: 'POST' }),

  // Kisan Mitra Chatbot
  sendChatMessage: (message, language = 'en', sessionId = 'session-1') =>
    fetchJson('/chatbot/message', { method: 'POST', body: JSON.stringify({ message, language, session_id: sessionId }) })
};

