import React, { useState } from 'react'
import { Bug, AlertTriangle, Upload, Search, MapPin, ChevronRight } from 'lucide-react'

const pests = [
  {
    id: 'P001', name: 'Fall Armyworm', nameHindi: 'फॉल आर्मीवर्म', crop: 'Maize',
    severity: 'high', region: 'Dhar, Khargone', reported: '2 days ago',
    symptoms: ['Leaf feeding damage', 'Frass (excrement) visible', 'Whorl damage'],
    treatment: ['Emamectin benzoate 5% SG @ 0.4g/L', 'Chlorantraniliprole 18.5 SC @ 0.4ml/L'],
    prevention: 'Use pheromone traps, early scouting, resistant varieties'
  },
  {
    id: 'P002', name: 'Yellow Mosaic Virus', nameHindi: 'येलो मोजेक वायरस', crop: 'Soybean',
    severity: 'medium', region: 'Indore, Ujjain', reported: '5 days ago',
    symptoms: ['Yellow patches on leaves', 'Mosaic pattern', 'Stunted growth'],
    treatment: ['Imidacloprid 70WS seed treatment', 'Control whitefly vector immediately'],
    prevention: 'Use YMV-resistant varieties, control vector insects'
  },
  {
    id: 'P003', name: 'Pink Bollworm', nameHindi: 'गुलाबी सुंडी', crop: 'Cotton',
    severity: 'medium', region: 'Mandsaur, Ratlam', reported: '1 week ago',
    symptoms: ['Damaged bolls', 'Rosy staining on lint', 'Entry/exit holes'],
    treatment: ['Profenofos 50EC @ 2ml/L', 'Spinosad 45SC @ 0.3ml/L'],
    prevention: 'Early sowing, Bt cotton, pheromone traps, timely harvest'
  },
]

const severityMeta = {
  high:   { label: 'High Alert',  color: 'bg-red-50 text-red-700 border-red-200',    dot: 'bg-red-500' },
  medium: { label: 'Watch',       color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  low:    { label: 'Low Risk',    color: 'bg-leaf-50 text-leaf-700 border-leaf-200',  dot: 'bg-leaf-500' },
}

export default function Pests() {
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('outbreaks')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora text-2xl font-bold text-soil-900">Pest & Disease</h1>
        <p className="text-soil-500 text-sm mt-1">कीट रोग – Outbreak alerts and identification</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-earth-100 rounded-xl p-1 gap-1">
        {[
          { id: 'outbreaks', label: 'Nearby Outbreaks' },
          { id: 'identify',  label: 'Identify Pest' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === t.id ? 'bg-white text-soil-900 shadow-sm' : 'text-soil-500 hover:text-soil-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'outbreaks' && (
        <div className="space-y-4">
          {/* Alert banner */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-800 text-sm">Active Outbreaks in Your Region</p>
              <p className="text-red-600 text-xs mt-0.5">3 pest outbreaks reported within 50km. Inspect your fields immediately.</p>
            </div>
          </div>

          {/* Pest list */}
          {pests.map(pest => {
            const meta = severityMeta[pest.severity]
            const isOpen = selected === pest.id
            return (
              <div key={pest.id} className="bg-white rounded-2xl border border-earth-100 overflow-hidden">
                <button
                  className="w-full p-5 text-left"
                  onClick={() => setSelected(isOpen ? null : pest.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${meta.dot}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-sora font-semibold text-soil-900">{pest.name}</h3>
                          <span className={`text-xs border rounded-full px-2 py-0.5 ${meta.color}`}>{meta.label}</span>
                        </div>
                        <p className="text-soil-400 text-sm">{pest.nameHindi} • Affects: {pest.crop}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-soil-400">
                          <MapPin size={10} />
                          {pest.region} • {pest.reported}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className={`text-soil-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-earth-50 pt-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-soil-500 uppercase tracking-wide mb-2">Symptoms</h4>
                      <ul className="space-y-1">
                        {pest.symptoms.map((s, i) => (
                          <li key={i} className="text-sm text-soil-700 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-soil-500 uppercase tracking-wide mb-2">Recommended Treatment</h4>
                      <ul className="space-y-1">
                        {pest.treatment.map((t, i) => (
                          <li key={i} className="text-sm text-soil-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-leaf-400 rounded-full mt-1.5 shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-earth-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-soil-600 mb-1">Prevention</p>
                      <p className="text-xs text-soil-600">{pest.prevention}</p>
                    </div>

                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                      Report Outbreak in My Field
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'identify' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-earth-100 p-5">
            <h3 className="font-sora font-semibold text-soil-800 mb-2">Upload Plant Photo</h3>
            <p className="text-soil-400 text-sm mb-4">Take a photo of affected leaves/stem to identify pest or disease</p>

            <div className="border-2 border-dashed border-earth-200 rounded-xl p-8 text-center hover:border-leaf-400 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto mb-3 text-soil-300" />
              <p className="text-sm font-medium text-soil-600">Tap to upload or take photo</p>
              <p className="text-xs text-soil-400 mt-1">Supports JPG, PNG up to 10MB</p>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-soil-600 mb-1">Affected Crop</label>
                <select className="w-full border border-earth-200 rounded-xl px-3 py-2.5 text-sm text-soil-800 bg-white focus:outline-none focus:ring-2 focus:ring-leaf-500">
                  <option>Select crop...</option>
                  <option>Soybean</option>
                  <option>Maize</option>
                  <option>Cotton</option>
                  <option>Wheat</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-soil-600 mb-1">Describe Symptoms</label>
                <textarea
                  placeholder="e.g., yellowing leaves, holes in leaf, white powder on surface..."
                  className="w-full border border-earth-200 rounded-xl px-3 py-2.5 text-sm text-soil-800 resize-none focus:outline-none focus:ring-2 focus:ring-leaf-500"
                  rows={3}
                />
              </div>
              <button className="w-full bg-leaf-600 hover:bg-leaf-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Search size={15} />
                Identify Pest / Disease
              </button>
            </div>
          </div>

          <div className="bg-leaf-50 border border-leaf-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-leaf-800 mb-1">💡 Tip for better results</p>
            <p className="text-xs text-leaf-700">Take close-up photos in good daylight. Photograph both sides of the affected leaf. Multiple photos from different angles improve identification accuracy.</p>
          </div>
        </div>
      )}
    </div>
  )
}