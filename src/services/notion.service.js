import {
  createDatabaseItem,
  queryDatabase,
  updateDatabaseItem,
  archiveDatabaseItem,
  notionProperties,
} from '../utils/notion.util.js'

const DATABASE_ID = process.env.NOTION_DATABASE_ID

/**
 * Crea una nueva tarjeta en la base de datos de Notion
 * @param {Object} cardData - Datos de la tarjeta
 * @param {string} cardData.title - Título de la tarjeta (requerido)
 * @param {string} cardData.project - Proyecto: Frontend, Backend, Mobile
 * @param {string} cardData.date - Fecha en formato YYYY-MM-DD
 * @param {string} cardData.person - Persona asignada: Brayan, Adriana, Jorge
 * @param {string} cardData.priority - Prioridad: Muy alta, Alta, Media, Baja, Muy baja
 * @param {string} cardData.impact - Impacto: Muy alta, Alta, Media, Baja, Muy baja
 * @param {string} cardData.body - Contenido del cuerpo de la página
 * @returns {Promise<Object>} - La tarjeta creada
 */
export const createCard = async (cardData) => {
  const {
    title,
    project,
    date,
    person,
    priority,
    impact,
    body,
    projectStatus
  } = cardData

  if (!title) {
    throw new Error('El título es requerido')
  }

  // Construir las propiedades
  const properties = {
    Name: notionProperties.title(title),
  }

  if (project) {
    properties.Project = notionProperties.multiSelect([project])
  }

  if (date) {
    properties.Date = notionProperties.date(date)
  }

  if (person) {
    properties.Person = notionProperties.select(person)
  }

  if (priority) {
    properties.Priority = notionProperties.select(priority)
  }

  if (impact) {
    properties.Impact = notionProperties.select(impact)
  }

  if (projectStatus) {
    properties['Project Status'] = notionProperties.select(projectStatus)
  }

  // Construir el contenido del cuerpo de la página
  const children = []
  if (body) {
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: body },
          },
        ],
      },
    })
  }

  const response = await createDatabaseItem(DATABASE_ID, properties, children)

  return response
}

/**
 * Obtiene todas las tarjetas de la base de datos
 * @param {Object} options - Opciones de filtrado
 * @param {string} options.project - Filtrar por proyecto
 * @param {string} options.person - Filtrar por persona
 * @param {string} options.priority - Filtrar por prioridad
 * @returns {Promise<Array>} - Lista de tarjetas
 */
export const getCards = async (options = {}) => {
  const { project, person, priority } = options
  
  let filter = undefined
  const filters = []

  if (project) {
    filters.push({
      property: 'Project',
      select: { equals: project },
    })
  }

  if (person) {
    filters.push({
      property: 'Person',
      select: { equals: person },
    })
  }

  if (priority) {
    filters.push({
      property: 'Prioridad',
      select: { equals: priority },
    })
  }

  if (filters.length > 0) {
    filter = filters.length === 1 ? filters[0] : { and: filters }
  }

  const results = await queryDatabase(DATABASE_ID, filter)
  return results
}

/**
 * Actualiza una tarjeta existente
 * @param {string} pageId - ID de la tarjeta/página
 * @param {Object} cardData - Datos a actualizar
 * @returns {Promise<Object>} - La tarjeta actualizada
 */
export const updateCard = async (pageId, cardData) => {
  const { title, project, date, person, priority, impact } = cardData

  const properties = {}

  if (title) {
    properties.Title = notionProperties.title(title)
  }

  if (project) {
    properties.Project = notionProperties.select(project)
  }

  if (date) {
    properties.Date = notionProperties.date(date)
  }

  if (person) {
    properties.Person = notionProperties.select(person)
  }

  if (priority) {
    properties.Prioridad = notionProperties.select(priority)
  }

  if (impact) {
    properties.Impacto = notionProperties.select(impact)
  }

  const response = await updateDatabaseItem(pageId, properties)
  return response
}

/**
 * Elimina (archiva) una tarjeta
 * @param {string} pageId - ID de la tarjeta/página
 * @returns {Promise<Object>} - Confirmación
 */
export const deleteCard = async (pageId) => {
  const response = await archiveDatabaseItem(pageId)
  return response
}
