import React, { useState } from 'react'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { mockMarketPrices, mockPriceHistory } from '../utils/mockData'

export default function Market() {
  const [selected, setSelected] = useState('Indore')
  const mandis = ['Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Manasa']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora text-2xl font-bold text-soil-900">Market Prices</h1>
        <p className="text-soil-500 text-sm mt-1">बाजार भाव – Live mandi prices across Madhya Pradesh</p>
      </div>

      {/* Mandi filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {mandis.map(m => (
          <button
            key={m}
            onClick={() => setSelected(m)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selected === m ? 'bg-leaf-600 text-white' : 'bg-white border border-earth-200 text-soil-600 hover:border-leaf-400'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Price cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {mockMarketPrices.map((m, i) => (
          <div key={i} className="bg-white rounded-xl border border-earth-100 p-4 hover:border-earth-200 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-soil-800">{m.crop}</p>
                <p className="text-xs text-soil-400">{m.cropHindi}</p>
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${m.trend === 'up' ? 'text-leaf-600' : 'text-red-500'}`}>
                {m.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {m.trend === 'up' ? '+' : ''}{m.change}
              </span>
            </div>
            <p className="font-sora text-2xl font-bold text-soil-900">₹{m.price.toLocaleString()}</p>
            <p className="text-xs text-soil-400 mt-1">per {m.unit} • {m.mandi}</p>
          </div>
        ))}
      </div>

      {/* Price history chart */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-4">6-Month Price Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={mockPriceHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5edd8" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888' }} />
            <YAxis tick={{ fontSize: 12, fill: '#888' }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #e8bc72', fontSize: 12 }}
              formatter={(v) => [`₹${v.toLocaleString()}`, '']}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="soybean" name="Soybean" stroke="#16a34a" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="maize"   name="Maize"   stroke="#0284c7" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="cotton"  name="Cotton"  stroke="#c97f1e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MSP table */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-3">MSP 2023-24 (Minimum Support Price)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-earth-100">
                {['Crop', 'MSP (₹/quintal)', 'Market Price', 'Premium'].map(h => (
                  <th key={h} className="text-left text-xs text-soil-400 font-medium pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { crop: 'Soybean', msp: 4600, market: 5200 },
                { crop: 'Maize',   msp: 1962, market: 1900 },
                { crop: 'Cotton',  msp: 6620, market: 6700 },
                { crop: 'Wheat',   msp: 2275, market: 2200 },
              ].map(row => {
                const premium = row.market - row.msp
                return (
                  <tr key={row.crop} className="border-b border-earth-50 last:border-0">
                    <td className="py-2.5 font-medium text-soil-800 pr-4">{row.crop}</td>
                    <td className="py-2.5 text-soil-600 pr-4">₹{row.msp.toLocaleString()}</td>
                    <td className="py-2.5 font-semibold text-soil-900 pr-4">₹{row.market.toLocaleString()}</td>
                    <td className={`py-2.5 font-semibold ${premium > 0 ? 'text-leaf-600' : 'text-red-500'}`}>
                      {premium > 0 ? '+' : ''}₹{premium.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}