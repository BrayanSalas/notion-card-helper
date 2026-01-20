import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Llama al servicio de Chat Completions de OpenAI
 * @param {string} prompt - El mensaje del usuario
 * @param {Object} options - Opciones adicionales
 * @param {string} options.model - El modelo a utilizar (default: gpt-3.5-turbo)
 * @param {number} options.maxTokens - Máximo de tokens en la respuesta
 * @param {number} options.temperature - Creatividad de la respuesta (0-2)
 * @param {Array} options.messages - Array de mensajes para contexto previo
 * @returns {Promise<string>} - La respuesta del modelo
 */
export const chatCompletion = async (prompt, options = {}) => {
  const {
    model = 'gpt-3.5-turbo',
    maxTokens = 1000,
    temperature = 0.7,
    messages = [],
  } = options

  const allMessages = [
    ...messages,
    { role: 'user', content: prompt },
  ]

  const response = await openai.chat.completions.create({
    model,
    messages: allMessages,
    max_tokens: maxTokens,
    temperature,
  })

  return response.choices[0].message.content
}

/**
 * Llama al servicio de Chat Completions con un mensaje de sistema
 * @param {string} systemPrompt - El mensaje de sistema para definir el comportamiento
 * @param {string} userPrompt - El mensaje del usuario
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<string>} - La respuesta del modelo
 */
export const chatCompletionWithSystem = async (systemPrompt, userPrompt, options = {}) => {
  const {
    model = 'gpt-3.5-turbo',
    maxTokens = 1000,
    temperature = 0.7,
  } = options

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: maxTokens,
    temperature,
  })

  return response.choices[0].message.content
}

export default openai
