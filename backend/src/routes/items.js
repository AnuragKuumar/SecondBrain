import express from 'express'
import { z } from 'zod'
import * as itemsService from '../services/items.js'

const router = express.Router()

const createItemSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(['note', 'link', 'insight']),
  source_url: z.string().url().optional().or(z.literal('')),
})

router.post('/', async (req, res) => {
  try {
    console.log('Creating item:', req.body)
    const validated = createItemSchema.parse(req.body)
    const item = await itemsService.createItem(validated)
    res.status(201).json(item)
  } catch (error) {
    console.error('Error creating item:', error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    res.status(500).json({ error: 'Failed to create item', details: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      search: req.query.search,
    }
    const items = await itemsService.getItems(filters)
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const item = await itemsService.getItemById(req.params.id)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await itemsService.deleteItem(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' })
  }
})

export default router
