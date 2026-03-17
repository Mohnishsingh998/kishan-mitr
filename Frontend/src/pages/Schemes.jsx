import React from 'react'
import { CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react'
import { mockSchemes } from '../utils/mockData'

const statusMeta = {
  enrolled:    { label: 'Enrolled',    labelH: 'नामांकित',   icon: CheckCircle, color: 'text-leaf-600 bg-leaf-50 border-leaf-200' },
  eligible:    { label: 'Eligible',    labelH: 'पात्र',      icon: Clock,       color: 'text-amber-600 bg-amber-50 border-amber-200' },
  'not-applied':{ label: 'Not Applied', labelH: 'आवेदन नहीं', icon: XCircle,    color: 'text-soil-500 bg-earth-50 border-earth-200' },
}

export default function Schemes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora text-2xl font-bold text-soil-900">Government Schemes</h1>
        <p className="text-soil-500 text-sm mt-1">सरकारी योजनाएं – Schemes you are eligible for</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Enrolled', count: 1, color: 'bg-leaf-50 border-leaf-200 text-leaf-700' },
          { label: 'Eligible', count: 2, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Available', count: 4, color: 'bg-sky-50 border-sky-200 text-sky-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="font-sora text-3xl font-bold">{s.count}</p>
            <p className="text-sm font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Scheme cards */}
      <div className="space-y-4">
        {mockSchemes.map(scheme => {
          const meta = statusMeta[scheme.status]
          const Icon = meta.icon
          return (
            <div key={scheme.id} className="bg-white rounded-2xl border border-earth-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-sora font-bold text-soil-900">{scheme.name}</h3>
                    <span className="text-xs text-soil-400 bg-earth-50 border border-earth-100 rounded-full px-2 py-0.5">
                      {scheme.category}
                    </span>
                  </div>
                  <p className="text-soil-400 text-sm mt-0.5">{scheme.nameHindi}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-semibold border rounded-full px-3 py-1.5 ${meta.color}`}>
                  <Icon size={12} />
                  {meta.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-earth-50 rounded-xl p-3 mb-4">
                <div>
                  <p className="text-xs text-soil-400">Benefit</p>
                  <p className="text-sm font-semibold text-soil-800 mt-0.5">{scheme.benefit}</p>
                </div>
                <div>
                  <p className="text-xs text-soil-400">Deadline</p>
                  <p className="text-sm font-semibold text-soil-800 mt-0.5">{scheme.deadline}</p>
                </div>
              </div>

              {scheme.status === 'eligible' && (
                <button className="w-full bg-leaf-600 hover:bg-leaf-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  Apply Now
                  <ExternalLink size={13} />
                </button>
              )}
              {scheme.status === 'enrolled' && (
                <div className="flex items-center gap-2 text-sm text-leaf-700 bg-leaf-50 border border-leaf-200 rounded-xl p-3">
                  <CheckCircle size={14} />
                  You are enrolled in this scheme
                </div>
              )}
              {scheme.status === 'not-applied' && (
                <button className="w-full border border-earth-200 text-soil-600 text-sm font-medium py-2.5 rounded-xl hover:bg-earth-50 transition-colors">
                  Check Eligibility
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}