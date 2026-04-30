import { useState } from 'react'
import { useApp } from '../context/useApp'
import { useDerivedStats } from '../context/appState'
import { BottomNav } from './Dashboard'

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year, month) {
  // 0=Mon offset
  const day = new Date(year, month, 1).getDay()
  return (day + 6) % 7
}

export default function Calendar() {
  const { state } = useApp()
  const { bits } = state
  const { streak } = useDerivedStats(bits)

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const daysInMonth = getDaysInMonth(year, month)
  const offset = getFirstDayOfWeek(year, month)

  // count completions per day
  const completionCount = {}
  bits.forEach(b => {
    Object.keys(b.completions || {}).forEach(iso => {
      const d = new Date(iso)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        completionCount[day] = (completionCount[day] || 0) + 1
      }
    })
  })

  const maxCount = Math.max(...Object.values(completionCount), 1)
  const getLevel = count => {
    if (!count) return 0
    const ratio = count / maxCount
    if (ratio < 0.33) return 1
    if (ratio < 0.66) return 2
    return 3
  }
  const dayColors = ['', 'bg-[#C4B5FD] text-white', 'bg-[#6ECFB0] text-white', 'bg-[#6B8DD6] text-white']

  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const todayDay = now.getFullYear() === year && now.getMonth() === month ? now.getDate() : null

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  // longest streak calc
  let longestStreak = 0, cur = 0
  const allDates = new Set(bits.flatMap(b => Object.keys(b.completions || {})))
  const d = new Date(year, month, 1)
  for (let i = 1; i <= daysInMonth; i++) {
    d.setDate(i)
    if (allDates.has(d.toISOString().slice(0, 10))) { cur++; longestStreak = Math.max(longestStreak, cur) }
    else cur = 0
  }

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-20">
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-black text-primary">Calendar 📅</h1>
      </div>

      <div className="px-6 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="text-secondary text-lg px-2">‹</button>
            <span className="font-semibold text-primary">{monthName}</span>
            <button onClick={nextMonth} className="text-secondary text-lg px-2">›</button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className="text-center text-xs text-secondary font-semibold">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: offset }, (_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const level = getLevel(completionCount[day])
              const isToday = day === todayDay
              return (
                <div key={day} className={`aspect-square rounded-full flex items-center justify-center text-xs font-semibold
                  ${level > 0 ? dayColors[level] : 'text-secondary'}
                  ${isToday ? 'ring-2 ring-[#6B8DD6]' : ''}`}>
                  {day}
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-secondary">
            {[['None','bg-gray-200'],['Low','bg-[#C4B5FD]'],['Medium','bg-[#6ECFB0]'],['High','bg-[#6B8DD6]']].map(([label, bg]) => (
              <span key={label} className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded-sm ${bg}`} />{label}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] p-5 text-white">
          <p className="text-sm font-medium opacity-80">Current Streak</p>
          <p className="text-3xl font-black mt-1">{streak} Days 🔥</p>
          <p className="text-sm opacity-70 mt-1">
            {longestStreak > 0 ? `Your longest streak this month is ${longestStreak} days. Keep going!` : 'Start your streak today!'}
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
