import mongoose from 'mongoose'

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('MONGODB_URI is not configured; API will run without persistence.')
    return false
  }
  await mongoose.connect(uri)
  return true
}
