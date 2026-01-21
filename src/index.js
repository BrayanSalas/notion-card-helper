import 'dotenv/config'
import express from 'express'
import fileUpload from 'express-fileupload'
import appRoutes from './routes/app.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares para manejo de JSON y archivos
app.use(express.json())
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }))

// Prefijo de la app
app.use('/api', appRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
