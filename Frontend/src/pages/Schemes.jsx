import React, { useEffect, useState } from 'react'
import { CheckCircle, Clock, XCircle, ExternalLink, Loader } from 'lucide-react'
import { schemeAPI } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'

const statusMeta = {
  enrolled:     { label: 'Enrolled',     labelH: 'नामांकित',   icon: CheckCircle, color: 'text-leaf-600 bg-leaf-50 border-leaf-200' },
  eligible:     { label: 'Eligible',     labelH: 'पात्र',      icon: Clock,       color: 'text-amber-600 bg-amber-50 border-amber-200' },
  applied:      { label: 'Applied',      labelH: 'आवेदन किया', icon: Clock,       color: 'text-blue-600 bg-blue-50 border-blue-200' },
  'under-review': { label: 'Under Review', labelH: 'समीक्षाधीन', icon: Clock,     color: 'text-purple-600 bg-purple-50 border-purple-200' },
  approved:     { label: 'Approved',     labelH: 'स्वीकृत',    icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  rejected:     { label: 'Rejected',     labelH: 'अस्वीकृत',   icon: XCircle,    color: 'text-red-600 bg-red-50 border-red-200' },
  'not-applied': { label: 'Not Available', labelH: 'उपलब्ध नहीं', icon: XCircle, color: 'text-soil-500 bg-earth-50 border-earth-200' },
}

const statusMap = {
  'enrolled': 'enrolled',
  'eligible': 'eligible',
  'not_eligible': 'not-applied',
  'applied': 'applied',
  'under_review': 'under-review',
  'approved': 'approved',
  'rejected': 'rejected',
}

export default function Schemes() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSchemes() {
      if (!user?.id) {
        setLoading(false)
        return
      }
      try {
        const data = await schemeAPI.getEligible(user.id)
        const mapped = (Array.isArray(data) ? data : []).map(s => ({
          ...s,
          status: statusMap[s.applicationStatus] || 'not-applied',
        }))
        setSchemes(mapped)
      } catch (err) {
        console.error('Schemes fetch error:', err)
        setSchemes([])
      } finally {
        setLoading(false)
      }
    }
    fetchSchemes()
  }, [user?.id])

  const enrolled = schemes.filter(s => s.status === 'enrolled').length
  const eligible = schemes.filter(s => s.status === 'eligible').length
  const available = schemes.filter(s => s.status === 'eligible' || s.status === 'enrolled').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora text-2xl font-bold text-soil-900">{t('schemes.title')}</h1>
        <p className="text-soil-500 text-sm mt-1">{t('schemes.subtitle')}</p>
      </div>

      {!user ? (
        <div className="bg-white rounded-2xl border border-earth-100 p-8 text-center">
          <p className="text-soil-500">{t('schemes.pleaseLogin')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t('schemes.enrolled'), count: enrolled, color: 'bg-leaf-50 border-leaf-200 text-leaf-700' },
              { label: t('schemes.eligible'), count: eligible, color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { label: t('schemes.available'), count: available, color: 'bg-sky-50 border-sky-200 text-sky-700' },
            ].map(s => (
              <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
                <p className="font-sora text-3xl font-bold">{s.count}</p>
                <p className="text-sm font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-soil-400">
                <Loader size={16} className="animate-spin" />
                {t('schemes.loading')}
              </div>
            ) : schemes.length === 0 ? (
              <div className="text-center py-8 text-soil-400">{t('schemes.noSchemes')}</div>
            ) : (
              schemes.map(scheme => {
                const meta = statusMeta[scheme.status] || statusMeta['not-applied']
                const Icon = meta.icon
                return (
                  <div key={scheme.id} className="bg-white rounded-2xl border border-earth-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-sora font-bold text-soil-900">{scheme.name}</h3>
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
                        <p className="text-xs text-soil-400">{t('schemes.benefit')}</p>
                        <p className="text-sm font-semibold text-soil-800 mt-0.5">{scheme.benefit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-soil-400">{t('schemes.deadline')}</p>
                        <p className="text-sm font-semibold text-soil-800 mt-0.5">
                          {scheme.deadline ? new Date(scheme.deadline).toLocaleDateString('en-IN') : t('schemes.rolling')}
                        </p>
                      </div>
                    </div>

                    {scheme.status === 'eligible' && (
                      <a
                        href={scheme.applicationUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-leaf-600 hover:bg-leaf-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        {t('schemes.applyNow')}
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {scheme.status === 'enrolled' && (
                      <div className="flex items-center gap-2 text-sm text-leaf-700 bg-leaf-50 border border-leaf-200 rounded-xl p-3">
                        <CheckCircle size={14} />
                        {t('schemes.enrolledMsg')}
                      </div>
                    )}
                    {scheme.status === 'applied' && (
                      <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <Clock size={14} />
                        {t('schemes.appliedMsg')}
                      </div>
                    )}
                    {scheme.status === 'under-review' && (
                      <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-xl p-3">
                        <Clock size={14} />
                        {t('schemes.reviewingMsg')}
                      </div>
                    )}
                    {scheme.status === 'approved' && (
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
                        <CheckCircle size={14} />
                        {t('schemes.approvedMsg')}
                      </div>
                    )}
                    {scheme.status === 'rejected' && (
                      <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                        <XCircle size={14} />
                        {t('schemes.rejectedMsg')}
                      </div>
                    )}
                    {scheme.status === 'not-applied' && scheme.eligibility?.isEligible === false && (
                      <div className="flex items-center gap-2 text-sm text-soil-500 bg-earth-50 border border-earth-200 rounded-xl p-3">
                        <XCircle size={14} />
                        {scheme.eligibility.reasons?.[0] || t('schemes.notEligible')}
                      </div>
                    )}
                    {scheme.status === 'not-applied' && (!scheme.eligibility || scheme.eligibility.isEligible !== false) && (
                      <a
                        href={scheme.applicationUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full border border-earth-200 text-soil-600 text-sm font-medium py-2.5 rounded-xl hover:bg-earth-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {t('schemes.checkEligibility')}
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </>
      )}
    </div>
  )
}
