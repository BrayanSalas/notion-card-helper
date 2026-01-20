import { createSmartCard } from '../services/notion.service.js'
import { uploadFile } from '../utils/supabase.util.js'
import { randomUUID } from 'crypto'

 /**
 * @author Brayan Salas
 * @description Create a smart Notion card based on a message and optional images
 * @param {Object} req
 * @param {Object} res
 * @param {string} req.message - Message to analyze and create the card (required)
 * @param {Object} req.files - Files uploaded
 * @param {Array} req.files.images - Images uploaded
 * @return {Object} 
 */
export const createSmartNotionCard = async (req, res) => {
  try {
    const { message } = req.body
    let images = req?.files?.images

    if (!message) {
      return res.status(400).json({ error: 'Param "message" is required' })
    }
  
    let uploadedUrls = []
    if (images) {
        const images = Array.isArray(req.files.images) 
        ? req.files.images 
        : [req.files.images]

        for (let i = 0; i < images.length; i++) {
            const extension = images[i].name.split('.').pop()
            const fileName = `${randomUUID()}.${extension}`

            const result = await uploadFile('notion-attachments', `images/${fileName}`, images[i].data, {
                contentType: images[i].mimetype,
                upsert: false,
            })

            uploadedUrls.push(result.publicUrl)
        }
    }

    await createSmartCard(message, uploadedUrls)

    res.status(201).json({ message: 'Card created successfully' })
  } catch (error) {
    console.error('Error creating smart card:', error)

    // Si es error de validación, devolver 400
    if (error.message.startsWith('Invalid message:')) {
      return res.status(400).json({ error: error.message })
    }

    res.status(500).json({ error: 'Error creating card' })
  }
}
