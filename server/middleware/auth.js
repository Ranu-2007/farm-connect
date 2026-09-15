import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const token = req.cookies?.accessToken ?? req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'Authentication required' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: 'Insufficient permissions' })
}
