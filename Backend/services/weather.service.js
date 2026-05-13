const axios = require('axios');

const OWM_BASE = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const OWM_KEY = process.env.OPENWEATHER_API_KEY;
const METEO_BASE = process.env.OPENMETEO_BASE_URL || 'https://api.open-meteo.com/v1';

// ─── Helper: map OWM icon to simple condition string ─────────────────────────
const iconToCondition = (icon) => {
  const map = {
    '01': 'Clear', '02': 'Few Clouds', '03': 'Cloudy',
    '04': 'Overcast', '09': 'Shower', '10': 'Rain',
    '11': 'Thunderstorm', '13': 'Snow', '50': 'Mist',
  };
  return map[icon?.slice(0, 2)] || 'Unknown';
};

// ─── Current weather via OpenWeatherMap ──────────────────────────────────────
const getCurrent = async (lat, lng) => {
  if (!OWM_KEY) throw { status: 503, message: 'Weather API key not configured.' };

  const { data } = await axios.get(`${OWM_BASE}/weather`, {
    params: { lat, lon: lng, appid: OWM_KEY, units: 'metric' },
  });

  return {
    location: data.name,
    latitude: lat,
    longitude: lng,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    pressure: data.main.pressure,
    visibility: data.visibility ? data.visibility / 1000 : null, // km
    uvIndex: null, // not in free OWM current endpoint
    rainfall: data.rain?.['1h'] || 0,
    condition: data.weather[0]?.description,
    conditionCode: data.weather[0]?.id,
    icon: data.weather[0]?.icon,
    cloudCover: data.clouds?.all,
    timestamp: new Date(data.dt * 1000).toISOString(),
  };
};

// ─── 7-day forecast via Open-Meteo (free, no key) ────────────────────────────
const getForecast = async (lat, lng, days = 7) => {
  const { data } = await axios.get(`${METEO_BASE}/forecast`, {
    params: {
      latitude: lat,
      longitude: lng,
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'precipitation_probability_max',
        'windspeed_10m_max',
        'weathercode',
        'uv_index_max',
      ].join(','),
      timezone: 'Asia/Kolkata',
      forecast_days: days,
    },
  });

  const wmoToCondition = (code) => {
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 49) return 'Foggy';
    if (code <= 59) return 'Drizzle';
    if (code <= 69) return 'Rain';
    if (code <= 79) return 'Snow';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  };

  const { daily } = data;
  return daily.time.map((date, i) => ({
    date,
    tempMax: Math.round(daily.temperature_2m_max[i]),
    tempMin: Math.round(daily.temperature_2m_min[i]),
    rainfall: daily.precipitation_sum[i] || 0,
    rainProbability: daily.precipitation_probability_max[i] || 0,
    windSpeed: daily.windspeed_10m_max[i] || 0,
    uvIndex: daily.uv_index_max[i] || 0,
    condition: wmoToCondition(daily.weathercode[i]),
    weatherCode: daily.weathercode[i],
    // Agri advisory tip based on conditions
    agriTip: getAgriTip(daily.weathercode[i], daily.precipitation_sum[i], daily.temperature_2m_max[i]),
  }));
};

// ─── Historical weather via Open-Meteo (forecast endpoint with past_days) ─────
const getHistorical = async (lat, lng, from, to) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
  const pastDays = Math.min(Math.max(diffDays, 1), 92);

  const { data } = await axios.get(`${METEO_BASE}/forecast`, {
    params: {
      latitude: lat,
      longitude: lng,
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
      timezone: 'Asia/Kolkata',
      past_days: pastDays,
      forecast_days: 0,
    },
  });

  const { daily } = data;
  if (!daily || !daily.time) return [];
  return daily.time.map((date, i) => ({
    date,
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    rainfall: daily.precipitation_sum[i] || 0,
  }));
};

// ─── Agri tip generator ───────────────────────────────────────────────────────
const getAgriTip = (weatherCode, rain, tempMax) => {
  if (weatherCode >= 80 && weatherCode <= 99) return 'Heavy rain expected — delay pesticide/fertilizer application.';
  if (weatherCode >= 51 && weatherCode <= 67) return 'Light rain — avoid field operations, good for germination.';
  if (rain > 20) return 'Ensure proper field drainage to prevent waterlogging.';
  if (tempMax > 42) return 'Extreme heat — irrigate early morning, avoid midday field work.';
  if (weatherCode === 0) return 'Clear sky — ideal for spraying, harvesting, and field work.';
  return 'Moderate conditions — suitable for routine farm activities.';
};

// ─── Agriculture-specific alerts from Open-Meteo ────────────────────────────
const getAgriAlert = async (lat, lng) => {
  const forecast = await getForecast(lat, lng, 3);
  const alerts = [];

  forecast.forEach((day) => {
    if (day.rainfall > 30) {
      alerts.push({ type: 'weather', severity: 'high', title: 'Heavy Rainfall Warning', message: `${day.rainfall}mm rain expected on ${day.date}. Avoid spraying and secure harvest.`, date: day.date });
    }
    if (day.tempMax > 42) {
      alerts.push({ type: 'weather', severity: 'medium', title: 'Heat Wave Alert', message: `Temperature may reach ${day.tempMax}°C on ${day.date}. Irrigate crops and protect livestock.`, date: day.date });
    }
    if (day.windSpeed > 40) {
      alerts.push({ type: 'weather', severity: 'medium', title: 'High Wind Warning', message: `Wind speed ${day.windSpeed} km/h on ${day.date}. Risk of lodging for tall crops.`, date: day.date });
    }
  });

  return alerts;
};

module.exports = { getCurrent, getForecast, getHistorical, getAgriAlert };
