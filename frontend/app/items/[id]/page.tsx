'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getItem, deleteItem } from '@/lib/api'

export default function ItemPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchItem()
  }, [params.id])

  async function fetchItem() {
    try {
      const data = await getItem(params.id as string)
      setItem(data)
    } catch (error) {
      console.error('Failed to fetch item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await deleteItem(params.id as string)
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-32 bg-surface animate-pulse mb-8" />
          <div className="h-12 w-3/4 bg-surface animate-pulse mb-4" />
          <div className="h-64 bg-surface animate-pulse" />
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Item not found</p>
          <Link href="/dashboard" className="text-accent">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-text-secondary hover:text-text-primary mb-4 inline-block">
            ← Back to Dashboard
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-md border border-border p-8"
        >
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-4xl font-semibold">{item.title}</h1>
            <span className="text-sm px-3 py-1 bg-background rounded">
              {item.type}
            </span>
          </div>

          {item.summary && (
            <div className="mb-6 p-4 bg-background rounded-md">
              <p className="text-sm font-medium text-text-secondary mb-2">AI Summary</p>
              <p className="text-text-primary">{item.summary}</p>
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm font-medium text-text-secondary mb-2">Content</p>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{item.content}</p>
            </div>
          </div>

          {item.source_url && (
            <div className="mb-6">
              <p className="text-sm font-medium text-text-secondary mb-2">Source</p>
              <a 
                href={item.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {item.source_url}
              </a>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-text-secondary mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: any) => (
                  <span 
                    key={tag.name}
                    className="text-sm px-3 py-1 bg-background rounded"
                  >
                    {tag.name}
                    {tag.is_ai_generated && (
                      <span className="ml-1 text-xs text-text-secondary">✨</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-border text-sm text-text-secondary">
            <p>Created: {new Date(item.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(item.updated_at).toLocaleString()}</p>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDelete}
              className="px-6 py-2 border border-error text-error rounded-md"
            >
              Delete
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
