const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
export function validateUpload(req, res, next) {
  const files = req.files ?? (req.file ? [req.file] : [])
  if (files.some(file => !allowedTypes.has(file.mimetype) || file.size > 5 * 1024 * 1024)) return res.status(400).json({ message: 'Uploads must be JPEG, PNG, or WebP images under 5 MB.' })
  next()
}
