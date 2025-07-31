"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="transition-opacity duration-1000 ease-in-out" style={{ opacity }}>
        <div className="relative">
          {/* Crown */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
              <path d="M8 20L12 8L20 15L28 8L32 20H8Z" fill="#D4AF37" stroke="#F4D03F" strokeWidth="1" />
              <circle cx="12" cy="8" r="3" fill="#F4D03F" />
              <circle cx="20" cy="5" r="4" fill="#F4D03F" />
              <circle cx="28" cy="8" r="3" fill="#F4D03F" />
            </svg>
          </div>

          {/* Main Shield */}
          <div className="relative bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg p-1">
            <div className="bg-gray-800 rounded-md p-8 relative">
              {/* Letter P */}
              <div className="text-6xl font-bold text-yellow-400 text-center font-serif">P</div>
            </div>
          </div>

          {/* Left Laurel */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12">
            <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
              <path
                d="M35 10C30 15 25 20 20 25C25 30 30 35 35 40C30 45 25 50 20 55C25 60 30 65 35 70"
                stroke="#D4AF37"
                strokeWidth="2"
                fill="none"
              />
              <path d="M30 12C28 14 26 16 24 18C26 20 28 22 30 24" stroke="#D4AF37" strokeWidth="1" fill="none" />
              <path d="M30 32C28 34 26 36 24 38C26 40 28 42 30 44" stroke="#D4AF37" strokeWidth="1" fill="none" />
              <path d="M30 52C28 54 26 56 24 58C26 60 28 62 30 64" stroke="#D4AF37" strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* Right Laurel */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 scale-x-[-1]">
            <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
              <path
                d="M35 10C30 15 25 20 20 25C25 30 30 35 35 40C30 45 25 50 20 55C25 60 30 65 35 70"
                stroke="#D4AF37"
                strokeWidth="2"
                fill="none"
              />
              <path d="M30 12C28 14 26 16 24 18C26 20 28 22 30 24" stroke="#D4AF37" strokeWidth="1" fill="none" />
              <path d="M30 32C28 34 26 36 24 38C26 40 28 42 30 44" stroke="#D4AF37" strokeWidth="1" fill="none" />
              <path d="M30 52C28 54 26 56 24 58C26 60 28 62 30 64" stroke="#D4AF37" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-yellow-400 text-center mt-8 text-lg font-semibold tracking-wider">PRIMEBET</div>

        {/* Loading dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  )
}
