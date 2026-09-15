import { Router } from 'express'
import authRoutes from './auth.js'
import actionRoutes from './actions.js'
import { resourceRoutes } from './resources.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { dbModels } from '../models/index.js'
import { getPersonalizedFeed } from '../services/feedService.js'
import { askAssistant } from '../controllers/aiController.js'
import { validateAIRequest } from '../middleware/validate.js'

const router = Router()
router.use('/auth', authRoutes)
router.use(actionRoutes)
router.post('/ai/assistant', requireAuth, validateAIRequest, askAssistant)

for (const route of [
  ['users', 'User'], ['profiles', 'Profile'], ['posts', 'Post'], ['comments', 'Comment'], ['connections', 'Connection'], ['follows', 'Follow'],
  ['products', 'Product'], ['categories', 'Category'], ['sellers', 'Seller'], ['orders', 'Order'], ['reviews', 'Review'], ['jobs', 'Job'],
  ['applications', 'Application'], ['experts', 'ExpertProfile'], ['groups', 'Group'], ['questions', 'Question'], ['answers', 'Answer'],
  ['schemes', 'Scheme'], ['services', 'Service'], ['reports', 'Report'], ['notifications', 'Notification'], ['conversations', 'Conversation'], ['messages', 'Message'],
]) {
  const { path, router: resourceRouter } = resourceRoutes(`/${route[0]}`, route[1], { roles: route[0] === 'users' ? ['ADMIN'] : undefined })
  router.use(path, resourceRouter)
}

router.get('/feed', requireAuth, async (req, res) => res.json(await getPersonalizedFeed(req.user.id)))
router.get('/me', requireAuth, async (req, res) => {
  const user = await dbModels.User.findById(req.user.id).select('-passwordHash').lean()
  if (!user) return res.status(404).json({ message: 'FarmConnect profile not found.' })
  res.json({ ...user, id: String(user._id) })
})
router.get('/profiles/me', requireAuth, async (req, res) => {
  const profile = await dbModels.Profile.findOne({ user: req.user.id }).lean()
  res.json(profile ?? { user: req.user.id, profileCompletion: 0, connections: 0, followers: 0 })
})
router.get('/network', requireAuth, async (req, res) => res.json([]))
router.get('/search', requireAuth, async (req, res) => res.json({ query: req.query.q ?? '', people: [], posts: [], jobs: [], products: [], communities: [], experts: [] }))
router.get('/admin/analytics', requireAuth, requireRole('ADMIN'), async (req, res) => res.json({ users: 0, farmers: 0, experts: 0, sellers: 0, products: 0, orders: 0, revenue: 0, posts: 0, connections: 0, jobs: 0, applications: 0 }))
router.get('/admin/:resource', requireAuth, requireRole('ADMIN'), async (req, res) => res.json({ resource: req.params.resource, items: [] }))
router.post('/seller/store', requireAuth, requireRole('SELLER', 'ADMIN'), async (req, res) => res.status(201).json({ owner: req.user.id, ...req.body }))
router.use('/seller/products', requireAuth, requireRole('SELLER', 'ADMIN'), resourceRoutes('/seller/products', 'Product').router)
router.post('/cart/items', requireAuth, async (req, res) => res.status(201).json(req.body))
router.delete('/cart/items/:id', requireAuth, async (req, res) => res.status(204).end())
router.post('/wishlist/items', requireAuth, async (req, res) => res.status(201).json(req.body))
router.delete('/wishlist/items/:id', requireAuth, async (req, res) => res.status(204).end())
router.post('/communities/:group/:action', requireAuth, async (req, res) => res.json({ group: req.params.group, action: req.params.action }))
router.post('/communities/:group/posts', requireAuth, async (req, res) => res.status(201).json(req.body))
router.post('/questions/:id/votes', requireAuth, async (req, res) => res.status(201).json({ questionId: req.params.id, direction: req.body.direction }))
router.post('/api-placeholder', (_req, res) => res.status(410).end())

export default router
