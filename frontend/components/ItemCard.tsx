'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface ItemCardProps {
  item: {
    id: string
    title: string
    content: string
    type: 'note' | 'link' | 'insight'
    summary?: string
    tags?: Array<{ name: string; is_ai_generated: boolean }>
    created_at: string
  }
  onUpdate: () => void
}

export default function ItemCard({ item, onUpdate }: ItemCardProps) {
  const typeColors = {
    note: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-700', icon: '📝' },
    link: { bg: 'from-green-500 to-emerald-500', text: 'text-green-700', icon: '🔗' },
    insight: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-700', icon: '💡' },
  }

  const typeConfig = typeColors[item.type as keyof typeof typeColors]

  return (
    <Link href={`/items/${item.id}`}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
        whileHover={{ 
          y: -12, 
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.3 }
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group relative p-8 bg-white rounded-2xl border border-gray-200 h-full cursor-pointer shadow-lg overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${typeConfig.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />

        {/* Decorative corner */}
        <motion.div
          className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${typeConfig.bg} opacity-10 rounded-full blur-2xl`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <motion.h3 
            className="font-semibold text-xl line-clamp-2 flex-1 pr-4"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {item.title}
          </motion.h3>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-3xl"
          >
            {typeConfig.icon}
          </motion.div>
        </div>

        {/* Type badge */}
        <motion.span 
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-gradient-to-r ${typeConfig.bg} text-white`}
          whileHover={{ scale: 1.05 }}
        >
          {item.type}
        </motion.span>

        {/* Summary */}
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {item.summary || item.content}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag: any, index: number) => (
              <motion.span 
                key={tag.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600 font-medium"
              >
                {tag.name}
              </motion.span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
          <motion.span
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </div>
      </motion.div>
    </Link>
  )
}
