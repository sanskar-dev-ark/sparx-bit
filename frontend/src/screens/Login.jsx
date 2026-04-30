import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import Button from '../components/Button'
import BackHeader from '../components/BackHeader'
import { useApp } from '../context/useApp'
import { auth } from '../firebase'
import { api } from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { dispatch } = useApp()

  const handleMagicLink = async () => {
    if (!email.trim()) return setError('Please enter your email.')
    setLoading(true); setError('')
    try {
      const result = await api.auth.sendMagicLink(email)
      if (result.devLink) console.info('[magic-link dev]', result.devLink)
      localStorage.setItem('emailForSignIn', email)
      navigate('/magic-link')
    } catch (error) {
      console.error('[magic-link error]', {
        code: error.code,
        message: error.message,
      })
      setError(error.code ? `Failed to send magic link: ${error.code}` : 'Failed to send magic link. Try again.')
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setLoading(true); setError('')
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const user = result.user
      dispatch({ type: 'UPDATE_USER', data: { name: user.displayName || user.email?.split('@')[0] || 'User', email: user.email || '' } })
      navigate('/dashboard')
    } catch (error) {
      console.error('[google sign-in error]', {
        code: error.code,
        message: error.message,
      })
      setError(error.code === 'auth/popup-closed-by-user' ? 'Google sign-in was cancelled.' : 'Google sign-in failed. Try again.')
      setLoading(false)
    }
  }

  const handleApple = async () => {
    setLoading(true); setError('')
    try {
      const provider = new OAuthProvider('apple.com')
      provider.addScope('email')
      provider.addScope('name')
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      dispatch({ type: 'UPDATE_USER', data: { name: user.displayName || user.email?.split('@')[0] || 'User', email: user.email || '' } })
      navigate('/dashboard')
    } catch (error) {
      console.error('[apple sign-in error]', {
        code: error.code,
        message: error.message,
        email: error.email,
      })
      setError(error.code === 'auth/popup-closed-by-user' ? 'Apple sign-in was cancelled.' : `Apple sign-in failed${error.code ? `: ${error.code}` : ''}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg px-6 pt-6 pb-10 max-w-sm mx-auto">
      <BackHeader title="Welcome Back" />
      <h2 className="text-2xl font-black text-primary mb-1">Sign in to continue</h2>
      <p className="text-secondary text-sm mb-6">Choose your preferred sign-in method</p>

      <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">EMAIL ADDRESS</label>
      <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-4 gap-2">
        <span className="text-gray-400">✉</span>
        <input type="email" placeholder="you@example.com" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleMagicLink()}
          className="flex-1 outline-none text-sm bg-transparent text-primary placeholder-gray-400" />
      </div>

      <Button onClick={handleMagicLink} disabled={loading} className="mb-4">
        {loading ? 'Sending…' : 'Continue with Magic Link'}
      </Button>

      {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-secondary">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="space-y-3 mb-6">
        <Button variant="outline" onClick={handleGoogle} disabled={loading}>
          <span className="flex items-center justify-center gap-2">⊙ Continue with Google</span>
        </Button>
        <Button variant="dark" onClick={handleApple} disabled={loading}>
          <span className="flex items-center justify-center gap-2"> Continue with Apple</span>
        </Button>
      </div>

      <div className="bg-[#EEF0FB] rounded-2xl p-4 text-sm text-secondary">
        <span className="text-[#6B8DD6] font-semibold">Magic Link: </span>
        We'll send you a secure link to your email. Click it to sign in instantly—no password needed!
      </div>
    </div>
  )
}
