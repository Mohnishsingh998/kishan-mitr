import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('km_token'))
  const [loading, setLoading] = useState(true)

  const refreshToken = async () => {
    const refresh = localStorage.getItem('km_refresh')
    if (!refresh) return false
    try {
      const data = await authAPI.refreshToken(refresh)
      localStorage.setItem('km_token', data.access_token)
      localStorage.setItem('km_refresh', data.refresh_token)
      setToken(data.access_token)
      return true
    } catch {
      localStorage.removeItem('km_token')
      localStorage.removeItem('km_refresh')
      setToken(null)
      setUser(null)
      return false
    }
  }

  const fetchProfile = async (authToken) => {
    try {
      const userData = await authAPI.getProfile(authToken)
      setUser(userData)
    } catch (err) {
      if (err.message?.includes('expired') || err.message?.includes('invalid')) {
        const success = await refreshToken()
        if (success) {
          const newToken = localStorage.getItem('km_token')
          const userData = await authAPI.getProfile(newToken)
          setUser(userData)
        }
      } else {
        throw err
      }
    }
  }

  useEffect(() => {
    if (token) {
      fetchProfile(token)
        .catch(() => { setToken(null); localStorage.removeItem('km_token') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (credentials) => {
    const data = await authAPI.login(credentials)
    localStorage.setItem('km_token', data.access_token)
    localStorage.setItem('km_refresh', data.refresh_token)
    localStorage.setItem('km_farmer_id', data.user?.id || '')
    setToken(data.access_token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('km_token')
    localStorage.removeItem('km_refresh')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshToken, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)