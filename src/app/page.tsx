'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const topics = [
  {
    id: 'leadership',
    title: 'Leadership Excellence',
    description: 'Master situational leadership to adapt your style to any team member\'s development stage.',
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'feedback',
    title: 'Feedback Mastery',
    description: 'Develop radical candor skills to give and receive feedback that drives growth.',
    color: 'from-green-500 to-teal-500'
  }
]

const exploreTexts = [
  'Leadership Excellence',
  'Feedback Mastery'
]

export default function HomePage() {
  const [currentExploreText, setCurrentExploreText] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExploreText((prev) => (prev + 1) % exploreTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen luxury-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-luxury-gold opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-accent opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Menu */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="bg-white/80 backdrop-blur-sm text-luxury-text px-4 py-2 rounded-lg font-semibold luxury-shadow"
        >
          Menu
        </motion.button>
        
        <AnimatePresence>
          {isNavOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-12 right-0 bg-white/90 backdrop-blur-sm rounded-lg p-4 luxury-shadow min-w-[200px]"
            >
              {topics.map((topic) => (
                <Link key={topic.id} href={`/topics/${topic.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="py-2 px-3 rounded-md hover:bg-luxury-accent/10 transition-colors cursor-pointer"
                  >
                    {topic.title}
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

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
          <p className="text-xl md:text-2xl text-luxury-text/80 mb-8 font-light">
            Transform your leadership and communication skills with personalized AI coaching sessions
          </p>
          
          {/* Rotating Explore Section */}
          <div className="mb-12">
            <div 
              className="relative inline-block cursor-pointer"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl md:text-4xl font-playfair font-semibold text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-luxury-text">Explore</span>
                  <div className="w-48 md:w-64 text-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentExploreText}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block bg-gradient-to-r from-luxury-accent to-luxury-accent-light bg-clip-text text-transparent"
                      >
                        {exploreTexts[currentExploreText]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-full left-0 mt-4 bg-white/90 backdrop-blur-sm rounded-lg luxury-shadow min-w-[250px] z-10"
                  >
                    {topics.map((topic, index) => (
                      <Link key={topic.id} href={`/topics/${topic.id}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 border-b border-luxury-light-gray/20 last:border-b-0 hover:bg-luxury-accent/10 transition-colors cursor-pointer"
                        >
                          <h3 className="font-playfair font-semibold text-luxury-text">
                            {topic.title}
                          </h3>
                          <p className="text-sm text-luxury-text-light mt-1">
                            {topic.description}
                          </p>
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
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

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center text-luxury-text-light"
        >
          <p className="text-sm">
            Powered by advanced AI • Designed for executive excellence
          </p>
        </motion.div>
      </div>
    </div>
  )
}

