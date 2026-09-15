import { dbModels } from '../models/index.js'

// Keep scoring isolated so a future ML/recommendation provider can replace it.
export async function getPersonalizedFeed(userId) {
  const [viewer, profile, connections] = await Promise.all([
    dbModels.User.findById(userId).lean(),
    dbModels.Profile.findOne({ user: userId }).lean(),
    dbModels.Connection.find({ $or: [{ requester: userId }, { recipient: userId }], status: 'accepted' }).lean(),
  ])
  const connectedIds = new Set(connections.flatMap(item => [String(item.requester), String(item.recipient)]))
  const posts = await dbModels.Post.find({ visibility: 'public' }).populate('author', 'name role location avatarUrl crops verificationStatus').sort({ createdAt: -1 }).limit(100).lean()
  const crops = new Set([...(viewer?.crops ?? []), ...(profile?.crops ?? [])].map(value => value.toLowerCase()))
  return posts.map(post => ({
    ...post,
    recommendationScore: (connectedIds.has(String(post.author?._id)) ? 30 : 0) +
      ((post.author?.crops ?? []).some(crop => crops.has(crop.toLowerCase())) ? 20 : 0) +
      (post.author?.location === viewer?.location ? 10 : 0),
  })).sort((a, b) => b.recommendationScore - a.recommendationScore || new Date(b.createdAt) - new Date(a.createdAt))
}
