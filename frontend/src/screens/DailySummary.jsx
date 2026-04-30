import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useApp } from '../context/useApp'
import { useDerivedStats } from '../context/appState'

export default function DailySummary() {
  const { state } = useApp()
  const navigate = useNavigate()
  const { bits } = state
  const { completedToday, pct, streak, bitsWithStreak } = useDerivedStats(bits)

  const topBits = [...bitsWithStreak]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3)
    .map(b => {
      const total = Object.keys(b.completions || {}).length
      const rate = total ? Math.min(100, Math.round((total / Math.max(1, Math.ceil(total / 7)) / b.goal) * 100)) : 0
      return { ...b, rate }
    })

  const message = pct >= 80 ? 'Great Work Today! 🎉' : pct >= 50 ? 'Good Progress! 💪' : 'Keep Going! 🌱'

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-10">
      <div className="flex items-center px-6 pt-6 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500">‹</button>
        <span className="font-semibold text-primary mx-auto">Daily Summary</span>
        <div className="w-9" />
      </div>

      <div className="px-6 space-y-4">
        <div className="flex flex-col items-center text-center mb-2">
          <div className="relative w-28 h-28 mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center">
              <span className="text-3xl font-black text-white">{pct}%</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#6ECFB0] flex items-center justify-center text-white text-lg shadow">🏅</div>
          </div>
          <h2 className="text-2xl font-black text-primary mb-1">{message}</h2>
          <p className="text-secondary text-sm">You completed {completedToday} out of {bits.length} bits. Keep up the momentum!</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <p className="text-3xl font-black text-[#6B8DD6]">{completedToday}</p>
            <p className="text-xs text-secondary font-semibold tracking-widest mt-1">COMPLETED</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <p className="text-3xl font-black text-orange-500">{streak}</p>
            <p className="text-xs text-secondary font-semibold tracking-widest mt-1">DAY STREAK</p>
          </div>
        </div>

        <div className="bg-[#E0F7F4] rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-lg flex-shrink-0">📈</div>
          <div>
            <p className="font-semibold text-sm text-primary">You're on fire! 🔥</p>
            <p className="text-xs text-secondary mt-0.5">
              {streak > 0 ? `${streak}-day streak! Small steps lead to big changes!` : 'Start your streak today — complete a bit!'}
            </p>
          </div>
        </div>

        {topBits.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-semibold text-primary mb-3">Top Performing Bits</p>
            <div className="space-y-3">
              {topBits.map(({ id, title, streak: s }, i) => (
                <div key={id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white text-xs font-bold">{i + 1}</div>
                  <span className="flex-1 text-sm text-primary">{title}</span>
                  <span className="text-sm font-bold text-[#6ECFB0]">{s}d streak</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    </div>
  )
}
