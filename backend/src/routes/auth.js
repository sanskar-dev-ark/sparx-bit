import { Router } from 'express'

const router = Router()

router.post('/magic-link', (_req, res) => {
  res.status(410).json({
    error: 'Magic links are sent directly by Firebase Auth from the frontend.',
  })
})

export default router
