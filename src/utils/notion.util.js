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
 * @author Brayan Salas
 * @description Create a new item (page/card) in a Notion database
 * @param {string} databaseId - ID of the database
 * @param {Object} properties - Properties of the item according to the database schema
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
 * Helpers to create properties according to the type
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
