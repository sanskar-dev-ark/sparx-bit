import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /bits
router.get('/', async (req, res) => {
  const { data, error } = await req.supabase
    .from('bits')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /bits
router.post('/', async (req, res) => {
  const { title, why, description, goal, category } = req.body
  if (!title) return res.status(400).json({ error: 'Title required' })

  const { data, error } = await req.supabase
    .from('bits')
    .insert({ user_id: req.user.id, title, why, description, goal: goal || 5, category: category || 'none' })
    .select()
    .single()
  if (error) {
    console.error('[bits create error]', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      userId: req.user.id,
    })
    return res.status(500).json({ error: error.message })
  }
  res.status(201).json(data)
})

// PUT /bits/:id
router.put('/:id', async (req, res) => {
  const { title, why, description, goal, category } = req.body
  const { data, error } = await req.supabase
    .from('bits')
    .update({ title, why, description, goal, category })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /bits/:id
router.delete('/:id', async (req, res) => {
  const { error } = await req.supabase
    .from('bits')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

export default router
