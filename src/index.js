import 'dotenv/config'
import express from 'express'
import fileUpload from 'express-fileupload'
import notionRoutes from './routes/notion.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares para manejo de JSON y archivos
app.use(express.json())
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }))

// Prefijo de la app
app.use('/api', notionRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
