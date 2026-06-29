import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { errorHandler } from './shared/middlewares/errorHandler.js'
import { globalLimiter } from './shared/middlewares/rateLimit.js'
import authRouter from './modules/auth/auth.routes.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', env: process.env.NODE_ENV })
})

// Global rate limit for the API surface (health check stays unthrottled).
app.use('/api', globalLimiter)

// Modules — will be added as each is built
app.use('/api/auth', authRouter)
// app.use('/api/finance', financeRouter)
// app.use('/api/body', bodyRouter)
// app.use('/api/habits', habitsRouter)
// app.use('/api/health', healthRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`LifeOS backend running on http://localhost:${PORT}`)
})
