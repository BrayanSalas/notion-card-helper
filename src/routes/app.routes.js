import { Router } from 'express'
import { createSmartNotionCard } from '../controllers/notion.controller.js'
import { telegramWebhook } from '../controllers/telegram.controller.js'

const router = Router()

// Endpoints
router.post('/notion/smart-card', createSmartNotionCard)
router.post('/telegram/webhook', telegramWebhook)


export default router
