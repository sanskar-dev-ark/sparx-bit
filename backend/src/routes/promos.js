import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /promos
router.get('/', async (req, res) => {
  const { data, error } = await req.supabase
    .from('promos')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /promos
router.post('/', async (req, res) => {
  const { title, description, code, discount, start_date, end_date } = req.body
  if (!title) return res.status(400).json({ error: 'Title required' })

  const { data, error } = await req.supabase
    .from('promos')
    .insert({ user_id: req.user.id, title, description, code, discount, start_date, end_date })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

export default router
