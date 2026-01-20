import { createCard, createSmartCard } from '../services/notion.service.js'
import { uploadFile } from '../utils/supabase.util.js'
import { randomUUID } from 'crypto'

export const createNotionCard = async (req, res) => {
  try {
    const { title, text, project, person, priority, impact, date = new Date().toISOString().split('T')[0], projectStatus } = req.body

    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' })
    }

    await createCard({
      title,
      body: text,
      project,
      person,
      priority,
      impact,
      date,
      projectStatus
    })

    res.status(201).json({ message: 'Tarjeta creada correctamente' })
  } catch (error) {
    console.error('Error creating card:', error)
    res.status(500).json({ error: 'Error al crear la tarjeta' })
  }
}

export const createSmartNotionCard = async (req, res) => {
  try {
    const { message } = req.body
    let images = req?.files?.images

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' })
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

            console.log(result, 'Uploaded image to Supabase:')
            uploadedUrls.push(result.publicUrl)
        }
    }

    await createSmartCard(message, uploadedUrls)

    res.status(201).json({ message: 'Tarjeta creada correctamente' })
  } catch (error) {
    console.error('Error creating smart card:', error)

    // Si es error de validación, devolver 400
    if (error.message.startsWith('Mensaje no válido:')) {
      return res.status(400).json({ error: error.message })
    }

    res.status(500).json({ error: 'Error al crear la tarjeta' })
  }
}
