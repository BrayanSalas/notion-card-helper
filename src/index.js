import 'dotenv/config'
import express from 'express'
import helloRoutes from './routes/hello.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())

// Routes
app.use('/api', helloRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
