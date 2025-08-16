"use client"
import { useEffect, useRef, useState } from "react"
import { PromoBanner } from "@/components/promo-banner"
import { PopularEvents } from "@/components/popular-events"
import { TopLeagues } from "@/components/top-leagues"
import { DetailedMatchTables } from "@/components/detailed-match-tables"
import { ChevronDown, ChevronUp, Radio, Calendar, Target, Trophy, Clock, TrendingUp, Maximize2, Sparkles, Gift, Star } from "lucide-react"
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

  // Auto-scroll to matches when a league is selected or view mode changes
  useEffect(() => {
    if ((selectedLeague || viewMode !== 'all') && topLeaguesRef.current) {
      // Small delay to ensure content has rendered
      setTimeout(() => {
        topLeaguesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }, 150)
    }
  }, [selectedLeague, viewMode])

  // Get current content based on view mode
  const getCurrentContent = () => {
    switch (viewMode) {
      case 'live':
        return {
          matches: filteredMatches,
          fixtures: [],
          title: 'Live Matches',
          subtitle: `${filteredMatches.length} live matches available`,
          icon: <Radio className="w-4 h-4 text-red-500" />,
          accentColor: 'red'
        }
      case 'fixtures':
        return {
          matches: [],
          fixtures: filteredFixtures,
          title: 'Upcoming Fixtures',
          subtitle: `${filteredFixtures.length} fixtures scheduled`,
          icon: <Calendar className="w-4 h-4 text-blue-500" />,
          accentColor: 'blue'
        }
      default:
        return {
          matches: filteredMatches,
          fixtures: filteredFixtures,
          title: 'All Sports',
          subtitle: `${filteredMatches.length + filteredFixtures.length} total events`,
          icon: <Target className="w-4 h-4 text-yellow-500" />,
          accentColor: 'yellow'
        }
    }
  }

  const currentContent = getCurrentContent()
  const shouldShowCollapsedSections = selectedLeague !== null

  const handleExpandSections = () => {
    setSectionsExpanded(true)
  }

  const handleCollapseSections = () => {
    setSectionsExpanded(false)
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 space-y-6">
        {/* Show full sections when no league is selected OR when sections are expanded */}
        {!shouldShowCollapsedSections || sectionsExpanded ? (
          <>
            {/* Promo Banner */}
            <PromoBanner />
            
            {/* Popular Events */}
            <PopularEvents onAddToBetSlip={onAddToBetSlip} />
            
            {/* Top Leagues */}
            <div ref={topLeaguesRef}>
              <TopLeagues 
                onLeagueSelect={onLeagueSelect}
                selectedLeague={selectedLeague}
              />
            </div>

            {/* Collapse Button - Show when league is selected and sections are expanded */}
            {shouldShowCollapsedSections && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleCollapseSections}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Collapse Sections</span>
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Simplified Collapsed Banner */
          <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Simple text labels instead of heavy components */}
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
              </div>

              {/* Expand Button */}
              <Button
                variant="ghost"
                onClick={handleExpandSections}
                className="text-gray-300 hover:bg-gray-600 hover:text-white flex items-center space-x-2 px-4 py-2"
              >
                <span>View Sections</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Currently viewing indicator */}
            {selectedLeague && (
              <div className="mt-2 pt-2 border-t border-gray-600 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-400">Currently viewing:</span>
                  <span className="text-blue-400 font-medium">{selectedLeague}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Match Tables Section - Always shown with proper data passing */}
        <div className="transition-all duration-300 ease-in-out">
          <DetailedMatchTables 
            onAddToBetSlip={onAddToBetSlip} 
            selectedLeague={selectedLeague}
            filteredMatches={currentContent.matches}
            filteredFixtures={currentContent.fixtures}
            onClearFilters={onClearFilters}
            filterStats={filterStats}
            viewMode={viewMode}
            showOnlyMatches={viewMode === 'live'}
            showOnlyFixtures={viewMode === 'fixtures'}
          />
        </div>

        {/* Clear Selection Button - Only visible when league is selected */}
        {selectedLeague && (
          <div className="sticky bottom-4 left-0 right-0 flex justify-center">
            <Button
              onClick={onClearFilters}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-6 py-3"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View All Leagues
            </Button>
          </div>
        )}

        {/* View Mode Success State - Show when content is available */}
        {((viewMode === 'live' && filteredMatches.length > 0) || 
          (viewMode === 'fixtures' && filteredFixtures.length > 0) ||
          (viewMode === 'all')) && (
          <div className={`rounded-lg p-3 border ${
            viewMode === 'live'
              ? 'bg-red-900/10 border-red-500/20'
              : viewMode === 'fixtures'
              ? 'bg-blue-900/10 border-blue-500/20'
              : 'bg-yellow-900/10 border-yellow-500/20'
          }`}>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                viewMode === 'live' ? 'bg-red-400' : viewMode === 'fixtures' ? 'bg-blue-400' : 'bg-yellow-400'
              }`}></div>
              <span className="text-gray-400">
                {viewMode === 'live' 
                  ? 'Live matches are updating in real-time'
                  : viewMode === 'fixtures'
                  ? 'Fixture information is updated regularly'
                  : 'All sports content is displayed'
                }
                {selectedLeague && ` • Filtered by ${selectedLeague}`}
              </span>
            </div>
          </div>
        )}

        {/* No Content Message */}
        {((viewMode === 'live' && filteredMatches.length === 0) || 
          (viewMode === 'fixtures' && filteredFixtures.length === 0)) && (
          <div className="text-center py-12">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              viewMode === 'live' 
                ? 'bg-red-900/20' 
                : 'bg-blue-900/20'
            }`}>
              {viewMode === 'live' ? (
                <Radio className="w-8 h-8 text-red-400 opacity-50" />
              ) : (
                <Calendar className="w-8 h-8 text-blue-400 opacity-50" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No {viewMode === 'live' ? 'Live Matches' : 'Fixtures'} Available
              {selectedLeague && ` in ${selectedLeague}`}
            </h3>
            <p className="text-gray-500 mb-6">
              {viewMode === 'live' 
                ? selectedLeague 
                  ? 'There are currently no live matches in this league. Try viewing all leagues or check fixtures.'
                  : 'There are currently no live matches. Check back later or view upcoming fixtures.'
                : selectedLeague
                  ? 'There are no upcoming fixtures in this league. Try viewing all leagues or check live matches.'
                  : 'There are no upcoming fixtures scheduled. Check live matches or try again later.'
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
              {viewMode === 'live' && onViewModeChange && (
                <Button
                  variant="outline"
                  onClick={() => onViewModeChange('fixtures')}
                  className="border-blue-600 text-blue-400 hover:bg-blue-500/20"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Fixtures
                </Button>
              )}
              {viewMode === 'fixtures' && onViewModeChange && (
                <Button
                  variant="outline"
                  onClick={() => onViewModeChange('live')}
                  className="border-red-600 text-red-400 hover:bg-red-500/20"
                >
                  <Radio className="w-4 h-4 mr-2" />
                  View Live Matches
                </Button>
              )}
              {onViewModeChange && (
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