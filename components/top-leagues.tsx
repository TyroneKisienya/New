"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronUp, ChevronLeft } from "lucide-react"

interface TopLeaguesProps {
  onLeagueSelect?: (leagueName: string | null) => void
  selectedLeague?: string | null
}

export function TopLeagues({ onLeagueSelect, selectedLeague }: TopLeaguesProps) {
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

  const handleLeagueClick = (leagueName: string) => {
    if (onLeagueSelect) {
      // If clicking the same league, deselect it
      const newSelection = selectedLeague === leagueName ? null : leagueName
      onLeagueSelect(newSelection)
    }
  }

  // Enhanced league matching function to handle different naming conventions
  const isLeagueSelected = (leagueName: string) => {
    if (!selectedLeague) return false

    const normalize = (str: string) => str.toLowerCase().trim()
    const selectedNorm = normalize(selectedLeague)
    const leagueNorm = normalize(leagueName)

    // Direct match
    if (selectedNorm === leagueNorm) return true

    // Common league name mappings for better matching
    const leagueMappings: { [key: string]: string[] } = {
      'uefa champions league': ['champions league', 'ucl'],
      'england premier league': ['premier league', 'epl', 'english premier league'],
      'spain la liga': ['la liga', 'spanish la liga', 'laliga'],
      'italy serie a': ['serie a', 'italian serie a'],
      'germany bundesliga': ['bundesliga', 'german bundesliga'],
      'france ligue 1': ['ligue 1', 'french ligue 1'],
      'uefa europa league': ['europa league', 'uel'],
      'uefa super cup': ['super cup', 'uefa super cup'],
      'germany dfl-super cup': ['dfl-super cup', 'german super cup']
    }

    // Check if either league name maps to the other
    for (const [mainName, aliases] of Object.entries(leagueMappings)) {
      const allNames = [mainName, ...aliases]
      
      const hasSelectedLeague = allNames.some(name => selectedNorm.includes(name) || name.includes(selectedNorm))
      const hasCurrentLeague = allNames.some(name => leagueNorm.includes(name) || name.includes(leagueNorm))
      
      if (hasSelectedLeague && hasCurrentLeague) return true
    }

    // Partial matching as fallback
    return selectedNorm.includes(leagueNorm) || leagueNorm.includes(selectedNorm)
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
                className={`flex-shrink-0 text-center rounded-lg p-4 border transition-all duration-200 cursor-pointer ${
                  isLeagueSelected(league.name)
                    ? "bg-yellow-400/10 border-yellow-400/30 shadow-lg ring-2 ring-yellow-400/20"
                    : "bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-md hover:bg-gray-750"
                }`}
                style={{ width: "200px", minWidth: "200px" }}
                onClick={() => handleLeagueClick(league.name)}
              >
                <div className={`w-20 h-20 rounded-lg flex items-center justify-center mb-3 mx-auto border p-2 transition-all duration-200 ${
                  isLeagueSelected(league.name) 
                    ? "bg-yellow-50 border-yellow-300" 
                    : "bg-white border-gray-600"
                }`}>
                  <img
                    src={league.logo || "/placeholder.svg"}
                    alt={league.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=48&width=48&text=⚽"
                    }}
                  />
                </div>
                <div className={`text-sm font-medium leading-tight mb-1 transition-colors duration-200 ${
                  isLeagueSelected(league.name) ? "text-yellow-400" : "text-white"
                }`}>
                  {league.name}
                </div>
                <div className={`text-xs transition-colors duration-200 ${
                  isLeagueSelected(league.name) ? "text-yellow-300" : "text-gray-400"
                }`}>
                  {league.subtitle}
                </div>
                
                {/* Enhanced selection indicator */}
                {isLeagueSelected(league.name) && (
                  <div className="flex justify-center mt-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                )}
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