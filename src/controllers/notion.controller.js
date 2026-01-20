import { createCard, createSmartCard } from '../services/notion.service.js'

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

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' })
    }

    await createSmartCard(message)

    res.status(201).json({ message: 'Tarjeta creada correctamente' })
  } catch (error) {
    console.error('Error creating smart card:', error)
    res.status(500).json({ error: 'Error al crear la tarjeta' })
  }
}
