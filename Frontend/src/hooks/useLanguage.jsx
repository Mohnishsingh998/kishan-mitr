import React, { createContext, useContext, useState, useCallback } from 'react'
import { en, hi } from '../utils/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('km_lang') || 'hi'
  })

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'hi' : 'en'
      localStorage.setItem('km_lang', next)
      return next
    })
  }, [])

  const t = useCallback((key) => {
    const dict = language === 'en' ? en : hi
    const keys = key.split('.')
    let val = dict
    for (const k of keys) {
      val = val?.[k]
    }
    return val ?? key
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
