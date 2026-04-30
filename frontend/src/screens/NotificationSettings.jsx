import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import Button from '../components/Button'
import { useApp } from '../context/useApp'
import { api } from '../api'

export default function NotificationSettings() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const s = state.notifSettings || {}

  const [enabled, setEnabled] = useState(s.enabled ?? true)
  const [time, setTime] = useState(s.time || state.reminderTime || '08:00')
  const [types, setTypes] = useState({ daily: s.daily ?? true, weekly: s.weekly ?? true, achievements: s.achievements ?? true })
  const [quietStart, setQuietStart] = useState(s.quietStart || '22:00')
  const [quietEnd, setQuietEnd] = useState(s.quietEnd || '07:00')

  const toggleType = key => setTypes(t => ({ ...t, [key]: !t[key] }))

  const handleSave = async () => {
    const settings = { enabled, time, ...types, quietStart, quietEnd }
    dispatch({ type: 'SET_NOTIF_SETTINGS', settings })
    await api.settings.update({ notif_settings: settings })
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-24">
      <div className="px-6 pt-6">
        <BackHeader title="Notifications" />
      </div>

      <div className="px-6 space-y-5">
        <div className="bg-[#EEF0FB] rounded-2xl p-4 flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white flex-shrink-0">🔔</div>
          <div>
            <p className="text-sm font-semibold text-primary">Stay on track</p>
            <p className="text-xs text-secondary">Customize how and when you receive reminders for your bits</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Enable Notifications</p>
            <p className="text-xs text-secondary">Master switch for all notifications</p>
          </div>
          <button onClick={() => setEnabled(v => !v)} className={`w-11 h-6 rounded-full transition-all ${enabled ? 'bg-[#6B8DD6]' : 'bg-gray-200'} relative`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">DEFAULT REMINDER TIME</label>
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-secondary">🕐</span>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="flex-1 outline-none text-sm text-primary bg-transparent" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">NOTIFICATION TYPES</label>
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
            {[['daily','Daily Reminders','Get reminded to complete your bits'],
              ['weekly','Weekly Reports','Summary of your weekly progress'],
              ['achievements','Achievements','Celebrate milestones and streaks']].map(([key, label, sub]) => (
              <div key={key} className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-primary">{label}</p>
                  <p className="text-xs text-secondary">{sub}</p>
                </div>
                <button onClick={() => toggleType(key)} className={`w-11 h-6 rounded-full transition-all ${types[key] ? 'bg-[#6B8DD6]' : 'bg-gray-200'} relative flex-shrink-0`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${types[key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">QUIET HOURS</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-3">
              <p className="text-xs text-secondary mb-1">START</p>
              <input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)} className="text-sm text-primary bg-transparent outline-none w-full" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-3">
              <p className="text-xs text-secondary mb-1">END</p>
              <input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)} className="text-sm text-primary bg-transparent outline-none w-full" />
            </div>
          </div>
          <p className="text-xs text-secondary mt-2 px-1">No notifications will be sent during quiet hours</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 pb-6 pt-3 bg-bg">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}
