import { Router } from 'express'
import { createSmartNotionCard } from '../controllers/notion.controller.js'

const router = Router()

// Endpoints
router.post('/notion/smart-card', createSmartNotionCard)

export default router
