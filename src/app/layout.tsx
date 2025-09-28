import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'CoAI',
  description: 'Transform your leadership with personalized AI coaching and learning sessions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-luxury-dark text-luxury-text min-h-screen">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #d4af37',
            },
          }}
        />
      </body>
    </html>
  )
}

