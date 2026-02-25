'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function SearchBar({ value, onChange }: any) {
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [localValue, onChange])

  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.01 }}
      animate={{ scale: isFocused ? 1.02 : 1 }}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
        🔍
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search your knowledge..."
        className={`w-full pl-14 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 ${
          isFocused 
            ? 'border-blue-400 shadow-lg shadow-blue-100' 
            : 'border-gray-200 shadow-md'
        }`}
      />
      {localValue && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setLocalValue('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
        >
          ×
        </motion.button>
      )}
    </motion.div>
  )
}
