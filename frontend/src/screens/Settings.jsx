import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import { useApp } from '../context/useApp'
import { THEMES } from '../context/appState'
import { api } from '../api'

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese']

const TERMS_TEXT = `Terms of Service — Sparx Bit

Last updated: April 2026

1. Acceptance
By using Sparx Bit, you agree to these terms.

2. Use of Service
Sparx Bit is a personal habit tracking tool. You may use it for personal, non-commercial purposes.

3. Your Data
Habit data is stored in your Sparx Bit account database and accessed through authenticated API requests. We do not sell your personal data.

4. Account
You are responsible for maintaining the security of your account credentials.

5. Modifications
We may update these terms at any time. Continued use constitutes acceptance.

6. Limitation of Liability
Sparx Bit is provided "as is" without warranties of any kind.

Contact: support@sparxbit.app`

const PRIVACY_TEXT = `Privacy Policy — Sparx Bit

Last updated: April 2026

1. Data We Collect
- Email address (for authentication only)
- Habit data (stored locally on your device)
- Usage analytics (anonymous, aggregated)

2. How We Use Data
- To authenticate your account via Firebase
- To sync your preferences across devices (if enabled)
- We never sell your data to third parties

3. Firebase Authentication
Sign-in is handled by Google Firebase. Their privacy policy applies to authentication data.

4. Data Storage
Your bits, streaks, and settings are stored in your account and synced through the Sparx Bit API.

5. Your Rights
You can delete all your data at any time via Settings → Delete Account.

Contact: privacy@sparxbit.app`

function Modal({ title, content, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div className="bg-white w-full max-w-sm mx-auto rounded-t-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-primary">{title}</h3>
          <button onClick={onClose} className="text-secondary text-xl w-8 h-8 flex items-center justify-center">✕</button>
        </div>
        <div className="overflow-y-auto px-6 py-4">
          <pre className="text-xs text-secondary leading-relaxed whitespace-pre-wrap font-sans">{content}</pre>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-secondary tracking-widest mb-2 px-1">{title}</p>
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">{children}</div>
    </div>
  )
}

function Row({ icon, label, onPress, toggle, toggled, onToggle, value }) {
  return (
    <button onClick={toggle ? onToggle : onPress}
      className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors">
      <span className="text-[#6B8DD6] text-lg w-6 text-center flex-shrink-0">{icon}</span>
      <span className="flex-1 text-sm font-semibold text-primary text-left">{label}</span>
      {value && <span className="text-xs text-secondary mr-1">{value}</span>}
      {toggle ? (
        <div className={`w-11 h-6 rounded-full transition-all ${toggled ? 'bg-[#6B8DD6]' : 'bg-gray-200'} relative`}>
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${toggled ? 'left-5' : 'left-0.5'}`} />
        </div>
      ) : <span className="text-secondary text-lg">›</span>}
    </button>
  )
}

function PickerPanel({ options, selected, onSelect }) {
  return (
    <div className="px-4 pb-3">
      <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100 overflow-hidden">
        {options.map(opt => (
          <button key={opt} onClick={() => onSelect(opt)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-primary hover:bg-gray-100 transition-colors">
            {opt}
            {selected === opt && <span className="text-[#6B8DD6] font-bold">✓</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

function InfoPanel({ content }) {
  return (
    <div className="px-4 pb-3">
      <div className="bg-gray-50 rounded-2xl p-4 text-sm text-secondary leading-relaxed">{content}</div>
    </div>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(null)
  const [modal, setModal] = useState(null) // { title, content }

  const toggle = key => setOpen(prev => prev === key ? null : key)

  const updateSetting = async (action, payload) => {
    dispatch(action)
    try {
      await api.settings.update(payload)
    } catch (error) {
      console.error('[settings update error]', error)
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This will delete all your data permanently.')) {
      dispatch({ type: 'RESET' })
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-10">
      {modal && <Modal title={modal.title} content={modal.content} onClose={() => setModal(null)} />}

      <div className="px-6 pt-6">
        <BackHeader title="Settings" />
      </div>
      <div className="px-6 space-y-5">

        <Section title="PREFERENCES">
          <Row icon="🌙" label="Dark Mode" toggle toggled={state.darkMode}
            onToggle={() => updateSetting({ type: 'SET_DARK_MODE', value: !state.darkMode }, { dark_mode: !state.darkMode })} />
          <Row icon="🔔" label="Notifications" onPress={() => navigate('/notification-settings')} />
          <Row icon="🎨" label="Theme" value={state.theme} onPress={() => toggle('theme')} />
          {open === 'theme' && (
            <PickerPanel
              options={Object.keys(THEMES)}
              selected={state.theme}
              onSelect={v => { updateSetting({ type: 'SET_THEME', value: v }, { theme: v }); setOpen(null) }}
            />
          )}
          <Row icon="🌐" label="Language" value={state.language} onPress={() => toggle('language')} />
          {open === 'language' && (
            <PickerPanel
              options={LANGUAGES}
              selected={state.language}
              onSelect={v => { updateSetting({ type: 'SET_LANGUAGE', value: v }, { language: v }); setOpen(null) }}
            />
          )}
        </Section>

        <Section title="ACCOUNT">
          <Row icon="🔒" label="Privacy" onPress={() => toggle('privacy')} />
          {open === 'privacy' && (
            <InfoPanel content="Your data is stored in your Sparx Bit account and accessed only through authenticated API requests. We do not sell or share your personal information." />
          )}
          <Row icon="🔒" label="Security" onPress={() => toggle('security')} />
          {open === 'security' && (
            <InfoPanel content="Sparx Bit uses Firebase Authentication for secure sign-in. Magic links and Google OAuth are used — no passwords are stored. Your session is protected by industry-standard encryption." />
          )}
        </Section>

        <Section title="ABOUT">
          <Row icon="📄" label="Terms of Service" onPress={() => setModal({ title: 'Terms of Service', content: TERMS_TEXT })} />
          <Row icon="🔐" label="Privacy Policy" onPress={() => setModal({ title: 'Privacy Policy', content: PRIVACY_TEXT })} />
          <Row icon="💬" label="Help & Support" onPress={() => window.open('mailto:support@sparxbit.app')} />
          <Row icon="⭐" label="Rate App" onPress={() => window.open('https://apps.apple.com', '_blank')} />
        </Section>

        <div>
          <p className="text-xs font-semibold text-red-400 tracking-widest mb-2 px-1">DANGER ZONE</p>
          <button onClick={handleDeleteAccount} className="w-full bg-[#FEE2E2] rounded-2xl py-4 text-sm font-semibold text-red-400">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
