"use client"
import { useEffect, useRef, useState } from "react"
import { PromoBanner } from "@/components/promo-banner"
import { PopularEvents } from "@/components/popular-events"
import { TopLeagues } from "@/components/top-leagues"
import { DetailedMatchTables } from "@/components/detailed-match-tables"
import { ChevronDown, ChevronUp, Radio, Calendar, Target, Trophy, Gift, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

type ViewMode = 'all' | 'live' | 'fixtures'

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
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
}

export function MainContent({ 
  onAddToBetSlip, 
  isBetSlipOpen, 
  selectedLeague = null,
  filteredMatches = [],
  filteredFixtures = [],
  onClearFilters,
  onLeagueSelect,
  filterStats,
  viewMode = 'fixtures',
  onViewModeChange
}: MainContentProps) {
  const topLeaguesRef = useRef<HTMLDivElement>(null)
  const [sectionsExpanded, setSectionsExpanded] = useState(false)

  // Auto-scroll to matches when a league is selected
  useEffect(() => {
    if (selectedLeague && topLeaguesRef.current) {
      setTimeout(() => {
        topLeaguesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }, 150)
    }
  }, [selectedLeague])

  // Get current matches/fixtures based on view mode
  const getCurrentMatches = () => {
    switch (viewMode) {
      case 'live':
        return { matches: filteredMatches, fixtures: [] }
      case 'fixtures':
        return { matches: [], fixtures: filteredFixtures }
      default:
        return { matches: filteredMatches, fixtures: filteredFixtures }
    }
  }

  const { matches, fixtures } = getCurrentMatches()
  const shouldShowCollapsedSections = selectedLeague !== null
  const hasContent = matches.length > 0 || fixtures.length > 0

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 space-y-6">
        {/* Show full sections when no league is selected OR when sections are expanded */}
        {!shouldShowCollapsedSections || sectionsExpanded ? (
          <>
            <PromoBanner />
            <PopularEvents onAddToBetSlip={onAddToBetSlip} />
            
            <div ref={topLeaguesRef}>
              <TopLeagues 
                onLeagueSelect={onLeagueSelect}
                selectedLeague={selectedLeague}
              />
            </div>

            {/* Collapse Button */}
            {shouldShowCollapsedSections && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setSectionsExpanded(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Collapse Sections</span>
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Collapsed Banner */
          <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">Promos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Popular Events</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Top Leagues</span>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => setSectionsExpanded(true)}
                className="text-gray-300 hover:bg-gray-600 hover:text-white flex items-center space-x-2"
              >
                <span>View Sections</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            {selectedLeague && (
              <div className="mt-2 pt-2 border-t border-gray-600 flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Currently viewing:</span>
                <span className="text-blue-400 font-medium">{selectedLeague}</span>
              </div>
            )}
          </div>
        )}

        {/* Match Tables */}
        <DetailedMatchTables 
          onAddToBetSlip={onAddToBetSlip} 
          selectedLeague={selectedLeague}
          filteredMatches={matches}
          filteredFixtures={fixtures}
          onClearFilters={onClearFilters}
          filterStats={filterStats}
          viewMode={viewMode}
          showOnlyMatches={viewMode === 'live'}
          showOnlyFixtures={viewMode === 'fixtures'}
        />

        {/* Clear Selection Button */}
        {selectedLeague && (
          <div className="flex justify-center">
            <Button
              onClick={onClearFilters}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full px-6 py-3"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View All Leagues
            </Button>
          </div>
        )}

        {/* No Content Message */}
        {!hasContent && (
          <div className="text-center py-12">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              viewMode === 'live' ? 'bg-red-900/20' : 'bg-blue-900/20'
            }`}>
              {viewMode === 'live' ? (
                <Radio className="w-8 h-8 text-red-400 opacity-50" />
              ) : (
                <Calendar className="w-8 h-8 text-blue-400 opacity-50" />
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No {viewMode === 'live' ? 'Live Matches' : viewMode === 'fixtures' ? 'Fixtures' : 'Content'} Available
              {selectedLeague && ` in ${selectedLeague}`}
            </h3>
            
            <p className="text-gray-500 mb-6">
              {selectedLeague 
                ? 'Try viewing all leagues or switch between live matches and fixtures.'
                : 'Check back later or try a different view mode.'
              }
            </p>
            
            <div className="flex justify-center space-x-3">
              {selectedLeague && onClearFilters && (
                <Button
                  variant="outline"
                  onClick={onClearFilters}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View All Leagues
                </Button>
              )}
              
              {onViewModeChange && viewMode !== 'all' && (
                <Button
                  variant="outline"
                  onClick={() => onViewModeChange('all')}
                  className="border-yellow-600 text-yellow-400 hover:bg-yellow-500/20"
                >
                  <Target className="w-4 h-4 mr-2" />
                  View All Sports
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}