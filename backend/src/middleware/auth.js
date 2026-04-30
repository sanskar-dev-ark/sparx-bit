import { firebaseAdmin } from '../firebaseAdmin.js'
import { supabase } from '../supabase.js'

function decodeJwtPayload(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(token)

    req.user = {
      id: decoded.uid,
      email: decoded.email,
      name: decoded.name,
    }
    req.supabase = supabase
    next()
  } catch (error) {
    const payload = decodeJwtPayload(token)
    console.error('[firebase auth error]', {
      code: error.code,
      message: error.message,
      configuredProjectId: process.env.FIREBASE_PROJECT_ID || null,
      tokenAudience: payload?.aud || null,
      tokenIssuer: payload?.iss || null,
    })
    res.status(401).json({ error: 'Invalid token' })
  }
}
