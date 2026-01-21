const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`

/**
 * @author Brayan Salas
 * @description Call the Chat Completions service with a system message
 * @param {string} systemPrompt - The system message to define behavior
 * @param {string} userPrompt - The user message
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - The model's response
 */
export const sendMessage = async (chatId, text) => {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  })
}
