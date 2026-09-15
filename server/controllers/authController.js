import { loginUser, registerUser } from '../services/authService.js'

const cookieOptions = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' }
export async function register(req, res) { const result = await registerUser(req.body); res.cookie('accessToken', result.token, cookieOptions); res.status(201).json(result.user) }
export async function login(req, res) { const result = await loginUser(req.body.email, req.body.password); res.cookie('accessToken', result.token, cookieOptions); res.json(result.user) }
export function logout(req, res) { res.clearCookie('accessToken', cookieOptions); res.status(204).end() }
export function requestRecovery(req, res) { res.status(202).json({ message: 'If that email exists, recovery instructions will be sent.' }) }
export function resetPassword(req, res) { res.status(202).json({ message: 'Password reset request accepted.' }) }
export function verifyEmail(req, res) { res.status(202).json({ message: 'Email verification request accepted.' }) }
