import "./globals.css"
import { Inter } from 'next/font/google'
import React from "react"
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { CSPostHogProvider } from "./providers"
import { PostHogScript } from "@/components/ui/PostHogScript"
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Partner Matching Probability Calculator",
  description: "Find your ideal partner match probability",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preload" as="image" href="/images/bg1.jpg" />
        <PostHogScript />
      </head>
      <CSPostHogProvider>
        <body className={`${inter.className} relative min-h-screen`}>
          {/* Background image container */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <Image
              src="/images/bg1.jpg"
              alt="Background"
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover"
              style={{ 
                objectFit: 'cover',
                filter: 'brightness(0.8)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          </div>
          
          {/* Content wrapper for proper z-indexing */}
          <main className="relative z-10">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
        </body>
      </CSPostHogProvider>
    </html>
  )
}