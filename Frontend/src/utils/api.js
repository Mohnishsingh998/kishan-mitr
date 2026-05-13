// ============================================================
// API SERVICE LAYER
// Base URL configurable via environment variable
// ============================================================
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

const DEFAULT_LOCATION = { lat: 22.7196, lng: 75.8577 } // Indore, MP

function getStoredLocation() {
  const stored = localStorage.getItem('km_location')
  if (stored) {
    try { return JSON.parse(stored) } catch {}
  }
  return null
}

export function getLocation() {
  return new Promise((resolve) => {
    const stored = getStoredLocation()
    if (stored) return resolve(stored)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          localStorage.setItem('km_location', JSON.stringify(loc))
          resolve(loc)
        },
        () => resolve(DEFAULT_LOCATION),
        { timeout: 5000, maximumAge: 3600000 }
      )
    } else {
      resolve(DEFAULT_LOCATION)
    }
  })
}

export function getToken() {
  return localStorage.getItem('km_token')
}

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' }
  const authToken = token || getToken()
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE_URL}${path}`, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// Generic sendRequest for AI and other endpoints
export async function sendRequest(path, method = 'GET', body = null) {
  return request(method, path, body)
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
  createLand: (farmerId, data, token) => request('POST', `/farmers/${farmerId}/lands`, data, token),
}

// ---- LAND / FIELD ----
export const landAPI = {
  getAll: (token) => request('GET', '/lands', null, token),
  create: (data, token) => request('POST', '/lands', data, token),
  update: (id, data, token) => request('PUT', `/lands/${id}`, data, token),
  delete: (id, token) => request('DELETE', `/lands/${id}`, null, token),
  getSoilReport: (landId, token) => request('GET', `/lands/${landId}/soil-report`, null, token),
  addSoilReport: (landId, data, token) => {
    const farmerId = localStorage.getItem('km_farmer_id')
    return request('PUT', `/farmers/${farmerId}/lands/${landId}/soil`, data, token)
  },
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
  getSowingSchedule: (crop, region, token) =>
    request('GET', `/advisory/sowing-schedule?crop=${crop}&region=${region}`, null, token),
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
  getCurrent: async (lat, lng, token) => {
    const location = lat && lng ? { lat, lng } : await getLocation()
    return request('GET', `/weather/current?lat=${location.lat}&lng=${location.lng}`, null, token)
  },
  getForecast: async (lat, lng, days = 7, token) => {
    const location = lat && lng ? { lat, lng } : await getLocation()
    return request('GET', `/weather/forecast?lat=${location.lat}&lng=${location.lng}&days=${days}`, null, token)
  },
  getHistorical: (lat, lng, from, to, token) =>
    request('GET', `/weather/historical?lat=${lat}&lng=${lng}&from=${from}&to=${to}`, null, token),
  getAgriAlert: (lat, lng, token) =>
    request('GET', `/weather/agri-alerts?lat=${lat}&lng=${lng}`, null, token),
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
  getPriceHistory: (cropId, mandi, days, token) =>
    request('GET', `/market/prices/history?crop=${cropId || 'soybean'}&mandi=${mandi || 'indore'}&days=${days || 180}`, null, token),
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