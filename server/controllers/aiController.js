import { askFarmConnectAI } from '../services/aiService.js'

export async function askAssistant(req, res) {
  const result = await askFarmConnectAI({ question: req.body.question, context: { ...req.body.context, userId: req.user.id } })
  if (result.status === 'not_configured') return res.status(503).json(result)
  res.json(result)
}
