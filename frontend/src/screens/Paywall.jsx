import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { api } from '../api'

const plans = [
  { id: 'monthly', label: 'Monthly', original: '$9.99', price: '$4.99', period: '/month', badge: 'Save 50%', badgeColor: 'bg-[#D1FAE5] text-[#065F46]', popular: false },
  { id: 'yearly', label: 'Yearly', original: '$119.88', price: '$39.99', period: '/year', badge: 'Save 67%', badgeColor: 'bg-[#D1FAE5] text-[#065F46]', popular: true },
  { id: 'lifetime', label: 'Lifetime', original: null, price: '$99.99', period: 'one-time', badge: 'Best Value', badgeColor: 'bg-[#DBEAFE] text-[#1E3A8A]', popular: false },
]

const included = ['Unlimited bits', 'Advanced analytics', 'Custom categories', 'Priority support', 'Export data', 'Ad-free experience']

export default function Paywall() {
  const { state, dispatch } = useApp()
  const [selected, setSelected] = useState(state.selectedPlan)
  const navigate = useNavigate()
  const selectedPlan = plans.find(p => p.id === selected)

  const handleContinue = async () => {
    dispatch({ type: 'SET_PLAN', plan: selected })
    await api.settings.update({ selected_plan: selected })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#6B8DD6] max-w-sm mx-auto pb-32">
      {/* Hero */}
      <div className="flex flex-col items-center text-center pt-10 pb-6 px-6">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl text-white mb-4">👑</div>
        <h2 className="text-2xl font-black text-white mb-1">Go Premium</h2>
        <p className="text-white/70 text-sm">Unlock unlimited bits and powerful features to reach your goals faster</p>
      </div>

      <div className="px-6 space-y-3">
        {/* Plans */}
        {plans.map(({ id, label, original, price, period, badge, badgeColor, popular }) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={`w-full bg-white rounded-2xl p-4 text-left relative transition-all ${selected === id ? 'ring-2 ring-[#6ECFB0]' : ''}`}
          >
            {popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                ✦ MOST POPULAR
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-primary">{label}</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  {original && <span className="text-xs text-secondary line-through">{original}</span>}
                  <span className="text-xl font-black text-[#6B8DD6]">{price}</span>
                  <span className="text-xs text-secondary">{period}</span>
                </div>
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1.5 ${badgeColor}`}>{badge}</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected === id ? 'bg-[#6B8DD6] border-[#6B8DD6]' : 'border-gray-300'}`}>
                {selected === id && <span className="text-white text-xs">✓</span>}
              </div>
            </div>
          </button>
        ))}

        {/* What's included */}
        <div className="bg-white rounded-2xl p-4">
          <p className="font-semibold text-primary mb-3 text-center">What's Included</p>
          <div className="space-y-2">
            {included.map(item => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#6ECFB0] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm text-primary">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="bg-white/10 rounded-2xl p-4 grid grid-cols-3 divide-x divide-white/20">
          {[['50K+','USERS'],['4.9★','RATING'],['95%','SUCCESS']].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center px-2">
              <span className="font-black text-white text-lg">{val}</span>
              <span className="text-white/60 text-[10px] font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 pb-6 pt-3 bg-[#6B8DD6]">
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] text-white font-semibold shadow-lg border border-white/30"
        >
          Continue with {selectedPlan?.label}
        </button>
        <div className="flex justify-center gap-4 mt-3">
          <button className="text-white/60 text-xs">Restore Purchase</button>
          <span className="text-white/30 text-xs">·</span>
          <button className="text-white/60 text-xs">Terms of Service</button>
        </div>
        <p className="text-center text-white/40 text-[10px] mt-2">Cancel anytime. Subscriptions auto-renew. Prices may vary by region.</p>
      </div>
    </div>
  )
}
