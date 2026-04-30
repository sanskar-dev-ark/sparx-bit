import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import BackHeader from '../components/BackHeader'
import { useApp } from '../context/useApp'
import { api } from '../api'

const goals = [
  { id: 'health', label: 'Health & Fitness', icon: '🫀', bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]' },
  { id: 'career', label: 'Career Growth', icon: '💼', bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
  { id: 'mental', label: 'Mental Wellness', icon: '🧠', bg: 'bg-[#EDE9FE]', text: 'text-[#4C1D95]' },
  { id: 'family', label: 'Family Time', icon: '🏠', bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
  { id: 'social', label: 'Social Life', icon: '👥', bg: 'bg-[#DBEAFE]', text: 'text-[#1E3A8A]' },
  { id: 'growth', label: 'Personal Growth', icon: '✦', bg: 'bg-[#FEF9C3]', text: 'text-[#713F12]' },
]

export default function GoalSelection() {
  const { dispatch } = useApp()
  const [selected, setSelected] = useState(new Set())
  const navigate = useNavigate()

  const toggle = id => setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const handleContinue = async () => {
    const goals = [...selected]
    dispatch({ type: 'SET_USER_GOALS', goals })
    await api.settings.update({ goals })
    navigate('/preferences')
  }

  return (
    <div className="min-h-screen bg-bg px-6 pt-6 pb-10 max-w-sm mx-auto flex flex-col">
      <BackHeader title="Your Goals" />
      <h2 className="text-2xl font-black text-primary mb-1">What areas do you want to improve?</h2>
      <p className="text-secondary text-sm mb-6">Select all that apply. We'll help you create bits for each.</p>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {goals.map(({ id, label, icon, bg, text }) => (
          <button
            key={id}
            onClick={() => toggle(id)}
            className={`${bg} rounded-2xl p-5 flex flex-col items-start gap-3 transition-all ${selected.has(id) ? 'ring-2 ring-[#6B8DD6] ring-offset-1' : ''}`}
          >
            <span className="text-2xl">{icon}</span>
            <span className={`text-sm font-semibold ${text}`}>{label}</span>
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
