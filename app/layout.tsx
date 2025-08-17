import type { Metadata } from 'next'
import './globals.css'
import CosmicBadge from '@/components/CosmicBadge'

export const metadata: Metadata = {
  title: 'Mailchimp Campaign Manager',
  description: 'Professional email marketing management platform with AI-powered template generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string
  
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
        {bucketSlug && <CosmicBadge bucketSlug={bucketSlug} />}
      </body>
    </html>
  )
}