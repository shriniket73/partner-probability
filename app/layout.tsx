import "./globals.css"
import { Inter } from 'next/font/google'
import React from "react"
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Partner Matching Probability  Calculator",
  description: "Find your ideal partner match probability",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        {/* Content wrapper for proper z-indexing */}
        <main className="relative z-10">
          {children}
          <Analytics />
        <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
