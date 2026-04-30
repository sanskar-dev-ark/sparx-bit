import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { BottomNav } from './Dashboard'
import { useApp } from '../context/useApp'
import { useDerivedStats } from '../context/appState'
import { auth } from '../firebase'

function EditProfileModal({ user, onSave, onClose }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className="font-black text-primary text-lg">Edit Profile</h3>
          <button onClick={onClose} className="text-secondary text-xl">✕</button>
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">NAME</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">EMAIL</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-primary outline-none" />
        </div>
        <button onClick={() => onSave({ name, email })}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] text-white font-semibold">
          Save Changes
        </button>
      </div>
    </div>
  )
}

const menuItems = [
  { icon: '⚙', label: 'Settings', path: '/settings' },
  { icon: '🔔', label: 'Notifications', path: '/notification-settings' },
  { icon: '👑', label: 'Premium', path: '/premium' },
  { icon: '↗', label: 'Referrals', path: '/referral' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const { user, bits } = state
  const { streak } = useDerivedStats(bits)
  const [showEdit, setShowEdit] = useState(false)

  const initials = (user.name || user.email || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const avgRate = bits.length === 0 ? 0 : Math.round(
    bits.reduce((sum, b) => {
      const total = Object.keys(b.completions || {}).length
      const weeks = Math.max(1, Math.ceil(total / 7))
      return sum + Math.min(100, Math.round((total / (weeks * b.goal)) * 100))
    }, 0) / bits.length
  )

  const handleSave = (data) => {
    dispatch({ type: 'UPDATE_USER', data })
    setShowEdit(false)
  }

  const handleSignOut = async () => {
    await signOut(auth)
    dispatch({ type: 'RESET' })
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-20">
      {showEdit && <EditProfileModal user={user} onSave={handleSave} onClose={() => setShowEdit(false)} />}

      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-black text-primary">Profile</h1>
      </div>

      <div className="px-6 space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] p-5 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center font-black text-xl">{initials}</div>
            <div>
              <p className="font-black text-lg">{user.name}</p>
              <p className="text-sm opacity-80">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/30">
            {[[String(bits.length),'Habits'],[String(streak),'Day Streak'],[`${avgRate}%`,'Success']].map(([val, label]) => (
              <div key={label} className="flex flex-col items-center px-2">
                <span className="font-black text-xl">{val}</span>
                <span className="text-xs opacity-75">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {streak >= 7 && (
          <div className="bg-[#EEF0FB] rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-semibold text-sm text-primary">{streak}-Day Streak Master</p>
              <p className="text-xs text-secondary">Keep it up! You're unstoppable</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {menuItems.map(({ icon, label, path }) => (
            <button key={label} onClick={() => navigate(path)} className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#EEF0FB] flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
              <span className="flex-1 text-sm font-semibold text-primary text-left">{label}</span>
              <span className="text-secondary text-lg">›</span>
            </button>
          ))}
        </div>

        <button onClick={() => setShowEdit(true)} className="w-full bg-white border border-gray-200 rounded-2xl py-4 text-sm font-semibold text-primary shadow-sm">
          Edit Profile
        </button>
        <button onClick={handleSignOut} className="w-full bg-[#FEE2E2] rounded-2xl py-4 text-sm font-semibold text-red-500 flex items-center justify-center gap-2">
          ↪ Sign Out
        </button>
        <p className="text-center text-xs text-secondary pb-2">Version 1.0.0 · Made with ❤️</p>
      </div>

      <BottomNav />
    </div>
  )
}
