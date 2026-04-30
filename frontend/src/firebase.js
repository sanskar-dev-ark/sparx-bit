import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missingKeys.length) {
  throw new Error(`Missing Firebase config: ${missingKeys.join(', ')}. Check frontend/.env and restart Vite.`)
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export const waitForFirebaseUser = () => auth.authStateReady().then(() => auth.currentUser)
export const onFirebaseAuthStateChanged = onAuthStateChanged
