import "./globals.css"
import React from "react"

export const metadata = {
  title: "Partner Matching Probability  Calculator",
  description: "Find your ideal partner match probability",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-white min-h-screen">{children}</body>
    </html>
  )
}
