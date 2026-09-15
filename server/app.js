import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { createRateLimiter } from './middleware/rateLimit.js'

export const app = express()
app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use(createRateLimiter({ max: Number(process.env.RATE_LIMIT_MAX ?? 120) }))
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'farmconnect-api' }))
app.use('/api', routes)
app.use(notFound)
app.use(errorHandler)
