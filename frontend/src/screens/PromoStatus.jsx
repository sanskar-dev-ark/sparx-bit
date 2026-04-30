import BackHeader from '../components/BackHeader'
import { useApp } from '../context/useApp'

const SEED_PROMO = { title: 'Spring Sale - 50% Off', description: 'Get 50% off premium features for new sign-ups during our spring promotion', code: 'SPRING50', discount: 50, end_date: '2026-04-30' }
const SEED_SIGNUPS = [
  { init: 'S', name: 'Sarah M.', time: '2 hours ago' },
  { init: 'J', name: 'John D.', time: '5 hours ago' },
  { init: 'E', name: 'Emma W.', time: '1 day ago' },
  { init: 'M', name: 'Michael R.', time: '2 days ago' },
]

export default function PromoStatus() {
  const { state } = useApp()
  const promo = state.promos.length > 0 ? state.promos[state.promos.length - 1] : SEED_PROMO
  const description = promo.description || promo.desc
  const endDate = promo.end_date || promo.endDate

  const handleCopy = () => navigator.clipboard.writeText(`compoundgrowth.app/promo/${promo.code?.toLowerCase() || 'spring50'}`)

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-10">
      <div className="px-6 pt-6">
        <BackHeader title="Promotion Status" />
      </div>
      <div className="px-6 space-y-4">
        <div className="rounded-2xl bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] p-5 text-white relative">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">Active</span>
            {promo.code && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-lg font-semibold">{promo.code}</span>}
          </div>
          <h2 className="text-xl font-black mb-1">{promo.title}</h2>
          {description && <p className="text-sm opacity-80 mb-3">{description}</p>}
          {endDate && <p className="text-xs opacity-70">Ends: <span className="font-semibold">{endDate}</span></p>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[['👁','1.2K','VIEWS','bg-[#DBEAFE]'],['👥','89','SIGN-UPS','bg-[#D1FAE5]'],['📈','7.4%','CONV. RATE','bg-[#FEF3C7]']].map(([icon,val,label,bg]) => (
            <div key={label} className="bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center text-lg mb-1`}>{icon}</div>
              <p className="text-xl font-black text-primary">{val}</p>
              <p className="text-[10px] text-secondary font-semibold tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-secondary tracking-widest mb-2">PROMOTION LINK</p>
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm text-primary truncate">compoundgrowth.app/promo/{promo.code?.toLowerCase() || 'spring50'}</span>
            <button onClick={handleCopy} className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white flex-shrink-0">⧉</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="font-semibold text-primary mb-3">Recent Sign-ups</p>
          <div className="space-y-3">
            {SEED_SIGNUPS.map(({ init, name, time }) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{init}</div>
                <div className="flex-1"><p className="text-sm font-semibold text-primary">{name}</p><p className="text-xs text-secondary">{time}</p></div>
                <span className="text-xs bg-[#D1FAE5] text-[#065F46] px-3 py-1 rounded-full font-semibold">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
