import { useReducer, useEffect, useState } from 'react'
import { api } from '../api.js'
import { auth, onFirebaseAuthStateChanged } from '../firebase.js'
import { THEMES, today } from './appState.js'
import { AppContext } from './context.js'

// ── State shape ───────────────────────────────────────────────
// bits: [{ id, title, why, description, goal, category, completions: { 'YYYY-MM-DD': true } }]
// completions come from backend and are merged into bits on load

const DEFAULT_SETTINGS = {
  reminderTime: '08:00', reminderPeriod: 'Morning',
  notifSettings: { enabled: true, daily: true, weekly: true, achievements: true, quietStart: '22:00', quietEnd: '07:00' },
  selectedPlan: 'yearly', darkMode: false, theme: 'Default', language: 'English',
}

const initialState = {
  bits: [],
  user: { name: '', email: '', goals: [], preferences: [] },
  promos: [],
  ...DEFAULT_SETTINGS,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':           return { ...state, ...action.data }
    case 'SET_BITS':       return { ...state, bits: action.bits }
    case 'ADD_BIT':        return { ...state, bits: [...state.bits, { completions: {}, ...action.bit }] }
    case 'UPDATE_BIT':     return { ...state, bits: state.bits.map(b => b.id === action.bit.id ? { ...b, ...action.bit, completions: action.bit.completions || b.completions || {} } : b) }
    case 'DELETE_BIT':     return { ...state, bits: state.bits.filter(b => b.id !== action.id) }
    case 'TOGGLE_COMPLETION': {
      return { ...state, bits: state.bits.map(b => {
        if (b.id !== action.bit_id) return b
        const completions = { ...(b.completions || {}) }
        completions[action.date] ? delete completions[action.date] : (completions[action.date] = true)
        return { ...b, completions }
      })}
    }
    case 'UPDATE_USER':    return { ...state, user: { ...state.user, ...action.data } }
    case 'SET_SETTINGS':   return { ...state, ...action.settings }
    case 'SET_USER_GOALS': return { ...state, user: { ...state.user, goals: action.goals } }
    case 'SET_USER_PREFS': return { ...state, user: { ...state.user, preferences: action.prefs } }
    case 'SET_REMINDER':   return { ...state, reminderTime: action.time, reminderPeriod: action.period }
    case 'SET_NOTIF_SETTINGS': return { ...state, notifSettings: action.settings }
    case 'SET_PLAN':       return { ...state, selectedPlan: action.plan }
    case 'SET_DARK_MODE':  return { ...state, darkMode: action.value }
    case 'SET_THEME':      return { ...state, theme: action.value }
    case 'SET_LANGUAGE':   return { ...state, language: action.value }
    case 'ADD_PROMO':      return { ...state, promos: [...state.promos, action.promo] }
    case 'SET_PROMOS':     return { ...state, promos: action.promos }
    case 'RESET':          return { ...initialState }
    default: return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loading, setLoading] = useState(true)

  // Load all data from backend on mount (only if logged in)
  useEffect(() => {
    async function loadAll(firebaseUser) {
      if (!firebaseUser) { setLoading(false); return }

      try {
        const [bitsRaw, completionsRaw, settings, promos] = await Promise.all([
          api.bits.list(),
          api.completions.list(
            new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10),
            today()
          ),
          api.settings.get(),
          api.promos.list(),
        ])

        // Merge completions into bits
        const completionsByBit = {}
        completionsRaw.forEach(c => {
          if (!completionsByBit[c.bit_id]) completionsByBit[c.bit_id] = {}
          completionsByBit[c.bit_id][c.date] = true
        })
        const bits = bitsRaw.map(b => ({ ...b, completions: completionsByBit[b.id] || {} }))

        dispatch({ type: 'LOAD', data: {
          bits,
          promos,
          reminderTime: settings.reminder_time || '08:00',
          reminderPeriod: settings.reminder_period || 'Morning',
          darkMode: settings.dark_mode || false,
          theme: settings.theme || 'Default',
          language: settings.language || 'English',
          selectedPlan: settings.selected_plan || 'yearly',
          notifSettings: settings.notif_settings || DEFAULT_SETTINGS.notifSettings,
          user: {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            email: firebaseUser.email || '',
            goals: settings.goals || [],
            preferences: settings.preferences || [],
          },
        }})
      } catch {
        // Not logged in or backend not running — use empty state
      } finally {
        setLoading(false)
      }
    }
    return onFirebaseAuthStateChanged(auth, user => {
      setLoading(true)
      loadAll(user)
    })
  }, [])

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode)
  }, [state.darkMode])

  // Theme CSS vars
  useEffect(() => {
    const t = THEMES[state.theme] || THEMES.Default
    document.documentElement.style.setProperty('--color-from', t.from)
    document.documentElement.style.setProperty('--color-to', t.to)
    document.documentElement.style.setProperty('--color-accent', t.from)
    document.documentElement.style.setProperty('--color-accent-2', t.to)
  }, [state.theme])

  // Language
  useEffect(() => {
    const map = { English:'en', Hindi:'hi', Spanish:'es', French:'fr', German:'de', Japanese:'ja' }
    document.documentElement.lang = map[state.language] || 'en'
  }, [state.language])

  return (
    <AppContext.Provider value={{ state, dispatch, loading }}>
      {children}
    </AppContext.Provider>
  )
}
