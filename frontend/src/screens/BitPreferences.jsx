import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import BackHeader from '../components/BackHeader'
import { useApp } from '../context/useApp'
import { api } from '../api'

const tags = [
  'Morning routines', 'Exercise', 'Meditation', 'Reading', 'Journaling',
  'Healthy eating', 'Drinking water', 'Sleep schedule', 'Learning new skills',
  'Time with family', 'Social activities', 'Gratitude practice',
]

export default function BitPreferences() {
  const { dispatch } = useApp()
  const [selected, setSelected] = useState(new Set())
  const navigate = useNavigate()

  const toggle = tag => setSelected(prev => {
    const next = new Set(prev)
    next.has(tag) ? next.delete(tag) : next.add(tag)
    return next
  })

  const handleContinue = async () => {
    const preferences = [...selected]
    dispatch({ type: 'SET_USER_PREFS', prefs: preferences })
    await api.settings.update({ preferences })
    navigate('/reminder')
  }

  return (
    <div className="min-h-screen bg-bg px-6 pt-6 pb-10 max-w-sm mx-auto flex flex-col">
      <BackHeader title="Bit Preferences" />
      <h2 className="text-2xl font-black text-primary mb-1">What bits interest you?</h2>
      <p className="text-secondary text-sm mb-6">We'll suggest bits based on your preferences</p>
      <div className="flex flex-wrap gap-2 flex-1">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`px-4 py-2 rounded-full text-sm border transition-all ${
              selected.has(tag)
                ? 'bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] text-white border-transparent'
                : 'bg-white border-gray-200 text-secondary'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="pt-6">
        <Button onClick={handleContinue} disabled={selected.size === 0}>
          Continue ({selected.size} selected)
        </Button>
      </div>
    </div>
  )
}
