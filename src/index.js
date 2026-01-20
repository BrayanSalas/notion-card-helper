import 'dotenv/config'
import express from 'express'
import notionRoutes from './routes/notion.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())

// Routes
app.use('/api', notionRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
