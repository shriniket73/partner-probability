import "./globals.css"
import { Inter } from 'next/font/google'
import React from "react"
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { CSPostHogProvider } from "./providers"
import { PostHogScript } from "@/components/ui/PostHogScript"

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
        <PostHogScript />
      </head>
      <CSPostHogProvider>
        <body className={`${inter.className} relative`}>
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