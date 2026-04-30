import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { TRANSLATIONS, today, useDerivedStats } from '../context/appState'
import { api } from '../api'

const CAT_STYLE = {
  health:  { bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]', letter: 'H', label: 'HEALTH' },
  mind:    { bg: 'bg-[#EDE9FE]', text: 'text-[#4C1D95]', letter: 'M', label: 'MIND' },
  work:    { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', letter: 'W', label: 'WORK' },
  family:  { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', letter: 'F', label: 'FAMILY' },
  none:    { bg: 'bg-gray-100',  text: 'text-gray-500',  letter: '?', label: 'NONE' },
}

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tabs = [
    { icon: '⌂', label: 'Home', path: '/dashboard' },
    { icon: '📅', label: 'Calendar', path: '/calendar' },
    { icon: '📈', label: 'Analytics', path: '/analytics' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ]
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 flex justify-around py-3 px-6 z-10">
      {tabs.map(({ icon, label, path }) => (
        <button key={label} onClick={() => navigate(path)} className={`flex flex-col items-center gap-0.5 ${pathname === path ? 'text-[#6B8DD6]' : 'text-[#6B7280]'}`}>
          <span className="text-xl">{icon}</span>
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  )
}

function getWeekDates() {
  const now = new Date()
  const day = now.getDay() // 0=Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { date: d.getDate(), iso: d.toISOString().slice(0, 10), isToday: d.toISOString().slice(0, 10) === today() }
  })
}

export default function Dashboard() {
  const { state, dispatch } = useApp()
  const { bits, user } = state
  const tr = TRANSLATIONS[state.language] || TRANSLATIONS.English
  const navigate = useNavigate()
  const { completedToday, pct, streak, bitsWithStreak } = useDerivedStats(bits)
  const t = today()
  const weekDates = getWeekDates()
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // days in current week that have at least one completion
  const weekCompletions = weekDates.map(({ iso }) => bits.some(b => b.completions?.[iso]))

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const initials = (user.name || user.email || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const toggleCompletion = async (bitId, date) => {
    dispatch({ type: 'TOGGLE_COMPLETION', bit_id: bitId, date })
    try {
      await api.completions.toggle(bitId, date)
    } catch {
      dispatch({ type: 'TOGGLE_COMPLETION', bit_id: bitId, date })
    }
  }

  if (bits.length === 0) {
    return (
      <div className="min-h-screen bg-bg max-w-sm mx-auto flex flex-col pb-20">
        <div className="flex items-start justify-between px-6 pt-8 pb-4">
          <div>
            <h1 className="text-2xl font-black text-primary">{tr.welcomeBack}</h1>
            <p className="text-secondary text-sm">{dateStr}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 rounded-3xl bg-[#EEF0FB] flex items-center justify-center text-4xl mb-4">✦</div>
          <h2 className="text-xl font-black text-primary mb-2">{state.language === 'English' ? 'No bits yet' : tr.todayBits}</h2>
          <p className="text-secondary text-sm mb-6 leading-relaxed">Start building your future, one bit at a time. Create your first bit to begin tracking.</p>
          <button onClick={() => navigate('/add-bit')} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] text-white font-semibold shadow-md mb-8">
            + {tr.addNew}
          </button>
          <div className="w-full space-y-3">
            {[['🎯','Set meaningful goals','Create bits that align with your values and life goals'],
              ['📈','Track your progress','Watch your consistency grow with streaks and statistics'],
              ['🔔','Stay motivated','Get daily reminders and celebrate your wins']].map(([icon, title, sub]) => (
              <div key={title} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm text-left">
                <div className="w-10 h-10 rounded-xl bg-[#EEF0FB] flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                <div><p className="font-semibold text-sm text-primary">{title}</p><p className="text-xs text-secondary">{sub}</p></div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto flex flex-col pb-20">
      <div className="flex items-start justify-between px-6 pt-8 pb-4">
        <div>
          <h1 className="text-2xl font-black text-primary">{tr.welcomeBack}</h1>
          <p className="text-secondary text-sm">{dateStr}</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3 px-6 mb-4">
        {[['＋','Add','bg-[#DBEAFE]',()=>navigate('/add-bit')],
          ['📅','Calendar','bg-[#FEF3C7]',()=>navigate('/calendar')],
          ['📈','Stats','bg-[#D1FAE5]',()=>navigate('/analytics')],
          ['🏅','Premium','bg-[#FEF9C3]',()=>navigate('/premium')]].map(([icon,label,bg,action]) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <button onClick={action} className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center text-xl`}>{icon}</button>
            <span className="text-xs text-secondary">{label}</span>
          </div>
        ))}
      </div>

      {/* Weekly strip */}
      <div className="mx-6 bg-white rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-sm text-primary">{state.language === 'English' ? 'This Week' : tr.todayProgress}</span>
          <span className="text-xs text-[#6B8DD6] font-semibold">
            Week {Math.ceil(new Date().getDate() / 7) + (new Date().getMonth() * 4)}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1">
              <span className="text-xs text-secondary">{d}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                weekDates[i].isToday ? 'bg-[#6B8DD6] text-white'
                : weekCompletions[i] ? 'bg-[#D1FAE5] text-[#065F46]'
                : 'text-secondary'
              }`}>
                {weekDates[i].date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress card */}
      <div className="mx-6 rounded-2xl bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] p-5 mb-4 text-white relative overflow-hidden cursor-pointer"
        onClick={() => navigate('/daily-summary')}>
        <p className="text-sm font-medium opacity-90 mb-1">{tr.todayProgress}</p>
        <p className="text-4xl font-black mb-3">{pct}%</p>
        <div className="flex gap-6 text-sm">
          <div><p className="opacity-75 text-xs">{tr.completed}</p><p className="font-bold">{completedToday}/{bits.length}</p></div>
          <div className="w-px bg-white opacity-30" />
          <div><p className="opacity-75 text-xs">{state.language === 'English' ? 'Current Streak' : tr.streak}</p><p className="font-bold">{streak} {tr.streak} 🔥</p></div>
        </div>
        <div className="absolute right-4 top-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">🔥</div>
      </div>

      {/* Today's Bits */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-primary">{tr.todayBits}</span>
          <button onClick={() => navigate('/add-bit')} className="text-[#6B8DD6] text-sm font-semibold">{tr.addNew}</button>
        </div>
        <div className="space-y-3">
          {bitsWithStreak.map(bit => {
            const cat = CAT_STYLE[bit.category] || CAT_STYLE.none
            const done = !!bit.completions?.[t]
            return (
              <div key={bit.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <button onClick={() => navigate(`/bit/${bit.id}`)} className={`w-12 h-12 rounded-xl ${cat.bg} ${cat.text} flex flex-col items-center justify-center flex-shrink-0`}>
                  <span className="font-bold text-sm">{cat.letter}</span>
                  <span className="text-[9px] font-semibold">{cat.label}</span>
                </button>
                <button onClick={() => navigate(`/bit/${bit.id}`)} className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-primary text-sm">{bit.title}</p>
                  <p className="text-xs text-secondary">{bit.why}</p>
                  <p className="text-xs text-orange-500 mt-0.5">🔥 Weekly · {bit.goal}x · {bit.streak}{tr.streak}</p>
                </button>
                <button
                  onClick={() => toggleCompletion(bit.id, t)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${done ? 'bg-[#6ECFB0] border-[#6ECFB0] text-white' : 'border-gray-300'}`}
                >
                  {done && <span className="text-xs">✓</span>}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
