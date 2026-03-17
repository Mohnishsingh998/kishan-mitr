// ============================================================
// API SERVICE LAYER
// Base URL configurable via environment variable
// ============================================================
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE_URL}${path}`, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ---- AUTH ----
export const authAPI = {
  register: (data) => request('POST', '/auth/register', data),
  login: (data) => request('POST', '/auth/login', data),
  refreshToken: (refreshToken) => request('POST', '/auth/refresh', { refresh_token: refreshToken }),
  getProfile: (token) => request('GET', '/auth/profile', null, token),
  updateProfile: (data, token) => request('PUT', '/auth/profile', data, token),
}

// ---- FARMER ----
export const farmerAPI = {
  getAll: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request('GET', `/farmers?${qs}`, null, token)
  },
  getById: (id, token) => request('GET', `/farmers/${id}`, null, token),
  create: (data, token) => request('POST', '/farmers', data, token),
  update: (id, data, token) => request('PUT', `/farmers/${id}`, data, token),
  delete: (id, token) => request('DELETE', `/farmers/${id}`, null, token),
  getLands: (farmerId, token) => request('GET', `/farmers/${farmerId}/lands`, null, token),
}

// ---- LAND / FIELD ----
export const landAPI = {
  create: (data, token) => request('POST', '/lands', data, token),
  update: (id, data, token) => request('PUT', `/lands/${id}`, data, token),
  delete: (id, token) => request('DELETE', `/lands/${id}`, null, token),
  getSoilReport: (landId, token) => request('GET', `/lands/${landId}/soil-report`, null, token),
  addSoilReport: (landId, data, token) => request('POST', `/lands/${landId}/soil-report`, data, token),
}

// ---- CROP ADVISORY ----
export const advisoryAPI = {
  // Main advisory recommendation
  getRecommendation: (data, token) => request('POST', '/advisory/recommend', data, token),
  // Get all advisories for a farmer
  getForFarmer: (farmerId, token) => request('GET', `/advisory/farmer/${farmerId}`, null, token),
  // Get a specific advisory
  getById: (id, token) => request('GET', `/advisory/${id}`, null, token),
  // Seasonal crop calendar
  getCropCalendar: (params, token) => {
    const qs = new URLSearchParams(params).toString()
    return request('GET', `/advisory/calendar?${qs}`, null, token)
  },
  // Sow/harvest timing
  getSowingSchedule: (cropId, regionId, token) =>
    request('GET', `/advisory/sowing-schedule?crop_id=${cropId}&region_id=${regionId}`, null, token),
}

// ---- CROPS ----
export const cropAPI = {
  getAll: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request('GET', `/crops?${qs}`, null, token)
  },
  getById: (id, token) => request('GET', `/crops/${id}`, null, token),
  getRequirements: (id, token) => request('GET', `/crops/${id}/requirements`, null, token),
  search: (query, token) => request('GET', `/crops/search?q=${encodeURIComponent(query)}`, null, token),
}

// ---- WEATHER ----
export const weatherAPI = {
  getCurrent: (lat, lng, token) =>
    request('GET', `/weather/current?lat=${lat}&lng=${lng}`, null, token),
  getForecast: (lat, lng, days = 7, token) =>
    request('GET', `/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`, null, token),
  getHistorical: (lat, lng, from, to, token) =>
    request('GET', `/weather/historical?lat=${lat}&lng=${lng}&from=${from}&to=${to}`, null, token),
  getAgriAlert: (regionId, token) =>
    request('GET', `/weather/agri-alerts/${regionId}`, null, token),
}

// ---- SOIL ----
export const soilAPI = {
  analyze: (data, token) => request('POST', '/soil/analyze', data, token),
  getTypes: (token) => request('GET', '/soil/types', null, token),
  getRecommendation: (soilProfileId, token) =>
    request('GET', `/soil/recommendation/${soilProfileId}`, null, token),
}

// ---- PEST & DISEASE ----
export const pestAPI = {
  getAll: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request('GET', `/pests?${qs}`, null, token)
  },
  identify: (data, token) => request('POST', '/pests/identify', data, token),
  getTreatments: (pestId, token) => request('GET', `/pests/${pestId}/treatments`, null, token),
  reportOutbreak: (data, token) => request('POST', '/pests/outbreak', data, token),
  getNearbyOutbreaks: (lat, lng, radius, token) =>
    request('GET', `/pests/outbreaks/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, null, token),
}

// ---- MARKET PRICES ----
export const marketAPI = {
  getPrices: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request('GET', `/market/prices?${qs}`, null, token)
  },
  getPriceHistory: (cropId, mandirId, days, token) =>
    request('GET', `/market/prices/history?crop_id=${cropId}&mandir_id=${mandirId}&days=${days}`, null, token),
  getMandis: (state, token) =>
    request('GET', `/market/mandis?state=${encodeURIComponent(state)}`, null, token),
  getPriceForecast: (cropId, token) =>
    request('GET', `/market/prices/forecast/${cropId}`, null, token),
}

// ---- GOVERNMENT SCHEMES ----
export const schemeAPI = {
  getAll: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request('GET', `/schemes?${qs}`, null, token)
  },
  getById: (id, token) => request('GET', `/schemes/${id}`, null, token),
  getEligible: (farmerId, token) => request('GET', `/schemes/eligible/${farmerId}`, null, token),
  applyForScheme: (schemeId, farmerId, data, token) =>
    request('POST', `/schemes/${schemeId}/apply`, { farmer_id: farmerId, ...data }, token),
}

// ---- NOTIFICATIONS ----
export const notificationAPI = {
  getAll: (token) => request('GET', '/notifications', null, token),
  markRead: (id, token) => request('PATCH', `/notifications/${id}/read`, null, token),
  markAllRead: (token) => request('PATCH', '/notifications/read-all', null, token),
  updatePreferences: (data, token) => request('PUT', '/notifications/preferences', data, token),
}