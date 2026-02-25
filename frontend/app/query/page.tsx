'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { queryKnowledge } from '@/lib/api'

export default function QueryPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    setAnswer('')
    setSources([])

    try {
      const data = await queryKnowledge(question)
      
      let i = 0
      const text = data.answer
      const interval = setInterval(() => {
        setAnswer(text.slice(0, i))
        i++
        if (i > text.length) clearInterval(interval)
      }, 20)
      
      setSources(data.sources || [])
    } catch (error) {
      setAnswer('Sorry, I encountered an error processing your question.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      {/* ANIMATED Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.5, 1, 1.5],
            x: [0, -100, 0],
            y: [0, -50, 0],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto p-8 relative z-10">
        {/* Header with ANIMATION */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-12"
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.1, x: -10 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-600 hover:text-purple-600 mb-6 inline-flex items-center gap-2 font-medium"
            >
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ←
              </motion.span>
              Back to Dashboard
            </motion.button>
          </Link>
          
          <motion.h1 
            className="text-7xl font-bold mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ 
              backgroundSize: "200% 200%",
              backgroundImage: "linear-gradient(to right, #1f2937, #7c3aed, #ec4899, #1f2937)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ask Your Brain
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 text-xl"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Ask questions about your knowledge. I'll search your notes and provide answers.
          </motion.p>
        </motion.div>

        {/* GLOWING Search Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <div className="relative flex gap-4 bg-white p-2 rounded-2xl shadow-2xl">
              <motion.input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What did I learn about...?"
                disabled={isLoading}
                whileFocus={{ scale: 1.01 }}
                className="flex-1 px-6 py-5 text-lg rounded-xl focus:outline-none"
              />
              
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(147, 51, 234, 0.3)",
                    "0 0 40px rgba(147, 51, 234, 0.6)",
                    "0 0 20px rgba(147, 51, 234, 0.3)",
                  ],
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity },
                }}
                className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 whitespace-nowrap"
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ⚡
                  </motion.span>
                ) : (
                  'Ask'
                )}
              </motion.button>
            </div>
          </div>
        </motion.form>

        {/* ANIMATED Answer */}
        <AnimatePresence>
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-12 relative"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-20"
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="relative p-8 bg-white rounded-2xl border-2 border-green-200 shadow-2xl">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 360] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                >
                  🧠
                </motion.div>
                
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Answer
                </h2>
                
                <motion.p 
                  className="text-gray-700 leading-relaxed text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {answer}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ANIMATED Sources */}
        <AnimatePresence>
          {sources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.h2 
                className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📚 Sources
              </motion.h2>
              
              <div className="space-y-4">
                {sources.map((source: any, index: number) => (
                  <Link key={source.id} href={`/items/${source.id}`}>
                    <motion.div
                      initial={{ opacity: 0, x: -50, rotateY: -20 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.03, 
                        x: 10,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                        transition: { duration: 0.2 }
                      }}
                      className="p-6 bg-white rounded-xl border-2 border-purple-200 cursor-pointer shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <motion.h3 
                          className="font-bold text-xl flex-1"
                          whileHover={{ x: 5 }}
                        >
                          {source.title}
                        </motion.h3>
                        
                        <motion.span 
                          className="text-sm px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {source.type}
                        </motion.span>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-2 leading-relaxed">
                        {source.excerpt}
                      </p>
                      
                      <motion.div
                        className="mt-4 text-purple-600 font-medium flex items-center gap-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Read more →
                      </motion.div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EMPTY State with ANIMATION */}
        {!answer && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-9xl mb-6"
            >
              🤔
            </motion.div>
            
            <motion.h3 
              className="text-3xl font-bold text-gray-700 mb-3"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Ask me anything!
            </motion.h3>
            
            <p className="text-gray-500 text-lg">
              I'll search through your knowledge base and provide intelligent answers
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
