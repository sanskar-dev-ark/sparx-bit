import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './screens/Welcome'
import Login from './screens/Login'
import MagicLinkSent from './screens/MagicLinkSent'
import Onboarding from './screens/Onboarding'
import GoalSelection from './screens/GoalSelection'
import BitPreferences from './screens/BitPreferences'
import ReminderSetup from './screens/ReminderSetup'
import Dashboard from './screens/Dashboard'
import AddBit from './screens/AddBit'
import BitDetail from './screens/BitDetail'
import EditBit from './screens/EditBit'
import DailySummary from './screens/DailySummary'
import Analytics from './screens/Analytics'
import Calendar from './screens/Calendar'
import Referral from './screens/Referral'
import CreatePromo from './screens/CreatePromo'
import PromoStatus from './screens/PromoStatus'
import Profile from './screens/Profile'
import Settings from './screens/Settings'
import NotificationSettings from './screens/NotificationSettings'
import UpgradePremium from './screens/UpgradePremium'
import Paywall from './screens/Paywall'
import AuthCallback from './screens/AuthCallback'
import ProtectedRoute from './components/ProtectedRoute'

function Private({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/magic-link" element={<MagicLinkSent />} />
        <Route path="/onboarding" element={<Private><Onboarding /></Private>} />
        <Route path="/goals" element={<Private><GoalSelection /></Private>} />
        <Route path="/preferences" element={<Private><BitPreferences /></Private>} />
        <Route path="/reminder" element={<Private><ReminderSetup /></Private>} />
        <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="/add-bit" element={<Private><AddBit /></Private>} />
        <Route path="/bit/:id" element={<Private><BitDetail /></Private>} />
        <Route path="/edit-bit/:id" element={<Private><EditBit /></Private>} />
        <Route path="/daily-summary" element={<Private><DailySummary /></Private>} />
        <Route path="/analytics" element={<Private><Analytics /></Private>} />
        <Route path="/calendar" element={<Private><Calendar /></Private>} />
        <Route path="/referral" element={<Private><Referral /></Private>} />
        <Route path="/create-promo" element={<Private><CreatePromo /></Private>} />
        <Route path="/promo-status" element={<Private><PromoStatus /></Private>} />
        <Route path="/profile" element={<Private><Profile /></Private>} />
        <Route path="/settings" element={<Private><Settings /></Private>} />
        <Route path="/notification-settings" element={<Private><NotificationSettings /></Private>} />
        <Route path="/premium" element={<Private><UpgradePremium /></Private>} />
        <Route path="/paywall" element={<Private><Paywall /></Private>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
