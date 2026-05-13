import React, { useEffect, useState } from 'react'
import { Thermometer, Droplets, Wind, Sun, Eye, Gauge } from 'lucide-react'
import { weatherAPI, getLocation } from '../utils/api'
import { mockWeather } from '../utils/mockData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Weather() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeather() {
      try {
        const location = await getLocation()
        const [current, forecastData] = await Promise.all([
          weatherAPI.getCurrent(location.lat, location.lng),
          weatherAPI.getForecast(location.lat, location.lng, 7),
        ])
        setCurrentWeather(current)
        setForecast(forecastData.forecast || forecastData || [])
      } catch (err) {
        console.error('Weather fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [])

  const displayWeather = currentWeather || mockWeather
  const displayForecast = forecast.length > 0 ? forecast : mockWeather.forecast

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora text-2xl font-bold text-soil-900">Weather</h1>
        <p className="text-soil-500 text-sm mt-1">मौसम – Agricultural weather forecast for your location</p>
      </div>

      {/* Current weather */}
      <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 rounded-2xl p-6 text-white">
        {loading ? (
          <div className="flex items-center justify-center h-60">
            <p className="text-sky-200">Loading weather...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sky-100 text-sm">{displayWeather.location || 'Indore, MP'}</p>
                <div className="flex items-end gap-3 mt-1">
                  <span className="font-sora text-6xl font-bold">{Math.round(displayWeather.temperature || 28)}°</span>
                  <div className="pb-2">
                    <p className="font-medium">{displayWeather.condition || 'Clear'}</p>
                    <p className="text-sky-200 text-sm">Feels like {Math.round(displayWeather.feelsLike || 30)}°C</p>
                  </div>
                </div>
              </div>
              <span className="text-7xl">⛅</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-sky-400/50">
              {[
                { icon: Droplets,    label: 'Humidity',      value: `${displayWeather.humidity || 65}%` },
                { icon: Wind,        label: 'Wind Speed',    value: `${Math.round(displayWeather.windSpeed || 10)} km/h` },
                { icon: Thermometer, label: 'Rainfall',      value: `${displayWeather.rainfall || 0}mm` },
                { icon: Sun,         label: 'UV Index',      value: displayWeather.uvIndex || '5' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <Icon size={18} className="mx-auto mb-1 text-sky-200" />
                  <p className="text-sky-200 text-xs">{label}</p>
                  <p className="font-sora font-bold">{value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 7 day forecast */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-2">
          {displayForecast.map((d, i) => {
            const dayName = d.date ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d.date).getDay()] : 'Day'
            return (
            <div key={i} className="text-center p-3 rounded-xl hover:bg-earth-50 transition-colors cursor-default">
              <p className="text-xs text-soil-400 font-medium">{dayName}</p>
              <span className="text-2xl my-2 block">⛅</span>
              <p className="text-sm font-semibold text-soil-800">{Math.round(d.tempMax || 28)}°</p>
              <p className="text-xs text-soil-400">{Math.round(d.tempMin || 20)}°</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Droplets size={8} className="text-sky-400" />
                <span className="text-xs text-sky-600">{Math.round(d.rainProbability || d.rainfall || 0)}%</span>
              </div>
            </div>
            )
          })}
        </div>
      </div>

      {/* Rainfall chart */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-4">Expected Rainfall (mm)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={displayForecast.map(d => ({ 
            day: d.date ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d.date).getDay()] : 'Day', 
            rain: d.rainfall || 0
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5edd8" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#888' }} />
            <YAxis tick={{ fontSize: 12, fill: '#888' }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #bae6fd', fontSize: 12 }}
              formatter={(v) => [`${v.toFixed(1)} mm`, 'Rainfall']}
            />
            <Bar dataKey="rain" name="Rainfall" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Agri advisory */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h3 className="font-sora font-semibold text-amber-800 mb-3">🌾 Agricultural Advisory</h3>
        <ul className="space-y-2">
          {[
            'Heavy rain expected Wednesday – delay any pending sowing by 2 days',
            'Soil moisture currently adequate – reduce irrigation by 30% this week',
            'Warm nights (22°C+) favourable for soybean germination',
            'UV Index 6 – spray operations best done early morning or evening',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
              <span className="mt-0.5 shrink-0">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}