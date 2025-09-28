'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import config from '@/lib/config.json'

export default function TopicPage() {
  const params = useParams()
  const topicId = params.topic as string
  const [topic, setTopic] = useState<any>(null)

  useEffect(() => {
    if (topicId && config.topics[topicId as keyof typeof config.topics]) {
      setTopic(config.topics[topicId as keyof typeof config.topics])
    }
  }, [topicId])

  if (!topic) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
          <p className="text-luxury-text-light">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen luxury-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-luxury-gold opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Breadcrumbs */}
      <div className="relative z-10 pt-8 px-4">
        <nav className="max-w-6xl mx-auto">
          <Link href="/" className="text-luxury-gold hover:text-luxury-gold-light transition-colors">
            Home
          </Link>
          <span className="mx-2 text-luxury-text-muted">›</span>
          <span className="text-luxury-text-light capitalize">{topicId}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
            <span className="gold-text">{topic.title}</span>
          </h1>
          <p className="text-xl md:text-2xl text-luxury-text-light mb-8 font-light">
            {topic.intro}
          </p>
        </motion.div>

        {/* Learning Objectives */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-playfair font-semibold text-center mb-8 text-luxury-text">
            Learning Objectives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topic.objectives.map((objective: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="glass-effect rounded-xl p-6 luxury-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-luxury-gold/20 text-luxury-gold flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <p className="text-luxury-text-light leading-relaxed">
                  {objective}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sessions Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-playfair font-semibold text-center mb-8 text-luxury-text">
            Your Learning Journey
          </h2>
          <div className="space-y-4">
            {topic.sessions.map((session: any, index: number) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="glass-effect rounded-xl p-6 luxury-shadow hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-luxury-gold/20 text-luxury-gold flex items-center justify-center">
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-playfair font-semibold text-luxury-text">
                        {session.title}
                      </h3>
                      <p className="text-luxury-text-muted capitalize">
                        {session.type} Session
                      </p>
                    </div>
                  </div>
                  <Link href={`/topics/${topicId}/sessions/${session.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-luxury-gold/20 text-luxury-gold border border-luxury-gold px-6 py-3 rounded-lg font-semibold hover:bg-luxury-gold hover:text-luxury-dark transition-all duration-300"
                    >
                      Start Session
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <Link href={`/topics/${topicId}/sessions/${topic.sessions[0].id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-luxury-gold text-luxury-dark px-12 py-4 rounded-lg text-xl font-semibold luxury-shadow hover:shadow-2xl transition-all duration-300"
            >
              Start Your Journey
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

