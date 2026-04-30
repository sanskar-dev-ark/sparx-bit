import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import Button from '../components/Button'

const features = [
  { icon: '⚡', label: 'Unlimited Bits', sub: 'Create as many bits as you need' },
  { icon: '📈', label: 'Advanced Analytics', sub: 'Deep insights into your progress' },
  { icon: '📅', label: 'Custom Categories', sub: 'Organize bits your way' },
  { icon: '🏅', label: 'Achievement Badges', sub: 'Unlock exclusive rewards' },
]

export default function UpgradePremium() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-24">
      <div className="px-6 pt-6">
        <BackHeader title="Premium" />
      </div>

      <div className="px-6 space-y-5">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-2xl text-white shadow-md">👑</div>
            <span className="absolute -top-1 -right-1 text-lg">✨</span>
          </div>
          <h2 className="text-2xl font-black text-primary mb-1">Upgrade to Premium</h2>
          <p className="text-secondary text-sm">Unlock all features and take your bit-building to the next level</p>
        </div>

        {/* Current plan */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-primary text-sm">Current Plan</p>
              <p className="text-xs text-secondary">Free Forever</p>
            </div>
            <span className="text-xs bg-gray-100 text-secondary px-2 py-1 rounded-lg font-semibold">FREE</span>
          </div>
          <p className="text-xs text-secondary">You have access to 3 bits. Upgrade to create unlimited bits and unlock premium features.</p>
        </div>

        {/* Features */}
        <div>
          <p className="font-semibold text-primary mb-3">Premium Features</p>
          <div className="space-y-3">
            {features.map(({ icon, label, sub }) => (
              <div key={label} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white flex-shrink-0">{icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary">{label}</p>
                  <p className="text-xs text-secondary">{sub}</p>
                </div>
                <span className="text-[#6ECFB0] font-bold">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-[#EEF0FB] rounded-2xl p-4 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">SM</div>
          <div>
            <p className="text-sm font-semibold text-primary">Sarah M.</p>
            <p className="text-yellow-400 text-sm mb-1">★★★★★</p>
            <p className="text-xs text-secondary italic">"Premium features helped me build 15 solid bits. The analytics are incredible! Best investment in myself."</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] p-5 text-white text-center">
          <p className="text-sm font-semibold opacity-80 mb-1">Limited Time Offer</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-sm line-through opacity-60">$9.99</span>
            <span className="text-4xl font-black">$4.99</span>
            <span className="text-sm opacity-80">/month</span>
          </div>
          <p className="text-sm opacity-80 mt-1">Save 50% on your first 3 months</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 pb-6 pt-3 bg-bg space-y-2">
        <Button onClick={() => navigate('/paywall')}>👑 Upgrade to Premium</Button>
        <button className="w-full text-secondary text-sm py-2">Maybe Later</button>
      </div>
    </div>
  )
}
