import { pool } from '../db/pool.js'
import { generateEmbedding, generateSummary, generateTags } from './ai.js'

export async function createItem(data) {
  const { title, content, type, source_url } = data

  try {
    const [summary, tags, embedding] = await Promise.race([
      Promise.all([
        generateSummary(content),
        generateTags(title, content),
        generateEmbedding(`${title}\n${content}`),
      ]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 30000))
    ])

    const result = await pool.query(
      `INSERT INTO items (title, content, type, source_url, summary, embedding)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, content, type, source_url, summary, JSON.stringify(embedding)]
    )

    const item = result.rows[0]

    for (const tagName of tags) {
      const tagResult = await pool.query(
        `INSERT INTO tags (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [tagName]
      )
      
      await pool.query(
        `INSERT INTO item_tags (item_id, tag_id, is_ai_generated)
         VALUES ($1, $2, true)`,
        [item.id, tagResult.rows[0].id]
      )
    }

    return item
  } catch (error) {
    console.log('AI processing failed or timed out, creating item without AI features')
    
    const result = await pool.query(
      `INSERT INTO items (title, content, type, source_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, content, type, source_url]
    )

    return result.rows[0]
  }
}

export async function getItems(filters = {}) {
  let query = `
    SELECT i.*, 
           json_agg(json_build_object('name', t.name, 'is_ai_generated', it.is_ai_generated)) 
           FILTER (WHERE t.id IS NOT NULL) as tags
    FROM items i
    LEFT JOIN item_tags it ON i.id = it.item_id
    LEFT JOIN tags t ON it.tag_id = t.id
  `
  
  const conditions = []
  const params = []
  
  if (filters.type) {
    conditions.push(`i.type = $${params.length + 1}`)
    params.push(filters.type)
  }
  
  if (filters.search) {
    conditions.push(`(i.title ILIKE $${params.length + 1} OR i.content ILIKE $${params.length + 1})`)
    params.push(`%${filters.search}%`)
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }
  
  query += ' GROUP BY i.id ORDER BY i.created_at DESC'
  
  const result = await pool.query(query, params)
  return result.rows
}

export async function getItemById(id) {
  const result = await pool.query(
    `SELECT i.*, 
            json_agg(json_build_object('name', t.name, 'is_ai_generated', it.is_ai_generated)) 
            FILTER (WHERE t.id IS NOT NULL) as tags
     FROM items i
     LEFT JOIN item_tags it ON i.id = it.item_id
     LEFT JOIN tags t ON it.tag_id = t.id
     WHERE i.id = $1
     GROUP BY i.id`,
    [id]
  )
  return result.rows[0]
}

export async function deleteItem(id) {
  await pool.query('DELETE FROM items WHERE id = $1', [id])
}

export async function semanticSearch(query, limit = 10) {
  try {
    const embedding = await generateEmbedding(query)
    
    const result = await pool.query(
      `SELECT id, title, content, type, summary,
              1 - (embedding <=> $1::vector) as similarity
       FROM items
       WHERE embedding IS NOT NULL 
         AND 1 - (embedding <=> $1::vector) > 0.7
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      [JSON.stringify(embedding), limit]
    )
    
    if (result.rows.length > 0) {
      return result.rows
    }
  } catch (error) {
    console.log('Semantic search failed, falling back to keyword search')
  }
  
  const result = await pool.query(
    `SELECT id, title, content, type, summary,
            1.0 as similarity
     FROM items
     WHERE title ILIKE $1 OR content ILIKE $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [`%${query}%`, limit]
  )
  
  return result.rows
}
