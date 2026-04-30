import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-8 text-center">
      <div className="mb-8">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center mx-auto shadow-lg mb-6">
          <span className="text-5xl text-white">✦</span>
        </div>
        <h1 className="text-4xl font-black text-primary mb-3">Sparx Bit</h1>
        <p className="text-[#4B5563] text-lg leading-relaxed">
          Small bits. Big impact. Track your daily<br />progress and watch yourself grow.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <Button onClick={() => navigate('/login')}>
          <span className="flex items-center justify-center gap-2">✦ Get Started</span>
        </Button>
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full py-3 text-[#6B8DD6] font-semibold text-base"
        >
          View Demo
        </button>
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center">
        By continuing, you agree to our Terms of Service and<br />Privacy Policy
      </p>
    </div>
  )
}
