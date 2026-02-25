const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:4b'

async function ollamaChat(messages, temperature = 0.3) {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: { temperature }
    })
  })
  const data = await response.json()
  return data.message.content
}

async function ollamaEmbed(text) {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: text
    })
  })
  const data = await response.json()
  return data.embedding
}

export async function generateEmbedding(text) {
  return await ollamaEmbed(text)
}

export async function generateSummary(content) {
  const response = await ollamaChat([
    { role: 'system', content: 'Create a concise 2-3 sentence summary.' },
    { role: 'user', content: `Summarize: ${content}` }
  ], 0.3)
  return response
}

export async function generateTags(title, content) {
  const response = await ollamaChat([
    { role: 'system', content: 'Extract 3-5 key tags. Return comma-separated only, no explanation.' },
    { role: 'user', content: `Title: ${title}\n\nContent: ${content}` }
  ], 0.3)
  
  const tagsString = response || ''
  return tagsString.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
}

export async function answerQuery(question, context) {
  const contextText = context.join('\n\n---\n\n')
  
  const response = await ollamaChat([
    { role: 'system', content: 'Answer based only on provided context. Cite sources.' },
    { role: 'user', content: `Context:\n${contextText}\n\nQuestion: ${question}` }
  ], 0.5)
  
  return response
}
