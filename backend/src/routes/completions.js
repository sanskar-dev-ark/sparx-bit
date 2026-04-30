import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /completions?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { from, to } = req.query
  let query = req.supabase.from('completions').select('*').eq('user_id', req.user.id)
  if (from) query = query.gte('date', from)
  if (to)   query = query.lte('date', to)
  const { data, error } = await query.order('date', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /completions — toggle (insert or delete)
router.post('/toggle', async (req, res) => {
  const { bit_id, date } = req.body
  if (!bit_id || !date) return res.status(400).json({ error: 'bit_id and date required' })

  const { data: bit, error: bitError } = await req.supabase
    .from('bits')
    .select('id')
    .eq('id', bit_id)
    .eq('user_id', req.user.id)
    .maybeSingle()
  if (bitError) return res.status(500).json({ error: bitError.message })
  if (!bit) return res.status(404).json({ error: 'Bit not found' })

  // Check if exists
  const { data: existing } = await req.supabase
    .from('completions')
    .select('id')
    .eq('bit_id', bit_id)
    .eq('user_id', req.user.id)
    .eq('date', date)
    .maybeSingle()

  if (existing) {
    await req.supabase.from('completions').delete().eq('id', existing.id).eq('user_id', req.user.id)
    return res.json({ action: 'removed' })
  }

  const { data, error } = await req.supabase
    .from('completions')
    .insert({ bit_id, user_id: req.user.id, date })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json({ action: 'added', data })
})

export default router
