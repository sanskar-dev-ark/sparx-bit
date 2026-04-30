import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import { useApp } from '../context/useApp'

const rewards = [
  { milestone: '3 friends join', reward: '1 month free', color: 'bg-[#DBEAFE] text-[#1E3A8A]' },
  { milestone: '5 friends join', reward: '3 months free', color: 'bg-[#D1FAE5] text-[#065F46]' },
  { milestone: '10 friends join', reward: '1 year free', color: 'bg-[#FEE2E2] text-[#991B1B]' },
]

export default function Referral() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [copied, setCopied] = useState(false)
  const initials = (state.user.name || state.user.email || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const refLink = `compoundgrowth.app/ref/${initials}2026`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${refLink}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Sparx Bit', text: 'Join me on Sparx Bit!', url: `https://${refLink}` })
    } else {
      handleCopy()
    }
  }

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-10">
      <div className="px-6 pt-6">
        <BackHeader title="Referral Program" />
      </div>
      <div className="px-6 space-y-4">
        <div className="flex flex-col items-center text-center mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-2xl text-white mb-3 shadow-md">🎁</div>
          <h2 className="text-xl font-black text-primary">Invite Friends, Get Rewards</h2>
          <p className="text-secondary text-sm mt-1">Share Sparx Bit with friends and earn premium features</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-secondary tracking-widest mb-2">YOUR REFERRAL LINK</p>
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm text-primary truncate">{refLink}</span>
            <button onClick={handleCopy} className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white flex-shrink-0">
              {copied ? '✓' : '⧉'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleShare} className="bg-white border border-gray-200 rounded-2xl py-3 text-sm font-semibold text-primary flex items-center justify-center gap-2 shadow-sm">
            ↗ Share Link
          </button>
          <button onClick={() => window.open(`mailto:?subject=Join Sparx Bit&body=Use my referral link: https://${refLink}`)}
            className="bg-white border border-gray-200 rounded-2xl py-3 text-sm font-semibold text-primary flex items-center justify-center gap-2 shadow-sm">
            👤 Invite via Email
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="font-semibold text-primary mb-3">Your Stats</p>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[['12','INVITED','text-[#6B8DD6]'],['8','JOINED','text-[#6ECFB0]'],['4','ACTIVE','text-orange-500']].map(([val, label, color]) => (
              <div key={label} className="flex flex-col items-center gap-1 px-2">
                <span className={`text-2xl font-black ${color}`}>{val}</span>
                <span className="text-[10px] text-secondary font-semibold tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#EEF0FB] rounded-2xl p-4">
          <p className="font-semibold text-primary mb-3">🎁 Your Rewards</p>
          <div className="space-y-2">
            {rewards.map(({ milestone, reward, color }) => (
              <div key={milestone} className="flex items-center justify-between">
                <span className="text-sm text-secondary">{milestone}</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${color}`}>{reward}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/create-promo')} className="w-full py-4 text-center text-sm font-semibold text-secondary border-t border-gray-200">
          Create Promotion
        </button>
      </div>
    </div>
  )
}
