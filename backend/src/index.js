import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import bitsRoutes from './routes/bits.js'
import completionsRoutes from './routes/completions.js'
import settingsRoutes from './routes/settings.js'
import promosRoutes from './routes/promos.js'

const app = express()

app.use(cors({
  origin: (origin, cb) => {
    // Allow any localhost origin + the configured FRONTEND_URL
    if (!origin || origin.startsWith('http://localhost') || origin === process.env.FRONTEND_URL) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/bits', bitsRoutes)
app.use('/completions', completionsRoutes)
app.use('/settings', settingsRoutes)
app.use('/promos', promosRoutes)

app.get('/', (_, res) => {
  res.json({
    name: 'Sparx Bit API',
    ok: true,
    frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
    health: '/health',
  })
})

app.get('/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
