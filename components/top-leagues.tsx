"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronUp, ChevronLeft } from "lucide-react"

export function TopLeagues() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const leagues = [
    {
      name: "UEFA Champions League",
      subtitle: "Football",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UEFA%20Champions%20League-1038OsVDMz7U7fGckCiEjuVRDYluAV.jpeg",
    },
    {
      name: "UEFA Super Cup",
      subtitle: "Football",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UEFA%20Super%20Cup-MWtYmMISUDpalNLeTVSpJOl5ipimAb.jpeg",
    },
    {
      name: "Germany DFL-Super Cup",
      subtitle: "Football",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Germany%20DFL-Super%20Cup-923Si6umQC0jwuOPS5RXrLXdLCS7A5.jpeg",
    },
    {
      name: "Spain La Liga",
      subtitle: "Football",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spain%20La%20Liga-vVMKZjwCJHTdItKFCpcbDBhQWRtEXj.png",
    },
    {
      name: "England Premier League",
      subtitle: "Football",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/England%20Premier%20League-6grdGDMet2AzcnS6FgzSpIZSBwSR0K.png",
    },
    {
      name: "Italy Serie A",
      subtitle: "Football",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/taly%20Serie%20A-9BFcrHrLend4M8bRcV3OPiWJQ9dp3j.png",
    },
  ]

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200 // Width of one card plus gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">TOP Leagues</h3>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative">
        {/* Left Navigation Arrow */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/80 text-white border border-gray-600 w-8 h-8 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}

        {/* Right Navigation Arrow */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/80 text-white border border-gray-600 w-8 h-8 rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {/* Scrollable Container */}
        <div className="relative overflow-hidden">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              width: "100%",
              maxWidth: "750px", // Show exactly 3 cards with partial 4th
            }}
          >
            {leagues.map((league, index) => (
              <div
                key={index}
                className="flex-shrink-0 text-center bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                style={{ width: "200px", minWidth: "200px" }}
              >
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mb-3 mx-auto border border-gray-600 p-2">
                  <img
                    src={league.logo || "/placeholder.svg"}
                    alt={league.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=48&width=48&text=⚽"
                    }}
                  />
                </div>
                <div className="text-white text-sm font-medium leading-tight mb-1">{league.name}</div>
                <div className="text-gray-400 text-xs">{league.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
