import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * @author Brayan Salas
 * @description Call the Chat Completions service with a system message
 * @param {string} systemPrompt - The system message to define behavior
 * @param {string} userPrompt - The user message
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - The model's response
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
