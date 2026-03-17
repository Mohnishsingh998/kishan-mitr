import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, Phone } from 'lucide-react'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Demo: just navigate
    setTimeout(() => navigate('/dashboard'), 800)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-900 via-leaf-800 to-leaf-700 flex flex-col">
      {/* Hero illustration */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-16 text-white text-center">
        <div className="w-16 h-16 bg-earth-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Leaf size={30} className="text-white" />
        </div>
        <h1 className="font-sora text-3xl font-bold mb-1">KrishiMitra</h1>
        <p className="text-leaf-200 text-lg">कृषि मित्र</p>
        <p className="text-leaf-300 text-sm mt-2 max-w-xs">
          Smart crop advisory for small & marginal farmers
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {['🌱 Crop Advisory', '🌤 Weather', '📈 Market Prices', '🏛 Gov. Schemes'].map(f => (
            <span key={f} className="text-xs bg-leaf-700/60 text-leaf-100 border border-leaf-600 rounded-full px-3 py-1">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Login card */}
      <div className="bg-earth-50 rounded-t-3xl p-6 shadow-xl">
        <h2 className="font-sora text-xl font-bold text-soil-900 mb-1">Welcome Back</h2>
        <p className="text-soil-500 text-sm mb-5">लॉगिन करें – Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-soil-600 mb-1.5">Mobile Number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-400" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full pl-9 pr-4 py-3 bg-white border border-earth-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-soil-600 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-4 pr-10 py-3 bg-white border border-earth-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-soil-400"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-leaf-600 hover:bg-leaf-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button className="text-sm text-leaf-700 font-medium hover:underline">
            New farmer? Register here
          </button>
        </div>

        <p className="text-center text-xs text-soil-400 mt-4">
          Demo: tap Sign In to enter app
        </p>
      </div>
    </div>
  )
}