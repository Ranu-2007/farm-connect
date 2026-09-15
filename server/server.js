import 'dotenv/config'
import { app } from './app.js'
import { connectDatabase } from './config/db.js'

const port = Number(process.env.PORT ?? 4000)

app.listen(port, '0.0.0.0', () => {
  console.log(`FarmConnect API listening on port ${port}`)
})

connectDatabase()
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
  })