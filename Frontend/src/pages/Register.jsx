import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf, Eye, EyeOff, Phone, User, MapPin, ChevronDown } from 'lucide-react'
import { authAPI } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: 'Madhya Pradesh',
    district: '',
    village: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!form.phone.match(/^[0-9]{10}$/)) {
      setError('Enter valid 10-digit phone number')
      return
    }

    setLoading(true)
    try {
      const data = await authAPI.register({
        name: form.name,
        phone: form.phone,
        password: form.password,
        state: form.state,
        district: form.district,
        village: form.village,
      })
      await login({ phone: form.phone, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-amber-800 via-emerald-800 to-teal-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-12 text-white text-center relative z-10">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-emerald-500 rounded-3xl flex items-center justify-center mb-4 shadow-2xl shadow-emerald-900/30 ring-4 ring-white/10">
            <Leaf size={36} className="text-white drop-shadow-lg" />
          </div>
        </div>
        <h1 className="font-sora text-4xl font-bold mb-1 tracking-tight drop-shadow-lg">KrishiMitra</h1>
        <p className="text-amber-200/90 text-xl font-medium">कृषि मित्र</p>
        <p className="text-white/60 text-sm mt-2 max-w-xs leading-relaxed">
          Join thousands of farmers getting smart crop advice
        </p>
      </div>

      <div className="relative z-10 overflow-y-auto max-h-[60vh]">
        <div className="absolute -top-6 left-0 right-0 h-12 bg-gradient-to-t from-earth-50/95 to-transparent" />
        <div className="bg-earth-50/95 backdrop-blur-xl rounded-t-[2.5rem] p-6 pb-10 shadow-2xl shadow-black/10">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-amber-500 rounded-full" />
              <div>
                <h2 className="font-sora text-xl font-bold text-soil-900">Create Account</h2>
                <p className="text-soil-400 text-xs mt-0.5">नया खाता – Register as a farmer</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="group">
                <label className="block text-xs font-semibold text-soil-600 mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <User size="15" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soil-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full pl-10 pr-4 py-3.5 bg-white border-2 border-earth-100 rounded-xl text-sm text-soil-900 placeholder:text-soil-300 font-medium
                               focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-soil-600 mb-1.5 ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone size="15" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soil-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10 digit number"
                    required
                    className="w-full pl-10 pr-4 py-3.5 bg-white border-2 border-earth-100 rounded-xl text-sm text-soil-900 placeholder:text-soil-300 font-medium
                               focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="group">
                  <label className="block text-xs font-semibold text-soil-600 mb-1.5 ml-1">State</label>
                  <div className="relative">
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-3 py-3.5 bg-white border-2 border-earth-100 rounded-xl text-sm text-soil-900 font-medium appearance-none
                                 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                    >
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                    <ChevronDown size="14" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-soil-400 pointer-events-none" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-soil-600 mb-1.5 ml-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="e.g., Indore"
                    required
                    className="w-full px-3 py-3.5 bg-white border-2 border-earth-100 rounded-xl text-sm text-soil-900 placeholder:text-soil-300 font-medium
                               focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-soil-600 mb-1.5 ml-1">Village</label>
                <div className="relative">
                  <MapPin size="15" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soil-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="text"
                    name="village"
                    value={form.village}
                    onChange={handleChange}
                    placeholder="Your village name"
                    required
                    className="w-full pl-10 pr-4 py-3.5 bg-white border-2 border-earth-100 rounded-xl text-sm text-soil-900 placeholder:text-soil-300 font-medium
                               focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="group">
                  <label className="block text-xs font-semibold text-soil-600 mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 6 chars"
                      required
                      className="w-full pl-3.5 pr-10 py-3.5 bg-white border-2 border-earth-100 rounded-xl text-sm text-soil-900 placeholder:text-soil-300 font-medium
                                 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-soil-400 hover:text-soil-600 transition-colors"
                    >
                      {showPw ? <EyeOff size="16" /> : <Eye size="16" />}
                    </button>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-soil-600 mb-1.5 ml-1">Confirm</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter"
                    required
                    className="w-full px-3.5 py-3.5 bg-white border-2 border-earth-100 rounded-xl text-sm text-soil-900 placeholder:text-soil-300 font-medium
                               focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-red-600 text-xs text-center font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-60 text-white font-bold rounded-xl text-sm
                           shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1 text-sm text-emerald-700 font-semibold hover:text-emerald-600 transition-colors group">
                <span>Already have account? Sign In</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
