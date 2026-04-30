import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /settings — auto-creates row if first login
router.get('/', async (req, res) => {
  const { data, error } = await req.supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', req.user.id)
    .maybeSingle()
  if (error) return res.status(500).json({ error: error.message })

  if (!data) {
    // First login — create default settings row
    const { data: created, error: e2 } = await req.supabase
      .from('user_settings')
      .insert({ user_id: req.user.id })
      .select()
      .single()
    if (e2) return res.status(500).json({ error: e2.message })
    return res.json(created)
  }

  res.json(data)
})

// PUT /settings — upsert
router.put('/', async (req, res) => {
  const allowed = ['reminder_time','reminder_period','dark_mode','theme','language','selected_plan','notif_settings','goals','preferences']
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)))

  const { data, error } = await req.supabase
    .from('user_settings')
    .upsert({ user_id: req.user.id, ...updates })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router
