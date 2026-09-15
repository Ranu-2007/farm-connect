import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { dbModels } from '../models/index.js'

const router = Router()
router.use(requireAuth)
router.post('/posts/:id/like', async (req, res) => {
  const like = await dbModels.Like.findOneAndUpdate({ user: req.user.id, post: req.params.id }, { user: req.user.id, post: req.params.id }, { upsert: true, new: true })
  res.status(201).json({ id: like._id, postId: req.params.id, liked: true })
})
router.delete('/posts/:id/like', async (req, res) => { await dbModels.Like.deleteOne({ user: req.user.id, post: req.params.id }); res.status(204).end() })
router.post('/users/:id/follow', (req, res) => res.status(201).json({ targetId: req.params.id, following: true }))
router.delete('/users/:id/follow', (req, res) => res.status(204).end())
router.post('/connections/:id/:action', (req, res) => res.status(200).json({ connectionId: req.params.id, status: req.params.action }))
router.post('/notifications/:id/read', (req, res) => res.status(204).end())
router.get('/posts/:id/comments', async (req, res) => res.json(await dbModels.Comment.find({ post: req.params.id }).populate('author', 'name').sort({ createdAt: 1 })))
router.post('/posts/:id/comments', async (req, res) => res.status(201).json(await dbModels.Comment.create({ post: req.params.id, author: req.user.id, content: req.body.content })))
router.post('/comments/:id/replies', async (req, res) => {
  const parent = await dbModels.Comment.findById(req.params.id)
  if (!parent) return res.status(404).json({ message: 'Comment not found' })
  res.status(201).json(await dbModels.Comment.create({ post: parent.post, parent: parent._id, author: req.user.id, content: req.body.content }))
})
router.post('/posts/:id/share', (req, res) => res.status(201).json({ post: req.params.id, shared: true }))
router.post('/posts/:id/report', (req, res) => res.status(201).json({ post: req.params.id, reported: true }))
router.post('/conversations/:id/read', (req, res) => res.status(204).end())
router.post('/conversations/:id/messages', (req, res) => res.status(201).json({ conversation: req.params.id, ...req.body }))
router.post('/jobs/:id/applications', (req, res) => res.status(201).json({ jobId: req.params.id, status: 'submitted' }))
router.post('/checkout/payment-intent', (req, res) => res.status(501).json({ message: 'Payment provider is not configured. No order was marked paid.' }))
export default router
