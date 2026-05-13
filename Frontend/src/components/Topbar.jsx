import React from 'react'
import { Bell, Search, Globe } from 'lucide-react'
import { mockAlerts } from '../utils/mockData'
import { useLanguage } from '../hooks/useLanguage'
import { useAuth } from '../hooks/useAuth'
import { authAPI } from '../utils/api'

export default function Topbar({ collapsed }) {
  const unread = mockAlerts.filter(a => a.severity !== 'read').length
  const { language, toggleLanguage, t } = useLanguage()
  const { token } = useAuth()

  const handleToggle = () => {
    const next = language === 'en' ? 'hi' : 'en'
    toggleLanguage()
    if (token) {
      authAPI.updateProfile({ preferredLanguage: next }, token).catch(() => {})
    }
  }

  return (
    <header className={`
      fixed top-0 right-0 z-20 bg-white border-b border-earth-100
      flex items-center justify-between px-6 h-16
      transition-all duration-300
      ${collapsed ? 'left-16' : 'left-64'}
    `}>
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-400" />
          <input
            type="text"
            placeholder={t('topbar.search')}
            className="w-full pl-9 pr-4 py-2 bg-earth-50 border border-earth-100 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent
                       placeholder:text-soil-400"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Language toggle */}
        <button
          onClick={handleToggle}
          className="flex items-center gap-1.5 text-sm text-soil-500 hover:text-leaf-700 transition-colors"
        >
          <Globe size={16} />
          <span className="font-medium">{language === 'en' ? 'हिंदी' : 'English'}</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-earth-50 transition-colors">
          <Bell size={18} className="text-soil-600" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {unread}
            </span>
          )}
        </button>

        {/* Season badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-leaf-50 border border-leaf-200 rounded-full">
          <div className="w-2 h-2 bg-leaf-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-leaf-700">{t('topbar.season')}</span>
        </div>
      </div>
    </header>
  )
}
