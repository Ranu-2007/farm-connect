import 'dotenv/config'
import { app } from './app.js'
import { connectDatabase } from './config/db.js'

const port = Number(process.env.PORT ?? 4000)
await connectDatabase()
app.listen(port, () => console.log(`FarmConnect API listening on http://localhost:${port}`))
