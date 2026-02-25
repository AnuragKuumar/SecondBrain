'use client'

export default function FilterBar({ filters, onChange }: any) {
  const types = [
    { value: 'all', label: 'All', icon: '📚', gradient: 'from-gray-500 to-gray-600' },
    { value: 'note', label: 'Notes', icon: '📝', gradient: 'from-blue-500 to-cyan-500' },
    { value: 'link', label: 'Links', icon: '🔗', gradient: 'from-green-500 to-emerald-500' },
    { value: 'insight', label: 'Insights', icon: '💡', gradient: 'from-purple-500 to-pink-500' },
  ]

  return (
    <div className="flex gap-3 mb-8 flex-wrap">
      {types.map((type) => {
        const isActive = (type.value === 'all' && !filters.type) || filters.type === type.value
        
        return (
          <button
            key={type.value}
            onClick={() => onChange({ ...filters, type: type.value === 'all' ? '' : type.value })}
            className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-r ${type.gradient} text-white shadow-lg scale-105`
                : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:scale-105'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{type.icon}</span>
              {type.label}
            </span>
            
            {/* Glow effect on active */}
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-r ${type.gradient} opacity-30 blur-xl rounded-xl -z-10`} />
            )}
          </button>
        )
      })}
    </div>
  )
}
