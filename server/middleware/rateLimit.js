// Swap this store for Redis in a multi-instance deployment; the middleware API stays unchanged.
export function createRateLimiter({ windowMs = 60_000, max = 100, key = req => req.ip } = {}) {
  const hits = new Map()
  return (req, res, next) => {
    const now = Date.now(), identifier = key(req), record = hits.get(identifier)
    const current = !record || record.resetAt <= now ? { count: 0, resetAt: now + windowMs } : record
    current.count += 1; hits.set(identifier, current)
    res.set('RateLimit-Limit', String(max)); res.set('RateLimit-Remaining', String(Math.max(0, max - current.count)))
    if (current.count > max) return res.status(429).json({ message: 'Too many requests. Please try again shortly.' })
    next()
  }
}
