import React, { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, Droplets, TrendingUp, Calendar, Leaf } from 'lucide-react'
import { mockAdvisory, mockFarmerProfile } from '../utils/mockData'

const riskColor = { low: 'bg-leaf-50 text-leaf-700', medium: 'bg-amber-50 text-amber-700', high: 'bg-red-50 text-red-700' }

function ScoreBar({ score }) {
  const color = score >= 85 ? 'bg-leaf-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-earth-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-bold ${score >= 85 ? 'text-leaf-700' : score >= 70 ? 'text-amber-700' : 'text-red-600'}`}>{score}%</span>
    </div>
  )
}

function CropCard({ rec, isTop }) {
  const [expanded, setExpanded] = useState(isTop)

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${isTop ? 'border-leaf-300 shadow-md shadow-leaf-100' : 'border-earth-100'}`}>
      {isTop && (
        <div className="bg-leaf-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center gap-2">
          <CheckCircle size={12} /> Best Match for Your Fields
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-earth-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
            {rec.cropName === 'Soybean' ? '🫘' : rec.cropName === 'Maize' ? '🌽' : '🌿'}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-sora font-bold text-soil-900 text-lg">{rec.cropName}</h3>
                <p className="text-soil-400 text-sm">{rec.cropNameHindi} • Rank #{rec.rank}</p>
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-soil-400 hover:text-soil-700 p-1"
              >
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            <div className="mt-3">
              <p className="text-xs text-soil-400 mb-1">Suitability Score</p>
              <ScoreBar score={rec.suitabilityScore} />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-earth-50 rounded-xl p-3">
            <p className="text-xs text-soil-400 mb-0.5">Yield</p>
            <p className="text-xs font-semibold text-soil-800">{rec.expectedYield}</p>
          </div>
          <div className="bg-leaf-50 rounded-xl p-3">
            <p className="text-xs text-soil-400 mb-0.5">Revenue</p>
            <p className="text-xs font-semibold text-leaf-800">{rec.estimatedRevenue}</p>
          </div>
          <div className="bg-sky-50 rounded-xl p-3">
            <p className="text-xs text-soil-400 mb-0.5">Water</p>
            <p className="text-xs font-semibold text-sky-800">{rec.waterRequirement.split('(')[0].trim()}</p>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4 border-t border-earth-50 pt-4">
            {/* Reasons */}
            <div>
              <h4 className="text-xs font-semibold text-soil-500 uppercase tracking-wide mb-2">Why Recommended</h4>
              <ul className="space-y-1.5">
                {rec.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-soil-700">
                    <CheckCircle size={13} className="text-leaf-500 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div>
              <h4 className="text-xs font-semibold text-soil-500 uppercase tracking-wide mb-2">Watch Out For</h4>
              <div className="flex gap-2 flex-wrap">
                {rec.risks.map((r, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-1">
                    <AlertCircle size={10} /> {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Activity timeline */}
            {rec.activities.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-soil-500 uppercase tracking-wide mb-2">Activity Timeline</h4>
                <div className="space-y-2">
                  {rec.activities.map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 text-xs text-soil-400 text-right shrink-0">Wk {a.week}</div>
                      <div className="w-2 h-2 bg-earth-300 rounded-full shrink-0" />
                      <div className={`text-xs font-medium rounded-full px-2 py-0.5
                        ${a.type === 'field'   ? 'bg-leaf-50 text-leaf-700'
                        : a.type === 'monitor' ? 'bg-sky-50 text-sky-700'
                        : a.type === 'input'   ? 'bg-amber-50 text-amber-700'
                        : 'bg-earth-100 text-soil-700'}`}>
                        {a.task}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="w-full mt-2 bg-leaf-600 hover:bg-leaf-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
              Generate Full Farming Plan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Advisory() {
  const [landId, setLandId] = useState('L001')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora text-2xl font-bold text-soil-900">Crop Advisory</h1>
        <p className="text-soil-500 text-sm mt-1">फसल सलाह – AI-powered recommendations for your fields</p>
      </div>

      {/* Field selector */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-3">Select Field</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mockFarmerProfile.lands.map(land => (
            <button
              key={land.id}
              onClick={() => setLandId(land.id)}
              className={`rounded-xl border p-4 text-left transition-all
                ${landId === land.id
                  ? 'border-leaf-400 bg-leaf-50 shadow-sm'
                  : 'border-earth-100 hover:border-earth-300'
                }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm text-soil-800">{land.name}</p>
                  <p className="text-xs text-soil-400">{land.area} acres</p>
                </div>
                {landId === land.id && <CheckCircle size={16} className="text-leaf-600" />}
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-soil-500">
                  <Leaf size={10} className="text-soil-400" />
                  {land.soilType}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-soil-500">
                  <Droplets size={10} className="text-soil-400" />
                  {land.irrigation}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-soil-500">
                  <Calendar size={10} className="text-soil-400" />
                  Last: {land.lastCrop}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advisory header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sora font-semibold text-soil-800">Recommendations for Kharif 2024</h2>
          <p className="text-soil-400 text-sm">Based on your soil, weather & market data</p>
        </div>
        <div className="text-xs text-soil-400 bg-earth-50 border border-earth-100 rounded-full px-3 py-1.5">
          Generated: 17 Mar 2024, 9:00 AM
        </div>
      </div>

      {/* Crop cards */}
      <div className="space-y-4">
        {mockAdvisory.topRecommendations.map((rec, i) => (
          <CropCard key={rec.cropId} rec={rec} isTop={i === 0} />
        ))}
      </div>
    </div>
  )
}