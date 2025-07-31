"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronLeft, ChevronRight, Star } from "lucide-react"

interface PopularEventsProps {
  onAddToBetSlip: (bet: any) => void
}

export function PopularEvents({ onAddToBetSlip }: PopularEventsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const events = [
    {
      id: "1",
      time: "19:00 31.08",
      competition: "⚽ Football: Austin: The Waco Cup",
      team1: "Enumclaw United",
      team2: "Black Diamond FC",
      odds: { home: 2.44, draw: 4.12, away: 2.52 },
      additionalBet: "+222",
    },
    {
      id: "2",
      time: "20:00 30.08",
      competition: "⚽ Football: Dallas: Friendly match",
      team1: "Toppentish SC",
      team2: "Zillah City",
      odds: { home: 2.79, draw: 5.45, away: 4.04 },
      additionalBet: "+220",
    },
    {
      id: "3",
      time: "19:00 29.08",
      competition: "⚽ Football: Premier League",
      team1: "Snohomish FC",
      team2: "Lake Stevens",
      odds: { home: 1.85, draw: 3.25, away: 4.15 },
      additionalBet: "+185",
    },
    {
      id: "4",
      time: "21:30 31.08",
      competition: "⚽ Football: Championship",
      team1: "Bellevue United",
      team2: "Tacoma FC",
      odds: { home: 2.15, draw: 3.45, away: 3.2 },
      additionalBet: "+315",
    },
    {
      id: "5",
      time: "18:45 01.09",
      competition: "⚽ Football: League Cup",
      team1: "Seattle Sounders",
      team2: "Portland Timbers",
      odds: { home: 1.95, draw: 3.6, away: 3.85 },
      additionalBet: "+260",
    },
  ]

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // Width of one card plus gap
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
        <h3 className="text-white font-semibold">Popular Events</h3>
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
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              width: "100%",
              maxWidth: "750px", // Constrains to show exactly 2.25 cards (300px * 2 + 50px partial + gaps)
            }}
          >
            {events.map((event) => (
              <Card
                key={event.id}
                className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-200 relative overflow-hidden flex-shrink-0"
                style={{ width: "300px", minWidth: "300px" }} // Fixed width with minWidth to prevent shrinking
              >
                {/* Rest of the card content remains the same */}
                <CardContent className="p-4">
                  {/* Header with Time and Star */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 text-sm font-bold px-3 py-1.5 rounded-full">
                      🔒 {event.time}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Teams Section */}
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    {/* Home Team */}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border-2 border-gray-600 flex items-center justify-center mb-2 shadow-lg">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <span className="text-gray-800 text-lg">👕</span>
                        </div>
                      </div>
                    </div>

                    {/* VS */}
                    <div className="text-yellow-400 font-bold text-xl">VS</div>

                    {/* Away Team */}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border-2 border-gray-600 flex items-center justify-center mb-2 shadow-lg">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <span className="text-gray-800 text-lg">👕</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Competition Info */}
                  <div className="text-center mb-3">
                    <div className="text-gray-300 text-sm font-medium">{event.competition}</div>
                  </div>

                  {/* Team Names */}
                  <div className="text-center mb-4">
                    <div className="text-white font-semibold text-base leading-tight">{event.team1}</div>
                    <div className="text-white font-semibold text-base leading-tight mt-1">{event.team2}</div>
                  </div>

                  {/* Betting Odds */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 flex flex-col py-3 h-auto transition-all duration-200"
                      onClick={() =>
                        onAddToBetSlip({
                          id: `${event.id}-home`,
                          match: `${event.team1} vs ${event.team2}`,
                          bet: event.team1,
                          odds: event.odds.home,
                        })
                      }
                    >
                      <span className="text-gray-400 text-xs font-medium">1</span>
                      <span className="font-bold text-sm">{event.odds.home}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 flex flex-col py-3 h-auto transition-all duration-200"
                      onClick={() =>
                        onAddToBetSlip({
                          id: `${event.id}-draw`,
                          match: `${event.team1} vs ${event.team2}`,
                          bet: "Draw",
                          odds: event.odds.draw,
                        })
                      }
                    >
                      <span className="text-gray-400 text-xs font-medium">X</span>
                      <span className="font-bold text-sm">{event.odds.draw}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 flex flex-col py-3 h-auto transition-all duration-200"
                      onClick={() =>
                        onAddToBetSlip({
                          id: `${event.id}-away`,
                          match: `${event.team1} vs ${event.team2}`,
                          bet: event.team2,
                          odds: event.odds.away,
                        })
                      }
                    >
                      <span className="text-gray-400 text-xs font-medium">2</span>
                      <span className="font-bold text-sm">{event.odds.away}</span>
                    </Button>
                  </div>

                  {/* Additional Bet Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-2.5 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                    onClick={() =>
                      onAddToBetSlip({
                        id: `${event.id}-additional`,
                        match: `${event.team1} vs ${event.team2}`,
                        bet: "Additional Bet",
                        odds: Number.parseFloat(event.additionalBet.replace("+", "")),
                      })
                    }
                  >
                    {event.additionalBet}
                  </Button>
                </CardContent>
              </Card>
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
