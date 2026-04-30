import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { today } from '../context/appState'
import { api } from '../api'

const CAT_STYLE = {
  health: { bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]' },
  mind:   { bg: 'bg-[#EDE9FE]', text: 'text-[#4C1D95]' },
  work:   { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
  family: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
  none:   { bg: 'bg-gray-100',  text: 'text-gray-500' },
}

function getWeekDates() {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i)
    return { date: d.getDate(), iso: d.toISOString().slice(0, 10) }
  })
}

function calcStreak(completions) {
  let streak = 0
  const d = new Date()
  while (true) {
    const key = d.toISOString().slice(0, 10)
    if (completions[key]) { streak++; d.setDate(d.getDate() - 1) } else break
  }
  return streak
}

function calcSuccessRate(completions, goal) {
  const keys = Object.keys(completions || {})
  if (!keys.length) return 0
  const weeks = Math.max(1, Math.ceil(keys.length / 7))
  return Math.min(100, Math.round((keys.length / (weeks * goal)) * 100))
}

// Build last 35 days activity grid
function buildActivity(completions) {
  const rows = []
  const d = new Date()
  d.setDate(d.getDate() - 34)
  for (let r = 0; r < 5; r++) {
    const row = []
    for (let c = 0; c < 7; c++) {
      const key = d.toISOString().slice(0, 10)
      row.push(completions[key] ? (Math.random() > 0.5 ? 2 : 1) : 0)
      d.setDate(d.getDate() + 1)
    }
    rows.push(row)
  }
  return rows
}

const actColors = ['bg-gray-100', 'bg-[#C4B5FD]', 'bg-[#6ECFB0]']
const DAYS = ['M','T','W','T','F','S','S']

export default function BitDetail() {
  const { state, dispatch } = useApp()
  const { id } = useParams()
  const navigate = useNavigate()
  const bit = state.bits.find(b => b.id === Number(id))

  if (!bit) {
    navigate('/dashboard')
    return null
  }

  const completions = bit.completions || {}
  const cat = CAT_STYLE[bit.category] || CAT_STYLE.none
  const streak = calcStreak(completions)
  const weekDates = getWeekDates()
  const thisWeekDone = weekDates.filter(({ iso }) => completions[iso]).length
  const successRate = calcSuccessRate(completions, bit.goal)
  const activity = buildActivity(completions)

  const handleDelete = async () => {
    if (bit.id) await api.bits.delete(bit.id)
    dispatch({ type: 'DELETE_BIT', id: bit.id })
    navigate('/dashboard')
  }

  const toggleCompletion = async (date) => {
    dispatch({ type: 'TOGGLE_COMPLETION', bit_id: bit.id, date })
    try {
      await api.completions.toggle(bit.id, date)
    } catch {
      dispatch({ type: 'TOGGLE_COMPLETION', bit_id: bit.id, date })
    }
  }

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-10">
      <div className="flex items-center justify-between px-6 pt-6 mb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500">‹</button>
        <span className="font-semibold text-primary">Bit Details</span>
        <button onClick={() => navigate(`/edit-bit/${bit.id}`)} className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500">✎</button>
      </div>

      <div className="px-6 space-y-4">
        {/* Hero */}
        <div className={`${cat.bg} rounded-2xl p-5 flex items-start justify-between`}>
          <div>
            <h2 className={`text-xl font-black ${cat.text}`}>{bit.title}</h2>
            <p className={`text-sm ${cat.text} opacity-70 mb-2 capitalize`}>{bit.category}</p>
            {bit.why && <p className={`text-sm ${cat.text} italic`}>"{bit.why}"</p>}
          </div>
          <div className={`w-12 h-12 rounded-full ${cat.bg} border-2 border-white/50 flex items-center justify-center font-bold text-lg ${cat.text}`}>
            {bit.title[0]}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 grid grid-cols-3 divide-x divide-gray-100">
          {[['🔥 ' + streak, 'DAY STREAK'], [`${thisWeekDone}/${bit.goal}`, 'THIS WEEK'], [`${successRate}%`, 'SUCCESS RATE']].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center gap-1 px-2">
              <span className="text-xl font-black text-primary">{val}</span>
              <span className="text-[10px] text-secondary font-semibold tracking-wide">{label}</span>
            </div>
          ))}
        </div>

        {/* This week */}
        <div className="bg-white rounded-2xl p-4">
          <p className="font-semibold text-primary mb-3">This Week</p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS.map((d, i) => {
              const done = !!completions[weekDates[i].iso]
              const isToday = weekDates[i].iso === today()
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-secondary">{d}</span>
                  <button
                    onClick={() => toggleCompletion(weekDates[i].iso)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                      done ? 'bg-[#6B8DD6] border-[#6B8DD6] text-white' : isToday ? 'border-[#6B8DD6] text-[#6B8DD6]' : 'border-gray-200 text-secondary'
                    }`}
                  >
                    {done ? '✓' : weekDates[i].date}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Activity heatmap */}
        <div className="bg-white rounded-2xl p-4">
          <p className="font-semibold text-primary mb-3">Activity (last 35 days)</p>
          <div className="space-y-1.5">
            {activity.map((row, ri) => (
              <div key={ri} className="grid grid-cols-7 gap-1.5">
                {row.map((v, ci) => <div key={ci} className={`h-8 rounded-lg ${actColors[v]}`} />)}
              </div>
            ))}
          </div>
        </div>

        {(bit.description || bit.desc) && (
          <div className="bg-white rounded-2xl p-4">
            <p className="font-semibold text-primary mb-2">Description</p>
            <p className="text-sm text-secondary">{bit.description || bit.desc}</p>
          </div>
        )}

        <button onClick={() => navigate(`/edit-bit/${bit.id}`)} className="w-full bg-white border border-gray-200 rounded-2xl py-4 text-sm font-semibold text-primary flex items-center justify-center gap-2">
          ✎ Edit Bit
        </button>
        <button onClick={handleDelete} className="w-full bg-[#FEE2E2] rounded-2xl py-4 text-sm font-semibold text-red-500 flex items-center justify-center gap-2">
          🗑 Delete Bit
        </button>
      </div>
    </div>
  )
}
