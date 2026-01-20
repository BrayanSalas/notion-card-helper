import { Router } from 'express'
import { createNotionCard, createSmartNotionCard } from '../controllers/notion.controller.js'

const router = Router()

router.post('/notion/card', createNotionCard)
router.post('/notion/smart-card', createSmartNotionCard)

export default router
