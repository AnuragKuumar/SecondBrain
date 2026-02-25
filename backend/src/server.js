import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import itemsRouter from './routes/items.js'
import queryRouter from './routes/query.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }))
app.use(express.json())

app.use('/api/items', itemsRouter)
app.use('/api/query', queryRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
