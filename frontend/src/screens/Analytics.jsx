import { useApp } from '../context/useApp'
import { useDerivedStats } from '../context/appState'
import { BottomNav } from './Dashboard'

const CAT_STYLE = {
  health: { bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]', dot: 'bg-green-500', label: 'Health' },
  mind:   { bg: 'bg-[#EDE9FE]', text: 'text-[#4C1D95]', dot: 'bg-purple-500', label: 'Mind' },
  work:   { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', dot: 'bg-red-400', label: 'Work' },
  family: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', dot: 'bg-yellow-400', label: 'Family' },
  none:   { bg: 'bg-gray-100',  text: 'text-gray-500',  dot: 'bg-gray-400', label: 'Other' },
}

function getWeekDates() {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

export default function Analytics() {
  const { state } = useApp()
  const { bits } = state
  const { streak, bitsWithStreak } = useDerivedStats(bits)
  const weekDates = getWeekDates()

  // overall avg rate
  const avgRate = bits.length === 0 ? 0 : Math.round(
    bits.reduce((sum, b) => {
      const total = Object.keys(b.completions || {}).length
      const weeks = Math.max(1, Math.ceil(total / 7))
      return sum + Math.min(100, Math.round((total / (weeks * b.goal)) * 100))
    }, 0) / bits.length
  )

  const totalCompletions = bits.reduce((s, b) => s + Object.keys(b.completions || {}).length, 0)

  // per-day completion count for bar chart
  const barData = weekDates.map(iso => bits.filter(b => b.completions?.[iso]).length)
  const maxBar = Math.max(...barData, 1)

  // by category
  const catMap = {}
  bits.forEach(b => {
    const key = b.category || 'none'
    if (!catMap[key]) catMap[key] = { bits: [], completions: 0 }
    catMap[key].bits.push(b)
    catMap[key].completions += Object.keys(b.completions || {}).length
  })
  const categories = Object.entries(catMap).map(([key, { bits: bs, completions: c }]) => {
    const totalPossible = bs.reduce((s, b) => s + Math.max(1, Math.ceil(Object.keys(b.completions || {}).length / 7)) * b.goal, 0)
    const pct = totalPossible ? Math.min(100, Math.round((c / totalPossible) * 100)) : 0
    return { key, label: CAT_STYLE[key]?.label || key, bits: bs.length, pct, dot: CAT_STYLE[key]?.dot || 'bg-gray-400' }
  })

  const bestBit = [...bitsWithStreak].sort((a, b) => b.streak - a.streak)[0]

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-20">
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-black text-primary">Analytics 📊</h1>
      </div>

      <div className="px-6 space-y-4">
        {/* Top stats */}
        <div className="grid grid-cols-3 gap-3">
          {[['📈', `${avgRate}%`, 'AVG RATE', 'bg-[#DBEAFE]'],
            ['🔥', String(streak), 'STREAK', 'bg-[#D1FAE5]'],
            ['🏅', String(totalCompletions), 'TOTAL', 'bg-[#FEF3C7]']].map(([icon, val, label, bg]) => (
            <div key={label} className="bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center text-lg mb-1`}>{icon}</div>
              <p className="text-xl font-black text-primary">{val}</p>
              <p className="text-[10px] text-secondary font-semibold tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* Weekly report */}
        {bits.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-semibold text-primary mb-3">Weekly Report</p>
            <div className="flex justify-end gap-2 mb-2">
              {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="w-5 text-center text-[10px] text-secondary font-semibold">{d}</span>)}
            </div>
            <div className="space-y-2">
              {bitsWithStreak.map(bit => {
                const cat = CAT_STYLE[bit.category] || CAT_STYLE.none
                const weekDone = weekDates.filter(iso => bit.completions?.[iso]).length
                return (
                  <div key={bit.id} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg ${cat.bg} ${cat.text} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                      {bit.title[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary truncate">{bit.title}</p>
                      <p className="text-[10px] text-secondary">{weekDone}/7</p>
                    </div>
                    <div className="flex gap-1">
                      {weekDates.map((iso, i) => (
                        <div key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${bit.completions?.[iso] ? 'bg-[#6B8DD6] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {bit.completions?.[iso] ? '✓' : '×'}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#6ECFB0] w-8 text-right">
                      {weekDone > 0 ? Math.round((weekDone / 7) * 100) + '%' : '0%'}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-secondary">Week Average</span>
              <span className="text-xs font-bold text-[#6B8DD6]">{avgRate}%</span>
            </div>
          </div>
        )}

        {/* Bar chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="font-semibold text-primary mb-4">This Week</p>
          <div className="flex items-end gap-2 h-24">
            {barData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[#6B8DD6] to-[#6ECFB0] opacity-80"
                  style={{ height: `${Math.round((h / maxBar) * 100)}%`, minHeight: h > 0 ? '8px' : '0' }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <span key={d} className="text-[10px] text-secondary flex-1 text-center">{d}</span>
            ))}
          </div>
        </div>

        {/* By category */}
        {categories.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-semibold text-primary mb-3">By Category</p>
            <div className="space-y-3">
              {categories.map(({ key, label, bits: bc, pct, dot }) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-primary flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      {label} <span className="text-secondary text-xs">({bc} bits)</span>
                    </span>
                    <span className="text-sm font-bold text-[#6B8DD6]">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${dot} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best bit */}
        {bestBit && (
          <div className="rounded-2xl bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] p-5 text-white">
            <p className="text-sm font-semibold mb-1">🏆 Best Performing Bit</p>
            <p className="text-xl font-black mb-1">{bestBit.title}</p>
            <p className="text-sm opacity-80">{Object.keys(bestBit.completions || {}).length}-day total completions</p>
            <p className="text-sm mt-1">🔥 {bestBit.streak} day streak</p>
          </div>
        )}

        {bits.length === 0 && (
          <div className="text-center py-12 text-secondary">
            <p className="text-4xl mb-3">📊</p>
            <p className="font-semibold">No data yet</p>
            <p className="text-sm">Add some bits and start tracking!</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
