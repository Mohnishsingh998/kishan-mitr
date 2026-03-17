import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('km_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      authAPI.getProfile(token)
        .then(setUser)
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
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)