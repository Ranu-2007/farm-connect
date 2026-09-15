import { Router } from 'express'
import { login, logout, register, requestRecovery, resetPassword, verifyEmail } from '../controllers/authController.js'
import { validateBody } from '../middleware/validate.js'
import { createRateLimiter } from '../middleware/rateLimit.js'

const router = Router()
const authRateLimit = createRateLimiter({ windowMs: 15 * 60_000, max: 10 })
router.post('/register', authRateLimit, validateBody(['name', 'email', 'password']), register)
router.post('/login', authRateLimit, validateBody(['email', 'password']), login)
router.post('/logout', logout)
router.post('/forgot-password', validateBody(['email']), requestRecovery)
router.post('/reset-password', validateBody(['token', 'password']), resetPassword)
router.post('/verify-email', validateBody(['token']), verifyEmail)
export default router
