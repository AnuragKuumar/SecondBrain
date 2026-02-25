'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createItem } from '@/lib/api'

export default function CreateItemModal({ isOpen, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'note' as 'note' | 'link' | 'insight',
    source_url: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createItem(formData)
      onSuccess()
      onClose()
      setFormData({ title: '', content: '', type: 'note', source_url: '' })
    } catch (error) {
      console.error('Failed to create item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-6">Create New Item</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md focus:border-accent"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <div className="flex gap-3">
                    {(['note', 'link', 'insight'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={`px-4 py-2 rounded-md border ${
                          formData.type === type
                            ? 'bg-accent text-white border-accent'
                            : 'border-border'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md focus:border-accent min-h-[200px]"
                    required
                  />
                </div>

                {formData.type === 'link' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Source URL</label>
                    <input
                      type="url"
                      value={formData.source_url}
                      onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-md focus:border-accent"
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-border rounded-md"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-accent text-white rounded-md disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
