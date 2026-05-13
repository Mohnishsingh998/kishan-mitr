import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { LanguageProvider } from './hooks/useLanguage'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Advisory from './pages/Advisory'
import Weather from './pages/Weather'
import Market from './pages/Market'
import Pests from './pages/Pests'
import Schemes from './pages/Schemes'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import AIAssistant from './pages/ai/AIAssistant'
import CropRecommendation from './pages/ai/CropRecommendation'
import PestDetection from './pages/ai/PestDetection'
import YieldPrediction from './pages/ai/YieldPrediction'
import MarketForecast from './pages/ai/MarketForecast'
import WeatherAlerts from './pages/ai/WeatherAlerts'

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-earth-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Topbar collapsed={collapsed} />
      <main className={`pt-16 min-h-screen transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 max-w-4xl">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/advisory"  element={<Advisory />} />
            <Route path="/weather"   element={<Weather />} />
            <Route path="/market"    element={<Market />} />
            <Route path="/pests"     element={<Pests />} />
            <Route path="/schemes"   element={<Schemes />} />
            <Route path="/profile"   element={<Profile />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/ai-crops" element={<CropRecommendation />} />
            <Route path="/ai-pest" element={<PestDetection />} />
            <Route path="/ai-yield" element={<YieldPrediction />} />
            <Route path="/ai-market" element={<MarketForecast />} />
            <Route path="/ai-weather" element={<WeatherAlerts />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*"     element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}