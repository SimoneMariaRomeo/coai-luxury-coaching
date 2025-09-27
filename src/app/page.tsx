'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const topics = [
  {
    id: 'leadership',
    title: 'Leadership Excellence',
    description: 'Master situational leadership to adapt your style to any team member\'s development stage.',
    color: 'from-blue-600 to-purple-600'
  },
  {
    id: 'feedback',
    title: 'Feedback Mastery',
    description: 'Develop radical candor skills to give and receive feedback that drives growth.',
    color: 'from-green-600 to-teal-600'
  },
  {
    id: 'change-management',
    title: 'Change Management',
    description: 'Navigate organizational change with confidence and inspire others through transformation.',
    color: 'from-orange-600 to-red-600'
  }
]

export default function HomePage() {
  const [currentTopic, setCurrentTopic] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopic((prev) => (prev + 1) % topics.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen luxury-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-luxury-gold opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-6">
            <span className="gold-text">CoAI</span>
          </h1>
          <p className="text-xl md:text-2xl text-luxury-white/80 mb-8 font-light">
            Transform your leadership and communication skills with personalized AI coaching sessions
          </p>
          <p className="text-lg text-luxury-white/60 mb-12 max-w-2xl mx-auto">
            Experience luxury executive coaching powered by AI. Develop your leadership style, master feedback, and accelerate your professional growth.
          </p>
          
          {/* CTA Button */}
          <Link href="/topics/leadership/sessions/reflect-ideal-leader">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-luxury-gold text-luxury-dark px-12 py-4 rounded-lg text-xl font-semibold luxury-shadow hover:shadow-2xl transition-all duration-300"
            >
              Start Coaching
            </motion.button>
          </Link>
        </motion.div>

        {/* Topic Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-playfair font-semibold text-center mb-12 text-luxury-white/90">
            Explore Learning Journeys
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`glass-effect rounded-2xl p-8 luxury-shadow hover:shadow-2xl transition-all duration-300 ${
                  currentTopic === index ? 'ring-2 ring-luxury-gold' : ''
                }`}
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${topic.color} mb-6 flex items-center justify-center`}>
                  <span className="text-2xl font-bold text-white">
                    {topic.id === 'leadership' ? '👑' : topic.id === 'feedback' ? '💬' : '🔄'}
                  </span>
                </div>
                <h3 className="text-2xl font-playfair font-semibold mb-4 text-luxury-white">
                  {topic.title}
                </h3>
                <p className="text-luxury-white/70 mb-6 leading-relaxed">
                  {topic.description}
                </p>
                <Link href={`/topics/${topic.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-luxury-gold/20 text-luxury-gold border border-luxury-gold px-6 py-3 rounded-lg font-semibold hover:bg-luxury-gold hover:text-luxury-dark transition-all duration-300"
                  >
                    Explore Journey
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center text-luxury-white/50"
        >
          <p className="text-sm">
            Powered by advanced AI • Designed for executive excellence
          </p>
        </motion.div>
      </div>
    </div>
  )
}

