export async function askFarmConnectAI({ question, context = {} }) {
  if (!process.env.AI_PROVIDER_URL || !process.env.AI_API_KEY) {
    return { status: 'not_configured', message: 'FarmConnect AI is not configured. Connect an approved AI provider to enable this assistant.' }
  }
  const response = await fetch(process.env.AI_PROVIDER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AI_API_KEY}` },
    body: JSON.stringify({ question, context }),
  })
  if (!response.ok) throw new Error('AI provider request failed')
  return { status: 'ready', result: await response.json() }
}
