import React, { useState } from 'react'
import { User, MapPin, Droplets, Layers, Phone, Edit2, Check, X, Plus } from 'lucide-react'
import { mockFarmerProfile } from '../utils/mockData'

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const f = mockFarmerProfile

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora text-2xl font-bold text-soil-900">My Profile</h1>
        <p className="text-soil-500 text-sm mt-1">प्रोफाइल – Your farm details and settings</p>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-2xl flex items-center justify-center text-white font-sora font-bold text-xl">
              {f.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="font-sora font-bold text-xl text-soil-900">{f.name}</h2>
              <p className="text-soil-400">{f.nameHindi}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-soil-500">
                <Phone size={11} />
                {f.phone}
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all
              ${editing ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100' : 'border-earth-200 text-soil-600 bg-earth-50 hover:bg-earth-100'}`}
          >
            {editing ? <><X size={12} /> Cancel</> : <><Edit2 size={12} /> Edit Profile</>}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: MapPin,  label: 'Village',     value: f.village },
            { icon: MapPin,  label: 'District',    value: f.district },
            { icon: Layers,  label: 'Total Land',  value: `${f.totalLand} ${f.landUnit}` },
            { icon: Droplets,label: 'Irrigation',  value: f.irrigationType },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-earth-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-soil-400 mb-1">
                <Icon size={11} />
                {label}
              </div>
              <p className="text-sm font-semibold text-soil-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial summary */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-4">Financial Overview</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-leaf-50 border border-leaf-100 rounded-xl p-3">
            <p className="text-xs text-leaf-600 mb-1">Annual Income</p>
            <p className="font-sora font-bold text-leaf-800">{f.annualIncome}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs text-amber-600 mb-1">Active Loans</p>
            <p className="font-sora font-bold text-amber-800">{f.loans}</p>
          </div>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-3">
            <p className="text-xs text-sky-600 mb-1">PM-KISAN</p>
            <p className="font-sora font-bold text-sky-800">Active</p>
          </div>
        </div>
      </div>

      {/* Land parcels */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sora font-semibold text-soil-800">My Fields</h3>
          <button className="flex items-center gap-1.5 text-xs font-medium text-leaf-700 bg-leaf-50 border border-leaf-200 rounded-lg px-3 py-1.5 hover:bg-leaf-100 transition-colors">
            <Plus size={12} /> Add Field
          </button>
        </div>
        <div className="space-y-3">
          {f.lands.map(land => (
            <div key={land.id} className="flex items-center gap-4 p-3 bg-earth-50 rounded-xl border border-earth-100">
              <div className="w-10 h-10 bg-leaf-100 rounded-xl flex items-center justify-center text-leaf-700 text-lg">
                🌾
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-soil-800">{land.name}</p>
                <p className="text-xs text-soil-400">{land.area} acres • {land.soilType} • {land.irrigation}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-soil-400">Last crop</p>
                <p className="text-sm font-medium text-soil-700">{land.lastCrop}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Soil type */}
      <div className="bg-white rounded-2xl border border-earth-100 p-5">
        <h3 className="font-sora font-semibold text-soil-800 mb-3">Soil Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-soil-100 flex items-center justify-center text-2xl">🪨</div>
          <div>
            <p className="font-semibold text-soil-800">{f.soilType} Soil</p>
            <p className="text-xs text-soil-500 mt-0.5">Highly suitable for soybean, cotton, wheat</p>
          </div>
          <button className="ml-auto text-xs text-leaf-700 font-medium border border-leaf-200 bg-leaf-50 px-3 py-1.5 rounded-lg hover:bg-leaf-100 transition-colors">
            Add Soil Test
          </button>
        </div>
      </div>

      {/* Sign out */}
      <button className="w-full py-3 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors">
        Sign Out
      </button>
    </div>
  )
}