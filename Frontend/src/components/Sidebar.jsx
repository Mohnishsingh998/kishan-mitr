import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Sprout, CloudSun, TrendingUp, Bug,
  Landmark, User, ChevronLeft, Menu, Leaf
} from 'lucide-react'

// All colors hardcoded so sidebar is never invisible regardless of Tailwind JIT
const C = {
  bg:          '#14532d', // leaf-900
  border:      '#15803d', // leaf-700
  activeBg:    '#15803d', // leaf-700
  hoverBg:     '#166534', // leaf-800
  iconAccent:  '#dc9a3a', // earth-400
  textPrimary: '#ffffff',
  textMuted:   '#bbf7d0', // leaf-200
  textSubtle:  '#86efac', // leaf-300
  avatarBg:    '#c97f1e', // earth-500
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard',      labelHindi: 'डैशबोर्ड' },
  { to: '/advisory',  icon: Sprout,          label: 'Crop Advisory',  labelHindi: 'फसल सलाह' },
  { to: '/weather',   icon: CloudSun,        label: 'Weather',        labelHindi: 'मौसम' },
  { to: '/market',    icon: TrendingUp,      label: 'Market Prices',  labelHindi: 'बाजार भाव' },
  { to: '/pests',     icon: Bug,             label: 'Pests & Disease',labelHindi: 'कीट रोग' },
  { to: '/schemes',   icon: Landmark,        label: 'Gov. Schemes',   labelHindi: 'सरकारी योजना' },
  { to: '/profile',   icon: User,            label: 'My Profile',     labelHindi: 'प्रोफाइल' },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const [hovered, setHovered] = useState(null)

  return (
    <aside
      style={{
        position: 'fixed', left: 0, top: 0, height: '100%', zIndex: 30,
        background: C.bg, color: C.textPrimary,
        width: collapsed ? 64 : 256,
        transition: 'width 300ms ease-in-out',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {/* Logo row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '20px 0' : '20px 16px',
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
      }}>
        {/* Icon */}
        <div style={{
          width: 32, height: 32, background: C.iconAccent,
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Leaf size={16} color="#fff" />
        </div>

        {!collapsed && (
          <>
            <div style={{ marginLeft: 10, flex: 1 }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>
                KrishiMitra
              </div>
              <div style={{ color: C.textMuted, fontSize: 11, lineHeight: 1.2 }}>कृषि मित्र</div>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textSubtle, padding: 4 }}
            >
              <ChevronLeft size={18} />
            </button>
          </>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.textSubtle, padding: '12px 0',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Menu size={18} />
        </button>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label, labelHindi }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            style={{ textDecoration: 'none', display: 'block', margin: '2px 8px' }}
          >
            {({ isActive }) => (
              <div
                onMouseEnter={() => setHovered(to)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: collapsed ? 0 : 12,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '10px 0' : '10px 12px',
                  borderRadius: 8,
                  background: isActive ? C.activeBg : hovered === to ? C.hoverBg : 'transparent',
                  transition: 'background 150ms',
                  cursor: 'pointer',
                }}
              >
                <Icon
                  size={18}
                  color={isActive ? '#ffffff' : C.textMuted}
                  style={{ flexShrink: 0 }}
                />
                {!collapsed && (
                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: 500, lineHeight: 1.3,
                      color: isActive ? '#ffffff' : C.textMuted,
                    }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 11, color: C.textSubtle, lineHeight: 1.2 }}>
                      {labelHindi}
                    </div>
                  </div>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom user strip */}
      {!collapsed && (
        <div style={{
          borderTop: `1px solid ${C.border}`,
          padding: 16, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: C.avatarBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              RP
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Ramesh Patidar
              </div>
              <div style={{ fontSize: 11, color: C.textSubtle }}>Badnawar, Dhar</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}