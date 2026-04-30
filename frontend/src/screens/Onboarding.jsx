import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const slides = [
  {
    icon: '🎯',
    iconBg: 'from-[#FDDCB5] to-[#F9C784]',
    title: 'Set meaningful goals',
    desc: 'Create Bits that align with your values and watch them compound into lasting change.',
  },
  {
    icon: '📈',
    iconBg: 'from-[#B2EDE0] to-[#7EDDD0]',
    title: 'Track your progress',
    desc: 'Visualize your growth with beautiful charts and celebrate every milestone along the way.',
  },
  {
    icon: '⚡',
    iconBg: 'from-[#DDD6FE] to-[#C4B5FD]',
    title: 'Stay motivated',
    desc: 'Get daily reminders and insights that keep you focused on what matters most.',
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const isLast = step === slides.length - 1
  const { icon, iconBg, title, desc } = slides[step]

  return (
    <div className="min-h-screen bg-ob-bg flex flex-col max-w-sm mx-auto px-6">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-6 pb-4">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step
                ? 'w-8 bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0]'
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-5xl mb-6 shadow-md`}>
          {icon}
        </div>
        <h2 className="text-2xl font-black text-primary mb-3">{title}</h2>
        <p className="text-secondary text-sm leading-relaxed max-w-xs">{desc}</p>
      </div>

      {/* Actions */}
      <div className="pb-10 space-y-3">
        <Button onClick={() => isLast ? navigate('/goals') : setStep(s => s + 1)}>
          {isLast ? 'Get Started' : 'Next'}
        </Button>
        {!isLast && (
          <button
            onClick={() => navigate('/goals')}
            className="w-full text-secondary text-sm py-2"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
