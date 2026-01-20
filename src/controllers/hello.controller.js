import { getHelloMessage } from '../services/hello.service.js'

export const getHello = (req, res) => {
  try {
    const message = getHelloMessage()
    res.status(200).json({ message })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
