"use client"
import { useEffect, useRef } from "react"
import { PromoBanner } from "@/components/promo-banner"
import { PopularEvents } from "@/components/popular-events"
import { TopLeagues } from "@/components/top-leagues"
import { DetailedMatchTables } from "@/components/detailed-match-tables"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Match {
  id: string
  league: string
  leagueLogo?: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo?: string
  awayTeamLogo?: string
  homeScore: number | null
  awayScore: number | null
  time: string
  status: string
  venue?: string
  referee?: string
  odds?: {
    home: number
    draw: number
    away: number
  }
}

interface FilterStats {
  totalMatches: number
  filteredMatches: number
  totalFixtures: number
  filteredFixtures: number
  selectedLeague: string | null
}

interface MainContentProps {
  onAddToBetSlip: (bet: any) => void
  isBetSlipOpen: boolean
  selectedLeague?: string | null
  filteredMatches?: Match[]
  filteredFixtures?: Match[]
  onClearFilters?: () => void
  onLeagueSelect?: (leagueName: string | null) => void
  filterStats?: FilterStats
}

export function MainContent({ 
  onAddToBetSlip, 
  isBetSlipOpen, 
  selectedLeague = null,
  filteredMatches = [],
  filteredFixtures = [],
  onClearFilters,
  onLeagueSelect,
  filterStats
}: MainContentProps) {
  const topLeaguesRef = useRef<HTMLDivElement>(null)
  const promoBannerRef = useRef<HTMLDivElement>(null)
  const popularEventsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to top leagues when a league is selected
  useEffect(() => {
    if (selectedLeague && topLeaguesRef.current) {
      // Small delay to ensure content has rendered
      setTimeout(() => {
        topLeaguesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }, 150)
    }
  }, [selectedLeague])

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 space-y-6">
        {/* Promo Banner - Collapsible when league selected */}
        <div 
          ref={promoBannerRef}
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            selectedLeague 
              ? 'max-h-16 opacity-60 scale-95' 
              : 'max-h-96 opacity-100 scale-100'
          }`}
        >
          {selectedLeague ? (
            // Minimized version when league is selected
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-3 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">🎯</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">
                      Focused on {selectedLeague}
                    </p>
                    <p className="text-gray-700 text-xs">
                      {filterStats ? `${filterStats.filteredMatches + filterStats.filteredFixtures} events` : 'Loading...'}
                    </p>
                  </div>
                </div>
                {onClearFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-gray-700 hover:text-gray-900 hover:bg-white/20 text-xs"
                  >
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Expand All
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <PromoBanner />
          )}
        </div>

        {/* Popular Events - Collapsible when league selected */}
        <div 
          ref={popularEventsRef}
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            selectedLeague 
              ? 'max-h-20 opacity-60 scale-95' 
              : 'max-h-96 opacity-100 scale-100'
          }`}
        >
          {selectedLeague ? (
            // Minimized version when league is selected
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 font-bold text-sm">🔥</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Popular Events</p>
                    <p className="text-gray-400 text-xs">Click to expand and view trending bets</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 text-xs"
                >
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show
                </Button>
              </div>
            </div>
          ) : (
            <PopularEvents onAddToBetSlip={onAddToBetSlip} />
          )}
        </div>
        
        {/* Top Leagues - Always visible but highlighted when filtering */}
        <div 
          ref={topLeaguesRef}
          className={`transition-all duration-300 ease-in-out ${
            selectedLeague 
              ? 'ring-2 ring-yellow-400/30 rounded-lg p-2 bg-yellow-400/5' 
              : ''
          }`}
        >
          <TopLeagues 
            onLeagueSelect={onLeagueSelect}
            selectedLeague={selectedLeague}
          />
        </div>
        
        {/* Live Matches Section - Enhanced prominence when filtering */}
        <div className={`transition-all duration-300 ease-in-out ${
          selectedLeague ? 'transform translate-y-0' : ''
        }`}>
          <DetailedMatchTables 
            onAddToBetSlip={onAddToBetSlip} 
            selectedLeague={selectedLeague}
            filteredMatches={filteredMatches}
            filteredFixtures={filteredFixtures}
            onClearFilters={onClearFilters}
            filterStats={filterStats}
          />
        </div>

        {/* Restore Full View Button - Only visible when league is selected */}
        {selectedLeague && (
          <div className="sticky bottom-4 left-0 right-0 flex justify-center">
            <Button
              onClick={onClearFilters}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-6 py-3"
            >
              <ChevronUp className="w-4 h-4 mr-2" />
              View All Leagues & Events
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}