import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { dbModels } from '../models/index.js'

export async function registerUser(payload) {
  const { User } = dbModels
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email ?? '') || String(payload.password ?? '').length < 10) throw Object.assign(new Error('Use a valid email and a password of at least 10 characters.'), { statusCode: 400 })
  const existing = await User.exists({ email: payload.email.toLowerCase() })
  if (existing) throw Object.assign(new Error('An account already exists for that email.'), { statusCode: 409 })
  const passwordHash = await bcrypt.hash(payload.password, 12)
  const user = await User.create({ ...payload, firstName: payload.name?.split(' ')[0], passwordHash })
  return issueToken(user)
}

export async function loginUser(email, password) {
  const user = await dbModels.User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
  return issueToken(user)
}

function issueToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'replace-with-a-long-random-secret') throw new Error('JWT_SECRET is not securely configured')
  const token = jwt.sign({ id: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
  return { token, user: { id: user._id, name: user.name, role: user.role, email: user.email } }
}
