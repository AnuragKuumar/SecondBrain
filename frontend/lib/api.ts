const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function createItem(data: any) {
  const res = await fetch(`${API_URL}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create item')
  return res.json()
}

export async function getItems(filters?: any) {
  const params = new URLSearchParams()
  if (filters?.type) params.append('type', filters.type)
  if (filters?.search) params.append('search', filters.search)
  
  const res = await fetch(`${API_URL}/api/items?${params}`)
  if (!res.ok) throw new Error('Failed to fetch items')
  return res.json()
}

export async function getItem(id: string) {
  const res = await fetch(`${API_URL}/api/items/${id}`)
  if (!res.ok) throw new Error('Failed to fetch item')
  return res.json()
}

export async function deleteItem(id: string) {
  const res = await fetch(`${API_URL}/api/items/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete item')
  return res.json()
}

export async function queryKnowledge(question: string) {
  const res = await fetch(`${API_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })
  if (!res.ok) throw new Error('Failed to query')
  return res.json()
}
