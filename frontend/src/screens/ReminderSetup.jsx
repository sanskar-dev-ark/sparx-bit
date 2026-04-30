import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import BackHeader from '../components/BackHeader'
import { useApp } from '../context/useApp'
import { api } from '../api'

const times = ['Morning', 'Afternoon', 'Evening', 'Night']

export default function ReminderSetup() {
  const { state, dispatch } = useApp()
  const [selected, setSelected] = useState(state.reminderPeriod)
  const [time, setTime] = useState(state.reminderTime)
  const navigate = useNavigate()

  const handleComplete = async () => {
    dispatch({ type: 'SET_REMINDER', time, period: selected })
    await api.settings.update({ reminder_time: time, reminder_period: selected })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg px-6 pt-6 pb-10 max-w-sm mx-auto flex flex-col">
      <BackHeader title="Daily Reminders" />
      <h2 className="text-2xl font-black text-primary mb-1">When should we remind you?</h2>
      <p className="text-secondary text-sm mb-6">Choose a time that works best for your daily bits</p>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-2xl text-white shadow-md">🔔</div>
      </div>
      <label className="block text-xs font-semibold text-secondary tracking-widest mb-3">TIME OF DAY</label>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {times.map(t => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`py-3 rounded-2xl text-sm font-semibold border transition-all ${selected === t ? 'bg-[#6B8DD6] text-white border-transparent' : 'bg-white border-gray-200 text-primary'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">SPECIFIC TIME</label>
      <input
        type="time"
        value={time}
        onChange={e => setTime(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-primary text-sm mb-6 outline-none"
      />
      <div className="bg-[#F3F4F6] rounded-2xl p-4 text-sm text-secondary mb-6">
        You can customize reminder times for each bit later. This is just your default preference.
      </div>
      <div className="mt-auto">
        <Button onClick={handleComplete}>Complete Setup</Button>
      </div>
    </div>
  )
}
