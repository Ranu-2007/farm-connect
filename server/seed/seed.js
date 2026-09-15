import 'dotenv/config'
import { connectDatabase } from '../config/db.js'
import { dbModels } from '../models/index.js'

const groups = ['Organic Farming', 'Wheat Farming', 'Rice Farming', 'Vegetable Farming', 'Dairy Farming', 'Natural Farming', 'Smart Farming', 'Hydroponics', 'Irrigation', 'Farm Machinery'].map(name => ({ name, slug: name.toLowerCase().replaceAll(' ', '-') }))
async function seed() {
  const connected = await connectDatabase()
  if (!connected) throw new Error('Set MONGODB_URI before running the seed command.')
  await dbModels.Group.deleteMany({})
  await dbModels.Group.insertMany(groups)
  const sellerUser = await dbModels.User.findOneAndUpdate({ email: 'seed-seller@farmconnect.local' }, { name: 'FarmConnect Seed Seller', email: 'seed-seller@farmconnect.local', passwordHash: 'seed-only', role: 'SELLER' }, { upsert: true, new: true })
  const seller = await dbModels.Seller.findOneAndUpdate({ user: sellerUser._id }, { user: sellerUser._id, storeName: 'FarmConnect Seed Seller' }, { upsert: true, new: true })
  await dbModels.Product.deleteMany({})
  await dbModels.Product.insertMany([
    { name: 'Heirloom Tomato Seed Collection', seller: seller._id, category: 'Seeds', price: 8.5, discount: '15% off', stock: 124, rating: 4.8, reviewCount: 241, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80'] },
    { name: 'Smart Drip Irrigation Starter Kit', seller: seller._id, category: 'Irrigation', price: 74, discount: '10% off', stock: 12, rating: 4.7, reviewCount: 89, images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=500&q=80'] },
  ])
  console.log('FarmConnect development seed complete.')
  process.exit(0)
}

seed().catch(error => { console.error(error); process.exit(1) })
