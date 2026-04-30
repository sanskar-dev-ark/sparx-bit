import { Navigate } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { auth } from '../firebase'

export default function ProtectedRoute({ children }) {
  const { loading } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] animate-pulse" />
      </div>
    )
  }

  return auth.currentUser ? children : <Navigate to="/login" replace />
}
