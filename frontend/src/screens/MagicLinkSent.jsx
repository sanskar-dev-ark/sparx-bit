import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

export default function MagicLinkSent() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 text-center max-w-sm mx-auto">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center">
          <span className="text-3xl text-white">✉</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow">
          <span className="text-green-500 text-sm">✓</span>
        </div>
      </div>

      <h2 className="text-2xl font-black text-primary mb-2">Check your email!</h2>
      <p className="text-secondary text-sm mb-6">
        We've sent a magic link to your email.<br />Click the link to sign in securely.
      </p>

      <div className="w-full bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mb-6">
        {[{n:1, title:'Check your inbox', sub:'Look for an email from Sparx Bit'},
          {n:2, title:'Click the magic link', sub:"You'll be signed in automatically"}].map(({n,title,sub}) => (
          <div key={n} className="flex items-center gap-4 px-4 py-4">
            <div className="w-7 h-7 rounded-full bg-[#EEF0FB] flex items-center justify-center text-xs font-bold text-[#6B8DD6]">{n}</div>
            <div className="text-left">
              <p className="text-sm font-semibold text-primary">{title}</p>
              <p className="text-xs text-secondary">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full space-y-3">
        <Button onClick={() => navigate('/login')}>Back to Sign In</Button>
        <button onClick={() => navigate('/login')} className="w-full text-[#6B8DD6] font-semibold text-sm py-2">
          Didn't receive the email?
        </button>
      </div>
    </div>
  )
}
