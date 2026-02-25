'use client'

import { useState, useEffect } from 'react'
import { getItems } from '@/lib/api'
import ItemCard from '@/components/ItemCard'
import CreateItemModal from '@/components/CreateItemModal'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import Link from 'next/link'

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [filters, setFilters] = useState({ type: '', search: '' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [filters])

  async function fetchItems() {
    setIsLoading(true)
    try {
      const data = await getItems(filters)
      setItems(data)
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Your knowledge, organized and understood.
              </p>
            </div>
            
            <Link href="/">
              <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium hover:border-blue-300 transition-all shadow-lg">
                ← Home
              </button>
            </Link>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Items', value: items.length, icon: '📚', color: 'from-blue-500 to-cyan-500' },
              { label: 'This Week', value: '12', icon: '⚡', color: 'from-purple-500 to-pink-500' },
              { label: 'AI Insights', value: '48', icon: '✨', color: 'from-orange-500 to-red-500' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r {stat.color} bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
                  </div>
                  <div className="text-4xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Create */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <SearchBar 
              value={filters.search} 
              onChange={(search) => setFilters({ ...filters, search })} 
            />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all whitespace-nowrap"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">+</span> New Item
            </span>
          </button>
        </div>

        {/* Filters */}
        <div>
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {items.map((item: any) => (
            <div key={item.id}>
              <ItemCard item={item} onUpdate={fetchItems} />
            </div>
          ))}
        </div>

        {!isLoading && items.length === 0 && (
          <div className="text-center py-32">
            <div className="text-8xl mb-6">📝</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No items yet</h3>
            <p className="text-gray-500 mb-8">Start building your second brain</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl"
            >
              Create First Item
            </button>
          </div>
        )}
      </div>

      <CreateItemModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchItems}
      />
    </div>
  )
}
