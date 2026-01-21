import { sendMessage } from '../utils/telegram.util.js'
import { createSmartNotionCardTelegram } from '../controllers/notion.controller.js'

 /**
 * @author Brayan Salas
 * @description Handle Telegram webhook and respond to messages
 * @param {Object} req
 * @param {Object} res
 * @param {string} req.body.message - Message to analyze and create the card (required)
 * @param {Object} req.files - Files uploaded
 * @param {Array} req.files.images - Images uploaded
 * @return {Object} 
 */
export const telegramWebhook = async (req, res) => {
  let chatId

  try {
    console.log(req, 'req body telegram')
    res.sendStatus(200)
    
    const msg = req.body?.message
    if (!msg?.chat?.id) return
    
    chatId = msg.chat.id
    const text = msg.text || "(no text)"
    await sendMessage(chatId, `Solicitud creada para: ${text.slice(0, 20)}...`)

    const params = {
      body: {
        message: text
      }
    }

    const result = await createSmartNotionCardTelegram(params)
    if (result.error) throw new Error(result.error)

    await sendMessage(chatId, `Tarjeta creada en Notion`)
  } catch (error) {
    console.error('Error creating smart card:', error)

    if (chatId) await sendMessage(chatId, `❌ Error creating card: ${error.message}`)
  }
}
