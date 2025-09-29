import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import NavMenu from '@/components/NavMenu'

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
    <html lang="en">
      <body className="bg-luxury-dark text-luxury-text min-h-screen font-inter">
        <NavMenu />
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
