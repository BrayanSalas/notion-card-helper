import { Client } from '@notionhq/client'
import fetch from 'node-fetch'

let notion = null

const getNotionClient = () => {
  if (!notion) {
    notion = new Client({
      auth: process.env.NOTION_API_KEY,
      fetch,
    })
  }
  return notion
}

/**
 * Obtiene información de una base de datos de Notion
 * @param {string} databaseId - ID de la base de datos
 * @returns {Promise<Object>} - Información de la base de datos
 */
export const getDatabase = async (databaseId) => {
  const response = await getNotionClient().databases.retrieve({
    database_id: databaseId,
  })
  return response
}

/**
 * Obtiene los elementos (páginas) de una base de datos
 * @param {string} databaseId - ID de la base de datos
 * @param {Object} filter - Filtros opcionales
 * @param {Array} sorts - Ordenamiento opcional
 * @returns {Promise<Array>} - Lista de elementos
 */
export const queryDatabase = async (databaseId, filter = undefined, sorts = undefined) => {
  const response = await getNotionClient().databases.query({
    database_id: databaseId,
    filter,
    sorts,
  })
  return response.results
}

/**
 * Crea un nuevo elemento (página/tarjeta) en una base de datos de Notion
 * @param {string} databaseId - ID de la base de datos
 * @param {Object} properties - Propiedades del elemento según el schema de la base de datos
 * @param {Array} children - Contenido de la página (bloques)
 * @returns {Promise<Object>} - El elemento creado
 */
export const createDatabaseItem = async (databaseId, properties, children = []) => {
  const response = await getNotionClient().pages.create({
    parent: {
      database_id: databaseId,
    },
    properties,
    children,
  })
  return response
}

/**
 * Actualiza un elemento existente en una base de datos
 * @param {string} pageId - ID de la página/elemento
 * @param {Object} properties - Propiedades a actualizar
 * @returns {Promise<Object>} - El elemento actualizado
 */
export const updateDatabaseItem = async (pageId, properties) => {
  const response = await getNotionClient().pages.update({
    page_id: pageId,
    properties,
  })
  return response
}

/**
 * Elimina (archiva) un elemento de una base de datos
 * @param {string} pageId - ID de la página/elemento
 * @returns {Promise<Object>} - Confirmación
 */
export const archiveDatabaseItem = async (pageId) => {
  const response = await getNotionClient().pages.update({
    page_id: pageId,
    archived: true,
  })
  return response
}

/**
 * Lista los usuarios del workspace de Notion
 * @returns {Promise<Array>} - Lista de usuarios
 */
export const listUsers = async () => {
  const response = await getNotionClient().users.list()
  return response.results
}

/**
 * Helpers para crear propiedades según el tipo
 */
export const notionProperties = {
  title: (text) => ({
    title: [{ text: { content: text } }],
  }),
  richText: (text) => ({
    rich_text: [{ text: { content: text } }],
  }),
  number: (value) => ({
    number: value,
  }),
  select: (option) => ({
    select: { name: option },
  }),
  multiSelect: (options) => ({
    multi_select: options.map((name) => ({ name })),
  }),
  date: (start, end = null) => ({
    date: { start, end },
  }),
  checkbox: (checked) => ({
    checkbox: checked,
  }),
  url: (url) => ({
    url: url,
  }),
  email: (email) => ({
    email: email,
  }),
  phone: (phone) => ({
    phone_number: phone,
  }),
}

export default getNotionClient
