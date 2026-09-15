import mongoose from 'mongoose'

const { Schema, model, models } = mongoose
const ref = (refName, required = false) => ({ type: Schema.Types.ObjectId, ref: refName, required })
const timestamps = { timestamps: true }

const userSchema = new Schema({
  name: { type: String, required: true, trim: true }, firstName: String, email: { type: String, required: true, unique: true, lowercase: true }, phone: String,
  passwordHash: { type: String, required: true }, role: { type: String, enum: ['FARMER', 'EXPERT', 'SELLER', 'EMPLOYER', 'ORGANIZATION', 'ADMIN'], default: 'FARMER' },
  location: String, state: String, district: String, crops: [String], experience: String, emailVerifiedAt: Date, avatarUrl: String,
  verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' }, verifiedAt: Date,
}, timestamps)
const profileSchema = new Schema({ user: { ...ref('User', true), unique: true }, headline: String, coverUrl: String, connections: { type: Number, default: 0 }, followers: { type: Number, default: 0 }, profileCompletion: { type: Number, default: 0 }, farmSize: String, methods: [String], crops: [String], certifications: [String], skills: [String], achievements: [String], education: [String], training: [String], interests: [String], products: [String], reviews: [String] }, timestamps)
const postSchema = new Schema({ author: ref('User', true), content: { type: String, required: true }, media: [{ url: String, type: String }], type: { type: String, enum: ['photo', 'video', 'question', 'achievement', 'article'], default: 'article' }, visibility: { type: String, default: 'public' }, editedAt: Date }, timestamps)
const commentSchema = new Schema({ post: ref('Post', true), author: ref('User', true), content: { type: String, required: true }, parent: ref('Comment') }, timestamps)
const connectionSchema = new Schema({ requester: ref('User', true), recipient: ref('User', true), status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' } }, timestamps)
const followSchema = new Schema({ follower: ref('User', true), target: ref('User', true), targetType: { type: String, enum: ['USER', 'ORGANIZATION'], default: 'USER' } }, timestamps)
const likeSchema = new Schema({ user: ref('User', true), post: ref('Post', true) }, timestamps)
const conversationSchema = new Schema({ participants: [ref('User', true)], lastMessageAt: Date }, timestamps)
const messageSchema = new Schema({ conversation: ref('Conversation', true), sender: ref('User', true), content: String, attachmentUrl: String, readAt: Date }, timestamps)
const notificationSchema = new Schema({ recipient: ref('User', true), actor: ref('User'), type: String, title: String, detail: String, readAt: Date, metadata: Schema.Types.Mixed }, timestamps)
const productSchema = new Schema({ seller: ref('Seller', true), category: ref('Category'), name: { type: String, required: true }, description: String, specifications: Schema.Types.Mixed, images: [String], price: Number, discount: String, stock: Number, rating: Number, reviewCount: Number, status: { type: String, default: 'active' } }, timestamps)
const categorySchema = new Schema({ name: { type: String, unique: true }, slug: { type: String, unique: true } }, timestamps)
const sellerSchema = new Schema({ user: { ...ref('User', true), unique: true }, storeName: String, description: String, verifiedAt: Date }, timestamps)
const cartSchema = new Schema({ user: { ...ref('User', true), unique: true }, items: [{ product: ref('Product'), quantity: Number, savedForLater: Boolean }] }, timestamps)
const wishlistSchema = new Schema({ user: { ...ref('User', true), unique: true }, products: [ref('Product')] }, timestamps)
const orderSchema = new Schema({ user: ref('User', true), orderId: { type: String, unique: true }, items: [{ product: ref('Product'), quantity: Number, price: Number }], total: Number, paymentStatus: String, deliveryStatus: { type: String, default: 'Ordered' }, paymentReference: String }, timestamps)
const orderItemSchema = new Schema({ order: ref('Order', true), product: ref('Product', true), quantity: Number, price: Number }, timestamps)
const reviewSchema = new Schema({ product: ref('Product', true), author: ref('User', true), rating: Number, content: String }, timestamps)
const jobSchema = new Schema({ employer: ref('User'), title: String, company: String, location: String, salary: String, type: String, category: String, deadline: Date, description: String, responsibilities: [String], requirements: [String], skills: [String] }, timestamps)
const applicationSchema = new Schema({ job: ref('Job', true), applicant: ref('User', true), status: String, resumeUrl: String }, timestamps)
const expertProfileSchema = new Schema({ user: { ...ref('User', true), unique: true }, expertise: [String], experience: String, location: String, rating: Number, verifiedAt: Date }, timestamps)
const groupSchema = new Schema({ owner: ref('User'), name: String, slug: { type: String, unique: true }, description: String, coverUrl: String }, timestamps)
const groupMemberSchema = new Schema({ group: ref('Group', true), user: ref('User', true), role: String }, timestamps)
const questionSchema = new Schema({ author: ref('User', true), title: String, content: String, category: String, votes: { type: Number, default: 0 }, bestAnswer: ref('Answer') }, timestamps)
const answerSchema = new Schema({ question: ref('Question', true), author: ref('User', true), content: String, votes: { type: Number, default: 0 }, isExpert: Boolean }, timestamps)
const schemeSchema = new Schema({ title: String, description: String, eligibility: [String], link: String }, timestamps)
const serviceSchema = new Schema({ provider: ref('ServiceProvider', true), title: String, description: String, price: Number }, timestamps)
const serviceProviderSchema = new Schema({ user: ref('User', true), businessName: String, verifiedAt: Date }, timestamps)
const reportSchema = new Schema({ reporter: ref('User', true), targetType: String, targetId: Schema.Types.ObjectId, reason: String, status: { type: String, default: 'open' } }, timestamps)

const definitions = { User: userSchema, Profile: profileSchema, Post: postSchema, Comment: commentSchema, Connection: connectionSchema, Follow: followSchema, Like: likeSchema, Conversation: conversationSchema, Message: messageSchema, Notification: notificationSchema, Product: productSchema, Category: categorySchema, Seller: sellerSchema, Cart: cartSchema, Wishlist: wishlistSchema, Order: orderSchema, OrderItem: orderItemSchema, Review: reviewSchema, Job: jobSchema, Application: applicationSchema, ExpertProfile: expertProfileSchema, Group: groupSchema, GroupMember: groupMemberSchema, Question: questionSchema, Answer: answerSchema, Scheme: schemeSchema, Service: serviceSchema, ServiceProvider: serviceProviderSchema, Report: reportSchema }
postSchema.index({ author: 1, createdAt: -1 }); postSchema.index({ visibility: 1, createdAt: -1 }); userSchema.index({ location: 1, crops: 1 }); productSchema.index({ status: 1, createdAt: -1 }); connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true })
export const dbModels = Object.fromEntries(Object.entries(definitions).map(([name, schema]) => [name, models[name] ?? model(name, schema)]))
