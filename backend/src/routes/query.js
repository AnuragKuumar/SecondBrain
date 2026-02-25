import express from 'express'
import { z } from 'zod'
import { semanticSearch } from '../services/items.js'
import { answerQuery } from '../services/ai.js'

const router = express.Router()

const querySchema = z.object({
  question: z.string().min(1),
  max_sources: z.number().optional().default(5),
})

router.post('/', async (req, res) => {
  try {
    const { question, max_sources } = querySchema.parse(req.body)
    
    const items = await semanticSearch(question, max_sources)
    
    const context = items.map(item => 
      `Title: ${item.title}\nContent: ${item.content}`
    )
    
    const answer = await answerQuery(question, context)
    
    const sources = items.map(item => ({
      id: item.id,
      title: item.title,
      type: item.type,
      excerpt: item.summary || item.content.slice(0, 200),
      relevance_score: item.similarity,
    }))
    
    res.json({ answer, sources })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    res.status(500).json({ error: 'Failed to process query' })
  }
})

export default router
