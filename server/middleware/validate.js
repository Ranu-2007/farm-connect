export function validateBody(requiredFields = []) {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => req.body?.[field] === undefined || req.body[field] === '')
    if (missing.length) return res.status(400).json({ message: 'Validation failed', fields: missing })
    next()
  }
}

export function validateAIRequest(req, res, next) {
  const question = req.body?.question
  if (typeof question !== 'string' || question.trim().length < 3 || question.length > 2_000) return res.status(400).json({ message: 'Provide a farming question between 3 and 2,000 characters.' })
  next()
}
