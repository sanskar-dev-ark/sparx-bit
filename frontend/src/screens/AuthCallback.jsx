import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from '../firebase'
import { useApp } from '../context/useApp'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { dispatch } = useApp()
  const [status, setStatus] = useState('Signing you in…')

  useEffect(() => {
    async function handleCallback() {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        setStatus('Sign-in failed. Please try again.')
        setTimeout(() => navigate('/login'), 2000)
        return
      }

      const storedEmail = localStorage.getItem('emailForSignIn')
      const email = storedEmail || window.prompt('Please confirm your email address')
      if (!email) {
        setStatus('Email required to complete sign-in.')
        setTimeout(() => navigate('/login'), 2000)
        return
      }

      const result = await signInWithEmailLink(auth, email, window.location.href)
      localStorage.removeItem('emailForSignIn')
      const user = result.user
      dispatch({ type: 'UPDATE_USER', data: {
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email || '',
      }})
      navigate('/onboarding')
    }

    handleCallback().catch(() => {
      setStatus('Link expired or invalid. Please try again.')
      setTimeout(() => navigate('/login'), 2000)
    })
  }, [dispatch, navigate])

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-2xl text-white mx-auto mb-4 animate-pulse">✦</div>
        <p className="text-primary font-semibold">{status}</p>
      </div>
    </div>
  )
}
