import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, MapPin, Droplets, Layers, Phone, Edit2, X, Plus, LogOut, Save, Loader, XCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { authAPI, farmerAPI, soilAPI } from '../utils/api'

const SOIL_TYPES = ['Black Cotton', 'Loamy', 'Sandy Loam', 'Alluvial', 'Clay', 'Red', 'Laterite']
const IRRIGATION_TYPES = ['canal', 'borewell', 'rainfed', 'mixed', 'drip']
const INCOME_RANGES = ['below 1 lakh', '1-2 lakh', '2-5 lakh', '5-10 lakh', 'above 10 lakh']

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})
  const [lands, setLands] = useState([])
  const [showAddField, setShowAddField] = useState(false)
  const [showSoilTest, setShowSoilTest] = useState(false)
  const [soilTestLandId, setSoilTestLandId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [fieldForm, setFieldForm] = useState({ name: '', areaAcres: '', soilType: 'loamy', irrigationType: 'rainfed', lastCrop: '' })
  const [soilForm, setSoilForm] = useState({ soilPh: '', soilOrganicMatter: '' })
  const { user, token, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const farmerId = user?.id || localStorage.getItem('km_farmer_id')

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        nameHindi: user.nameHindi || '',
        village: user.village || '',
        district: user.district || '',
        state: user.state || '',
        pincode: user.pincode || '',
        irrigationType: user.irrigationType || 'rainfed',
        totalLandAcres: user.totalLandAcres || 0,
        annualIncomeRange: user.annualIncomeRange || '',
        soilType: user.soilType || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (farmerId && token) {
      farmerAPI.getLands(farmerId, token)
        .then(setLands)
        .catch(() => {})
    }
  }, [farmerId, token])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAddField = async (e) => {
    e.preventDefault()
    if (!fieldForm.name || !fieldForm.areaAcres) return
    setSubmitting(true)
    try {
      await farmerAPI.createLand(farmerId, {
        name: fieldForm.name,
        areaAcres: parseFloat(fieldForm.areaAcres),
        soilType: fieldForm.soilType,
        irrigationType: fieldForm.irrigationType,
        lastCrop: fieldForm.lastCrop || null,
      }, token)
      setShowAddField(false)
      setFieldForm({ name: '', areaAcres: '', soilType: 'loamy', irrigationType: 'rainfed', lastCrop: '' })
      const updated = await farmerAPI.getLands(farmerId, token)
      setLands(updated)
    } catch (err) {
      console.error('Add field error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddSoilTest = async (e) => {
    e.preventDefault()
    if (!soilTestLandId) return
    setSubmitting(true)
    try {
      await soilAPI.addSoilReport(soilTestLandId, {
        soilPh: parseFloat(soilForm.soilPh) || null,
        soilOrganicMatter: parseFloat(soilForm.soilOrganicMatter) || null,
      }, token)
      setShowSoilTest(false)
      setSoilForm({ soilPh: '', soilOrganicMatter: '' })
      setSoilTestLandId('')
    } catch (err) {
      console.error('Add soil test error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.name || '',
        nameHindi: user.nameHindi || '',
        village: user.village || '',
        district: user.district || '',
        state: user.state || '',
        pincode: user.pincode || '',
        irrigationType: user.irrigationType || 'rainfed',
        totalLandAcres: user.totalLandAcres || 0,
        annualIncomeRange: user.annualIncomeRange || '',
        soilType: user.soilType || '',
      })
    }
    setEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await authAPI.updateProfile(form, token)
      setEditing(false)
      window.location.reload()
    } catch (err) {
      console.error('Profile update error:', err)
    } finally {
      setSaving(false)
    }
  }

  const f = user

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora text-2xl font-bold text-soil-900">{t('profile.title')}</h1>
          <p className="text-soil-500 text-sm mt-1">{t('profile.subtitle')}</p>
        </div>
        <button
          onClick={() => editing ? handleCancel() : setEditing(true)}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all
            ${editing ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100' : 'border-earth-200 text-soil-600 bg-earth-50 hover:bg-earth-100'}`}
        >
          {editing ? <><X size={12} /> {t('profile.cancel')}</> : <><Edit2 size={12} /> {t('profile.edit')}</>}
        </button>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl flex items-center justify-center text-white font-sora font-bold text-xl">
              {(f?.name || 'F').split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div>
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder={t('profile.name')}
                    className="block w-full border border-earth-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-soil-900 focus:outline-none focus:ring-2 focus:ring-leaf-500"
                  />
                  <input
                    type="text"
                    value={form.nameHindi}
                    onChange={e => handleChange('nameHindi', e.target.value)}
                    placeholder={t('profile.nameHint')}
                    className="block w-full border border-earth-200 rounded-lg px-3 py-1.5 text-sm text-soil-400 focus:outline-none focus:ring-2 focus:ring-leaf-500"
                  />
                </div>
              ) : (
                <>
                  <h2 className="font-sora font-bold text-xl text-soil-900">{f?.name || 'Farmer'}</h2>
                  <p className="text-soil-400">{f?.nameHindi || ''}</p>
                </>
              )}
              <div className="flex items-center gap-1 mt-1 text-xs text-soil-500">
                <Phone size={11} />
                {f?.phone}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: MapPin,  label: t('profile.village'),    value: form.village,      field: 'village' },
            { icon: MapPin,  label: t('profile.district'),   value: form.district,     field: 'district' },
            { icon: Layers,  label: t('profile.totalLand'),  value: `${form.totalLandAcres || 0} acres`, field: 'totalLandAcres', type: 'number' },
            { icon: Droplets,label: t('profile.irrigation'), value: form.irrigationType, field: 'irrigationType', type: 'select', options: IRRIGATION_TYPES },
          ].map(({ icon: Icon, label, value, field, type, options }) => (
            <div key={label} className="bg-earth-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-soil-400 mb-1">
                <Icon size={11} />
                {label}
              </div>
              {editing ? (
                type === 'select' ? (
                  <select
                    value={form[field] || ''}
                    onChange={e => handleChange(field, e.target.value)}
                    className="w-full border border-earth-200 rounded-lg px-2 py-1 text-sm font-semibold text-soil-800 bg-white focus:outline-none focus:ring-2 focus:ring-leaf-500"
                  >
                    {options.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type || 'text'}
                    value={form[field] || ''}
                    onChange={e => handleChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                    className="w-full border border-earth-200 rounded-lg px-2 py-1 text-sm font-semibold text-soil-800 focus:outline-none focus:ring-2 focus:ring-leaf-500"
                  />
                )
              ) : (
                <p className="text-sm font-semibold text-soil-800">{value || '-'}</p>
              )}
            </div>
          ))}
        </div>

        {/* State / Pincode row */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-earth-50 rounded-xl p-3">
            <p className="text-xs text-soil-400 mb-1">{t('profile.state')}</p>
            {editing ? (
              <input
                type="text"
                value={form.state}
                onChange={e => handleChange('state', e.target.value)}
                className="w-full border border-earth-200 rounded-lg px-2 py-1 text-sm font-semibold text-soil-800 focus:outline-none focus:ring-2 focus:ring-leaf-500"
              />
            ) : (
              <p className="text-sm font-semibold text-soil-800">{f?.state || '-'}</p>
            )}
          </div>
          <div className="bg-earth-50 rounded-xl p-3">
            <p className="text-xs text-soil-400 mb-1">{t('profile.pincode')}</p>
            {editing ? (
              <input
                type="text"
                value={form.pincode}
                onChange={e => handleChange('pincode', e.target.value)}
                className="w-full border border-earth-200 rounded-lg px-2 py-1 text-sm font-semibold text-soil-800 focus:outline-none focus:ring-2 focus:ring-leaf-500"
              />
            ) : (
              <p className="text-sm font-semibold text-soil-800">{f?.pincode || '-'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Financial summary */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-4">Financial Overview</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-leaf-50 border border-leaf-100 rounded-xl p-3">
            <p className="text-xs text-leaf-600 mb-1">{t('profile.annualIncome')}</p>
            {editing ? (
              <select
                value={form.annualIncomeRange}
                onChange={e => handleChange('annualIncomeRange', e.target.value)}
                className="w-full border border-leaf-200 rounded-lg px-2 py-1 text-sm font-semibold text-leaf-800 bg-white focus:outline-none focus:ring-2 focus:ring-leaf-500"
              >
                <option value="">Select</option>
                {INCOME_RANGES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            ) : (
              <p className="font-sora font-bold text-leaf-800">{f?.annualIncomeRange || 'N/A'}</p>
            )}
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs text-amber-600 mb-1">{t('profile.activeLoans')}</p>
            <p className="font-sora font-bold text-amber-800">{f?.loans || 'N/A'}</p>
          </div>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-3">
            <p className="text-xs text-sky-600 mb-1">{t('profile.pmKisan')}</p>
            <p className="font-sora font-bold text-sky-800">{t('profile.active')}</p>
          </div>
        </div>
      </div>

      {/* Land parcels */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sora font-semibold text-soil-800">{t('profile.myFields')}</h3>
          <button
            onClick={() => setShowAddField(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-leaf-700 bg-leaf-50 border border-leaf-200 rounded-lg px-3 py-1.5 hover:bg-leaf-100 transition-colors"
          >
            <Plus size={12} /> {t('profile.addField')}
          </button>
        </div>
        <div className="space-y-3">
          {lands.length === 0 ? (
            <p className="text-sm text-soil-400 text-center py-4">{t('common.noData')}</p>
          ) : lands.map(land => (
            <div key={land.id} className="flex items-center gap-4 p-3 bg-earth-50 rounded-xl border border-earth-100">
              <div className="w-10 h-10 bg-leaf-100 rounded-xl flex items-center justify-center text-leaf-700 text-lg">
                🌾
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-soil-800">{land.name}</p>
                <p className="text-xs text-soil-400">{land.areaAcres || land.area} acres • {land.soilType} • {land.irrigationType || land.irrigation}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-soil-400">{t('profile.lastCrop')}</p>
                  <p className="text-sm font-medium text-soil-700">{land.lastCrop || 'N/A'}</p>
                </div>
                <button
                  onClick={() => { setSoilTestLandId(land.id); setShowSoilTest(true) }}
                  className="text-xs text-sky-700 border border-sky-200 bg-sky-50 px-2 py-1 rounded-lg hover:bg-sky-100 transition-colors"
                >
                  Soil Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Soil profile */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-3">{t('profile.soilProfile')}</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-soil-100 flex items-center justify-center text-2xl">🪨</div>
          <div>
            {editing ? (
              <select
                value={form.soilType}
                onChange={e => handleChange('soilType', e.target.value)}
                className="border border-earth-200 rounded-lg px-2 py-1 text-sm font-semibold text-soil-800 bg-white focus:outline-none focus:ring-2 focus:ring-leaf-500"
              >
                <option value="">Select soil type</option>
                {SOIL_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            ) : (
              <p className="font-semibold text-soil-800">{f?.soilType || 'N/A'} Soil</p>
            )}
            <p className="text-xs text-soil-500 mt-0.5">Highly suitable for soybean, cotton, wheat</p>
          </div>
          {lands.length > 0 && (
            <button
              onClick={() => { setSoilTestLandId(lands[0].id); setShowSoilTest(true) }}
              className="ml-auto text-xs text-leaf-700 font-medium border border-leaf-200 bg-leaf-50 px-3 py-1.5 rounded-lg hover:bg-leaf-100 transition-colors"
            >
              {t('profile.addSoilTest')}
            </button>
          )}
        </div>
      </div>

      {/* Save / Sign out */}
      {editing ? (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-leaf-600 hover:bg-leaf-700 disabled:bg-leaf-400 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? t('profile.saving') : t('profile.save')}
        </button>
      ) : (
        <button
          onClick={handleLogout}
          className="w-full py-3 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          {t('profile.signOut')}
        </button>
      )}

      {/* Add Field Modal */}
      {showAddField && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAddField(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sora font-semibold text-soil-800 text-lg">{t('profile.addField')}</h3>
              <button onClick={() => setShowAddField(false)}><XCircle size={20} className="text-soil-400" /></button>
            </div>
            <form onSubmit={handleAddField} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-soil-600 mb-1 block">Field Name</label>
                <input type="text" value={fieldForm.name} onChange={e => setFieldForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Main Field" required
                  className="w-full border border-earth-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-soil-600 mb-1 block">Area (acres)</label>
                  <input type="number" step="0.1" min="0.1" value={fieldForm.areaAcres} onChange={e => setFieldForm(p => ({ ...p, areaAcres: e.target.value }))}
                    placeholder="2.5" required
                    className="w-full border border-earth-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-soil-600 mb-1 block">Soil Type</label>
                  <select value={fieldForm.soilType} onChange={e => setFieldForm(p => ({ ...p, soilType: e.target.value }))}
                    className="w-full border border-earth-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500">
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-soil-600 mb-1 block">Irrigation</label>
                  <select value={fieldForm.irrigationType} onChange={e => setFieldForm(p => ({ ...p, irrigationType: e.target.value }))}
                    className="w-full border border-earth-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500">
                    {IRRIGATION_TYPES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-soil-600 mb-1 block">Last Crop</label>
                  <input type="text" value={fieldForm.lastCrop} onChange={e => setFieldForm(p => ({ ...p, lastCrop: e.target.value }))}
                    placeholder="e.g., Soybean"
                    className="w-full border border-earth-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500" />
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-2.5 bg-leaf-600 hover:bg-leaf-700 disabled:bg-leaf-400 text-white text-sm font-semibold rounded-xl transition-colors">
                {submitting ? 'Adding...' : 'Add Field'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Soil Test Modal */}
      {showSoilTest && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowSoilTest(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sora font-semibold text-soil-800 text-lg">Add Soil Test</h3>
              <button onClick={() => setShowSoilTest(false)}><XCircle size={20} className="text-soil-400" /></button>
            </div>
            <form onSubmit={handleAddSoilTest} className="space-y-3">
              <p className="text-xs text-soil-400 mb-2">Recording soil test for the selected field</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-soil-600 mb-1 block">Soil pH</label>
                  <input type="number" step="0.1" value={soilForm.soilPh} onChange={e => setSoilForm(p => ({ ...p, soilPh: e.target.value }))}
                    placeholder="6.5"
                    className="w-full border border-earth-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-soil-600 mb-1 block">Organic Matter (%)</label>
                  <input type="number" step="0.1" value={soilForm.soilOrganicMatter} onChange={e => setSoilForm(p => ({ ...p, soilOrganicMatter: e.target.value }))}
                    placeholder="0.8"
                    className="w-full border border-earth-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500" />
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white text-sm font-semibold rounded-xl transition-colors">
                {submitting ? 'Saving...' : 'Save Soil Test'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
