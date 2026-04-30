import { auth, waitForFirebaseUser } from './firebase.js'

// All calls to the Express backend. Firebase ID token is read each call.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function getToken() {
  const user = auth.currentUser || await waitForFirebaseUser()
  if (!user) return null
  return user.getIdToken()
}

async function req(method, path, body) {
  const token = await getToken()
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

async function publicReq(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  auth: {
    sendMagicLink: (email) => publicReq('POST', '/auth/magic-link', { email }),
  },

  // ── Bits ────────────────────────────────────────────────────
  bits: {
    list: () => req('GET', '/bits'),
    create: (bit) => req('POST', '/bits', bit),
    update: (id, bit) => req('PUT', `/bits/${id}`, bit),
    delete: (id) => req('DELETE', `/bits/${id}`),
  },

  // ── Completions ─────────────────────────────────────────────
  completions: {
    list: (from, to) => req('GET', `/completions?from=${from}&to=${to}`),
    toggle: (bit_id, date) => req('POST', '/completions/toggle', { bit_id, date }),
  },

  // ── Settings ────────────────────────────────────────────────
  settings: {
    get: () => req('GET', '/settings'),
    update: (data) => req('PUT', '/settings', data),
  },

  // ── Promos ──────────────────────────────────────────────────
  promos: {
    list: () => req('GET', '/promos'),
    create: (promo) => req('POST', '/promos', promo),
  },
}
