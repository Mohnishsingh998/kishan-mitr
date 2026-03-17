import React from 'react'
import { Link } from 'react-router-dom'
import {
  Thermometer, Droplets, Wind, TrendingUp, TrendingDown,
  AlertTriangle, Info, ChevronRight, Sprout, Bell
} from 'lucide-react'
import { mockWeather, mockMarketPrices, mockAlerts, mockFarmerProfile, mockAdvisory } from '../utils/mockData'

const alertColors = {
  high:   { bg: 'bg-red-50',    border: 'border-red-200',    icon: 'text-red-500',    dot: 'bg-red-500' },
  medium: { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: 'text-amber-500',  dot: 'bg-amber-500' },
  low:    { bg: 'bg-leaf-50',   border: 'border-leaf-200',   icon: 'text-leaf-600',   dot: 'bg-leaf-500' },
  info:   { bg: 'bg-sky-50',    border: 'border-sky-200',    icon: 'text-sky-500',    dot: 'bg-sky-500' },
}

export default function Dashboard() {
  const top = mockAdvisory.topRecommendations[0]

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-leaf-800 to-leaf-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-white rounded-full" />
          <div className="absolute -bottom-12 right-24 w-32 h-32 bg-white rounded-full" />
        </div>
        <div className="relative">
          <p className="text-leaf-200 text-sm mb-1">नमस्ते, Welcome back</p>
          <h1 className="font-sora text-2xl font-bold mb-1">{mockFarmerProfile.name}</h1>
          <p className="text-leaf-200 text-sm">{mockFarmerProfile.village}, {mockFarmerProfile.district} • {mockFarmerProfile.totalLand} acres</p>
          <div className="mt-4 flex items-center gap-3">
            <Link
              to="/advisory"
              className="flex items-center gap-2 bg-white text-leaf-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-earth-50 transition-colors"
            >
              <Sprout size={15} />
              Get Crop Advice
            </Link>
            <span className="text-leaf-300 text-sm">Kharif season recommendations ready</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Land',       labelH: 'कुल जमीन',    value: `${mockFarmerProfile.totalLand} acres`, color: 'bg-earth-50 border-earth-200 text-earth-700' },
          { label: 'Active Fields',    labelH: 'खेत',          value: `${mockFarmerProfile.lands.length} fields`, color: 'bg-leaf-50 border-leaf-200 text-leaf-700' },
          { label: 'Enrolled Schemes', labelH: 'योजनाएं',     value: '2 active',       color: 'bg-sky-50 border-sky-200 text-sky-700' },
          { label: 'Active Alerts',    labelH: 'अलर्ट',       value: `${mockAlerts.length} alerts`, color: 'bg-amber-50 border-amber-200 text-amber-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-xs font-medium opacity-60 mb-1">{s.label}</p>
            <p className="text-xs opacity-50 mb-2">{s.labelH}</p>
            <p className="font-sora text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather card */}
        <div className="bg-gradient-to-b from-sky-500 to-sky-600 rounded-2xl p-5 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sky-100 text-xs mb-1">{mockWeather.location}</p>
              <p className="font-sora text-4xl font-bold">{mockWeather.temperature}°C</p>
              <p className="text-sky-100 text-sm mt-1">{mockWeather.condition}</p>
            </div>
            <span className="text-4xl">⛅</span>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-sky-400">
            <div className="text-center">
              <Droplets size={14} className="mx-auto mb-1 text-sky-200" />
              <p className="text-xs text-sky-100">Humidity</p>
              <p className="font-semibold text-sm">{mockWeather.humidity}%</p>
            </div>
            <div className="text-center">
              <Wind size={14} className="mx-auto mb-1 text-sky-200" />
              <p className="text-xs text-sky-100">Wind</p>
              <p className="font-semibold text-sm">{mockWeather.windSpeed} km/h</p>
            </div>
            <div className="text-center">
              <Thermometer size={14} className="mx-auto mb-1 text-sky-200" />
              <p className="text-xs text-sky-100">Rain</p>
              <p className="font-semibold text-sm">{mockWeather.rainfall}mm</p>
            </div>
          </div>
          {/* 7-day mini */}
          <div className="flex justify-between mt-4 pt-4 border-t border-sky-400">
            {mockWeather.forecast.map(d => (
              <div key={d.day} className="text-center">
                <p className="text-sky-200 text-xs">{d.day}</p>
                <span className="text-sm">{d.icon}</span>
                <p className="text-xs font-medium">{d.high}°</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top recommendation */}
        <div className="bg-white rounded-2xl border border-earth-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sora font-semibold text-soil-800">Top Recommendation</h3>
            <Link to="/advisory" className="text-leaf-600 text-xs font-medium flex items-center gap-1 hover:text-leaf-800">
              See all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-leaf-100 rounded-xl flex items-center justify-center text-2xl shrink-0">🌱</div>
            <div>
              <p className="font-sora font-bold text-soil-900">{top.cropName}</p>
              <p className="text-soil-400 text-xs">{top.cropNameHindi}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-earth-100 rounded-full">
                  <div className="h-full bg-leaf-500 rounded-full" style={{ width: `${top.suitabilityScore}%` }} />
                </div>
                <span className="text-xs font-bold text-leaf-700">{top.suitabilityScore}%</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {top.reasons.slice(0, 2).map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-soil-600">
                <div className="w-1.5 h-1.5 bg-leaf-400 rounded-full mt-1.5 shrink-0" />
                {r}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-earth-100 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-soil-400">Expected Yield</p>
              <p className="text-sm font-semibold text-soil-800">{top.expectedYield}</p>
            </div>
            <div>
              <p className="text-xs text-soil-400">Est. Revenue</p>
              <p className="text-sm font-semibold text-leaf-700">{top.estimatedRevenue}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl border border-earth-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sora font-semibold text-soil-800">Alerts</h3>
            <Bell size={16} className="text-soil-400" />
          </div>
          <div className="space-y-3">
            {mockAlerts.map(alert => {
              const c = alertColors[alert.severity]
              return (
                <div key={alert.id} className={`rounded-lg border p-3 ${c.bg} ${c.border}`}>
                  <div className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${c.dot}`} />
                    <div>
                      <p className={`text-xs font-semibold ${c.icon}`}>{alert.title}</p>
                      <p className="text-xs text-soil-600 mt-0.5 line-clamp-2">{alert.message}</p>
                      <p className="text-xs text-soil-400 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Market prices */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sora font-semibold text-soil-800">Today's Mandi Prices</h3>
          <Link to="/market" className="text-leaf-600 text-xs font-medium flex items-center gap-1 hover:text-leaf-800">
            Full market <ChevronRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-earth-100">
                <th className="text-left text-xs text-soil-400 font-medium pb-2">Crop</th>
                <th className="text-left text-xs text-soil-400 font-medium pb-2">Mandi</th>
                <th className="text-right text-xs text-soil-400 font-medium pb-2">Price (₹/q)</th>
                <th className="text-right text-xs text-soil-400 font-medium pb-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {mockMarketPrices.map((m, i) => (
                <tr key={i} className="border-b border-earth-50 last:border-0">
                  <td className="py-2.5">
                    <div className="font-medium text-soil-800">{m.crop}</div>
                    <div className="text-xs text-soil-400">{m.cropHindi}</div>
                  </td>
                  <td className="py-2.5 text-soil-500 text-xs">{m.mandi}</td>
                  <td className="py-2.5 text-right font-sora font-semibold text-soil-800">₹{m.price.toLocaleString()}</td>
                  <td className="py-2.5 text-right">
                    <span className={`flex items-center justify-end gap-0.5 text-xs font-medium ${m.trend === 'up' ? 'text-leaf-600' : 'text-red-500'}`}>
                      {m.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {m.trend === 'up' ? '+' : ''}{m.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}