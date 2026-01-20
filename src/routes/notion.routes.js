import { Router } from 'express'
import { createNotionCard, getNotionUsers, getNotionSchema } from '../controllers/notion.controller.js'

const router = Router()

router.post('/notion/card', createNotionCard)

export default router
