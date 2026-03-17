import React from 'react'
import { Thermometer, Droplets, Wind, Sun, Eye, Gauge } from 'lucide-react'
import { mockWeather } from '../utils/mockData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Weather() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora text-2xl font-bold text-soil-900">Weather</h1>
        <p className="text-soil-500 text-sm mt-1">मौसम – Agricultural weather forecast for your location</p>
      </div>

      {/* Current weather */}
      <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sky-100 text-sm">{mockWeather.location}</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="font-sora text-6xl font-bold">{mockWeather.temperature}°</span>
              <div className="pb-2">
                <p className="font-medium">{mockWeather.condition}</p>
                <p className="text-sky-200 text-sm">Feels like 31°C</p>
              </div>
            </div>
          </div>
          <span className="text-7xl">⛅</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-sky-400/50">
          {[
            { icon: Droplets,    label: 'Humidity',      value: `${mockWeather.humidity}%` },
            { icon: Wind,        label: 'Wind Speed',    value: `${mockWeather.windSpeed} km/h` },
            { icon: Thermometer, label: 'Rainfall',      value: `${mockWeather.rainfall}mm` },
            { icon: Sun,         label: 'UV Index',      value: mockWeather.uvIndex },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <Icon size={18} className="mx-auto mb-1 text-sky-200" />
              <p className="text-sky-200 text-xs">{label}</p>
              <p className="font-sora font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7 day forecast */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-2">
          {mockWeather.forecast.map(d => (
            <div key={d.day} className="text-center p-3 rounded-xl hover:bg-earth-50 transition-colors cursor-default">
              <p className="text-xs text-soil-400 font-medium">{d.day}</p>
              <span className="text-2xl my-2 block">{d.icon}</span>
              <p className="text-sm font-semibold text-soil-800">{d.high}°</p>
              <p className="text-xs text-soil-400">{d.low}°</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Droplets size={8} className="text-sky-400" />
                <span className="text-xs text-sky-600">{d.rain}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rainfall chart */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-4">Expected Rainfall (mm)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockWeather.forecast.map(d => ({ day: d.day, rain: d.rain * 1.2 }))}>
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