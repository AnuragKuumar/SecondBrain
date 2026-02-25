// Mock data for demo without database
export const mockItems = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    content: 'React Hooks allow you to use state and other React features without writing a class. useState, useEffect, and useContext are the most commonly used hooks.',
    type: 'note',
    summary: 'A comprehensive guide to React Hooks including useState, useEffect, and useContext.',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
    tags: [
      { name: 'react', is_ai_generated: true },
      { name: 'javascript', is_ai_generated: true },
      { name: 'hooks', is_ai_generated: true }
    ]
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    content: 'TypeScript adds static typing to JavaScript. Use interfaces for object shapes, avoid any type, and leverage union types for better type safety.',
    type: 'note',
    summary: 'Essential TypeScript practices for writing type-safe code.',
    created_at: new Date('2024-01-16').toISOString(),
    updated_at: new Date('2024-01-16').toISOString(),
    tags: [
      { name: 'typescript', is_ai_generated: true },
      { name: 'programming', is_ai_generated: true }
    ]
  },
  {
    id: '3',
    title: 'Next.js Documentation',
    content: 'Next.js is a React framework for production. It provides features like server-side rendering, static site generation, and API routes out of the box.',
    type: 'link',
    source_url: 'https://nextjs.org/docs',
    summary: 'Official Next.js documentation covering all framework features.',
    created_at: new Date('2024-01-17').toISOString(),
    updated_at: new Date('2024-01-17').toISOString(),
    tags: [
      { name: 'nextjs', is_ai_generated: true },
      { name: 'react', is_ai_generated: true },
      { name: 'framework', is_ai_generated: true }
    ]
  },
  {
    id: '4',
    title: 'AI Integration Patterns',
    content: 'When integrating AI into applications, consider rate limiting, caching responses, and handling errors gracefully. Always validate AI outputs before showing to users.',
    type: 'insight',
    summary: 'Key patterns for successfully integrating AI into production applications.',
    created_at: new Date('2024-01-18').toISOString(),
    updated_at: new Date('2024-01-18').toISOString(),
    tags: [
      { name: 'ai', is_ai_generated: true },
      { name: 'architecture', is_ai_generated: true },
      { name: 'best-practices', is_ai_generated: true }
    ]
  },
  {
    id: '5',
    title: 'Database Design Principles',
    content: 'Good database design includes normalization, proper indexing, and understanding query patterns. Use foreign keys for referential integrity.',
    type: 'note',
    summary: 'Fundamental principles for designing scalable databases.',
    created_at: new Date('2024-01-19').toISOString(),
    updated_at: new Date('2024-01-19').toISOString(),
    tags: [
      { name: 'database', is_ai_generated: true },
      { name: 'design', is_ai_generated: true }
    ]
  },
  {
    id: '6',
    title: 'Framer Motion Guide',
    content: 'Framer Motion is a production-ready motion library for React. It provides simple declarative animations with powerful features like layout animations and gestures.',
    type: 'note',
    summary: 'Complete guide to creating smooth animations with Framer Motion.',
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
    tags: [
      { name: 'animation', is_ai_generated: true },
      { name: 'react', is_ai_generated: true },
      { name: 'ui', is_ai_generated: true }
    ]
  }
]

let items = [...mockItems]
let nextId = 7

export function getAllItems(filters = {}) {
  let filtered = [...items]
  
  if (filters.type) {
    filtered = filtered.filter(item => item.type === filters.type)
  }
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(search) ||
      item.content.toLowerCase().includes(search)
    )
  }
  
  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export function getItemById(id) {
  return items.find(item => item.id === id)
}

export function createItem(data) {
  const newItem = {
    id: String(nextId++),
    ...data,
    summary: `AI-generated summary: ${data.content.slice(0, 100)}...`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { name: 'new', is_ai_generated: true },
      { name: data.type, is_ai_generated: true }
    ]
  }
  
  items.push(newItem)
  return newItem
}

export function deleteItem(id) {
  items = items.filter(item => item.id !== id)
  return true
}

export function queryKnowledge(question) {
  // Simple mock AI response
  const relevantItems = items.slice(0, 3)
  
  return {
    answer: `Based on your knowledge base, here's what I found about "${question}": ${relevantItems[0]?.content.slice(0, 150)}... This relates to several concepts in your notes including ${relevantItems[0]?.tags.map(t => t.name).join(', ')}.`,
    sources: relevantItems.map(item => ({
      id: item.id,
      title: item.title,
      type: item.type,
      excerpt: item.summary,
      relevance_score: 0.85
    }))
  }
}
