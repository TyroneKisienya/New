"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Star, Loader2, AlertCircle, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { useLiveFootballData } from "@/hooks/use-live-football-data"
import { useFixtureData } from "@/hooks/use-fixture-data"

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

type ViewMode = 'all' | 'live' | 'fixtures'

interface DetailedMatchTablesProps {
  onAddToBetSlip: (bet: any) => void
  selectedLeague?: string | null
  filteredMatches?: Match[]
  filteredFixtures?: Match[]
  onClearFilters?: () => void
  filterStats?: FilterStats
  viewMode?: ViewMode
  showOnlyMatches?: boolean
  showOnlyFixtures?: boolean
  selectedBets?: any[]
}

export function DetailedMatchTables({ 
  onAddToBetSlip, 
  selectedLeague = null,
  filteredMatches = [],
  filteredFixtures = [],
  onClearFilters,
  filterStats,
  viewMode = 'fixtures',
  showOnlyMatches = false,
  showOnlyFixtures = false,
  selectedBets = []
}: DetailedMatchTablesProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  
  // Always use the original hooks to get fresh data
  const { matches: originalMatches, loading, error, isUsingMockData } = useLiveFootballData()
  const { 
    fixtures: originalFixtures, 
    loading: fixtureLoading, 
    error: fixtureError, 
    selectedDate,
    goToPreviousDate,
    goToNextDate,
    goToToday,
    canGoToPrevious,
    canGoToNext
  } = useFixtureData()

  // Helper function to check if a bet is selected - FIXED
  const isBetSelected = (betId: string) => {
    console.log('🎯 Checking bet selection:', { betId, selectedBets: selectedBets.map(b => b.id) })
    return selectedBets.some(bet => bet.id === betId)
  }

  // Determine which data to use based on props and view mode
  const matches = useMemo(() => {
    console.log('📊 Processing matches data:', {
      viewMode,
      selectedLeague,
      originalMatchesCount: originalMatches?.length || 0,
      filteredMatchesCount: filteredMatches?.length || 0,
      showOnlyMatches
    })

    // If we have filtered matches from props and a league is selected, use those
    if (selectedLeague && filteredMatches.length > 0) {
      return filteredMatches
    }
    
    // Otherwise use original matches
    return originalMatches || []
  }, [originalMatches, filteredMatches, selectedLeague, viewMode])

  const fixtures = useMemo(() => {
    console.log('📊 Processing fixtures data:', {
      viewMode,
      selectedLeague,
      originalFixturesCount: originalFixtures?.length || 0,
      filteredFixturesCount: filteredFixtures?.length || 0,
      showOnlyFixtures
    })

    // If we have filtered fixtures from props and a league is selected, use those
    if (selectedLeague && filteredFixtures.length > 0) {
      return filteredFixtures
    }
    
    // Otherwise use original fixtures
    return originalFixtures || []
  }, [originalFixtures, filteredFixtures, selectedLeague, viewMode])

  // Auto-expand sections based on view mode and data availability
  useEffect(() => {
    console.log('🎯 Auto-expanding sections:', {
      viewMode,
      selectedLeague,
      matchesCount: matches.length,
      fixturesCount: fixtures.length
    })

    const sectionsToExpand: string[] = []
    
    if (viewMode === 'live' || viewMode === 'all') {
      if (matches.length > 0) {
        sectionsToExpand.push("football")
        
        // Also expand league sections for live matches
        const groupedMatches = groupMatches(matches)
        Object.keys(groupedMatches).forEach(leagueKey => {
          sectionsToExpand.push(leagueKey)
        })
      }
    }
    
    if (viewMode === 'fixtures' || viewMode === 'all') {
      if (fixtures.length > 0) {
        sectionsToExpand.push("fixtures")
        
        // Also expand league sections for fixtures
        const groupedFixtures = groupMatches(fixtures)
        Object.keys(groupedFixtures).forEach(leagueKey => {
          sectionsToExpand.push(`fixture-${leagueKey}`)
        })
      }
    }
    
    // If no specific sections to expand but we have data, show the relevant section
    if (sectionsToExpand.length === 0) {
      if (viewMode === 'live' && matches.length === 0) {
        // Still show the football section even if no matches
        sectionsToExpand.push("football")
      }
      if (viewMode === 'fixtures' && fixtures.length === 0) {
        // Still show the fixtures section even if no fixtures
        sectionsToExpand.push("fixtures")
      }
      if (viewMode === 'all') {
        sectionsToExpand.push("football", "fixtures")
      }
    }
    
    setExpandedSections(sectionsToExpand)
  }, [selectedLeague, matches, fixtures, viewMode])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  // Helper function to group matches by league
  const groupMatches = (matchList: Match[]) => {
    return matchList.reduce((groups: any, match) => {
      const leagueKey = match.league.toLowerCase().replace(/\s+/g, '-')
      if (!groups[leagueKey]) {
        groups[leagueKey] = {
          name: match.league,
          logo: match.leagueLogo,
          matches: []
        }
      }
      groups[leagueKey].matches.push({
        id: match.id,
        time: match.time,
        status: match.status.toUpperCase(),
        homeTeam: {
          name: match.homeTeam,
          logo: match.homeTeamLogo
        },
        awayTeam: {
          name: match.awayTeam,
          logo: match.awayTeamLogo
        },
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        venue: match.venue,
        referee: match.referee,
        odds: match.odds, // Use the actual odds from the match data
        additionalBets: Math.floor(Math.random() * 50) + 10 // Mock additional bets count
      })
      return groups
    }, {})
  }

  // Group matches by league
  const groupedMatches = useMemo(() => {
    console.log('📊 Grouping matches:', { count: matches.length })
    return groupMatches(matches)
  }, [matches])

  // Group fixtures by league
  const groupedFixtures = useMemo(() => {
    console.log('📊 Grouping fixtures:', { count: fixtures.length })
    return groupMatches(fixtures)
  }, [fixtures])

  // ENHANCED BET CREATION FUNCTION
  const createBetData = (match: any, betType: 'home' | 'draw' | 'away') => {
    // Ensure we have valid odds
    if (!match.odds) {
      console.warn('⚠️ No odds available for match:', match.id)
      return null
    }

    const oddsMap = {
      home: match.odds.home,
      draw: match.odds.draw,
      away: match.odds.away
    }

    const selectionMap = {
      home: match.homeTeam.name,
      draw: "Draw",
      away: match.awayTeam.name
    }

    const betData = {
      id: `${match.id}-${betType}`,
      matchId: match.id,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      // ADD TEAM LOGOS HERE
      homeTeamLogo: match.homeTeam.logo,
      awayTeamLogo: match.awayTeam.logo,
      selection: selectionMap[betType],
      eventName: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      match: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      betType: betType,
      bet: selectionMap[betType],
      // ENSURE CORRECT ODDS ARE PASSED
      odds: Number(oddsMap[betType].toFixed(2)),
      league: match.league || 'Unknown League',
      // Additional match info that might be useful
      venue: match.venue,
      time: match.time,
      status: match.status
    }

    console.log('🎲 Creating bet data:', {
      betId: betData.id,
      betType,
      odds: betData.odds,
      selection: betData.selection,
      homeTeam: betData.homeTeam,
      awayTeam: betData.awayTeam,
      hasLogos: !!(betData.homeTeamLogo && betData.awayTeamLogo)
    })

    return betData
  }

  const renderFootballSection = () => {
    const isFootballExpanded = expandedSections.includes("football")
    const hasMatches = Object.keys(groupedMatches).length > 0
    
    // Show section if viewMode includes live matches
    const shouldShowSection = viewMode === 'live' || viewMode === 'all' || showOnlyMatches

    if (!shouldShowSection) return null

    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader
          className="bg-gray-700 text-white py-3 px-4 cursor-pointer hover:bg-gray-600 transition-colors"
          onClick={() => toggleSection("football")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">
                ⚽ {selectedLeague ? `${selectedLeague} - Live` : 'Live Football'}
              </span>
              {isUsingMockData && (
                <div className="flex items-center space-x-1 text-yellow-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">Fallback Data</span>
                </div>
              )}
              {error && !isUsingMockData && (
                <div className="flex items-center space-x-1 text-orange-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">API Error</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />}
              {isFootballExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </CardHeader>

        {isFootballExpanded && (
          <CardContent className="p-0">
            {hasMatches ? (
              Object.entries(groupedMatches).map(([leagueKey, leagueData]) => renderLeague(leagueKey, leagueData))
            ) : (
              <div className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <p className="text-yellow-400 mb-2">
                  {selectedLeague ? `No live matches for ${selectedLeague}` : 'No live matches available'}
                </p>
                <p className="text-gray-500 text-sm">Check back later for live matches</p>
                {selectedLeague && onClearFilters && (
                  <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="mt-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
                  >
                    View All Leagues
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    )
  }

  const renderFixtureSection = () => {
    const isFixtureExpanded = expandedSections.includes("fixtures")
    const hasFixtures = Object.keys(groupedFixtures).length > 0
    
    // Show section if viewMode includes fixtures
    const shouldShowSection = viewMode === 'fixtures' || viewMode === 'all' || showOnlyFixtures

    if (!shouldShowSection) return null

    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader
          className="bg-gray-700 text-white py-3 px-4 cursor-pointer hover:bg-gray-600 transition-colors"
          onClick={() => toggleSection("fixtures")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">
                📅 {selectedLeague ? `${selectedLeague} - Fixtures` : 'Fixtures'}
              </span>
              {fixtureError && (
                <div className="flex items-center space-x-1 text-orange-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">API Error</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {fixtureLoading && <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />}
              {isFixtureExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </CardHeader>

        {isFixtureExpanded && (
          <CardContent className="p-0">
            {/* Date Navigation */}
            <div className="bg-gray-750 border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousDate}
                  disabled={!canGoToPrevious || fixtureLoading}
                  className="text-white hover:text-yellow-400 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  {selectedDate.toDateString() !== new Date().toDateString() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goToToday}
                      className="text-yellow-400 hover:text-yellow-300 text-xs"
                    >
                      Today
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextDate}
                  disabled={!canGoToNext || fixtureLoading}
                  className="text-white hover:text-yellow-400 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Fixtures Content */}
            {hasFixtures ? (
              Object.entries(groupedFixtures).map(([leagueKey, leagueData]) => 
                renderLeague(`fixture-${leagueKey}`, leagueData)
              )
            ) : (
              <div className="bg-white p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">
                  {selectedLeague 
                    ? `No fixtures for ${selectedLeague} on this date` 
                    : 'No fixtures available for this date'
                  }
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {selectedLeague 
                    ? 'Try viewing all leagues or select a different date'
                    : 'Try selecting a different date'
                  }
                </p>
                {selectedLeague && onClearFilters && (
                  <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="text-yellow-600 border-yellow-400 hover:bg-yellow-50"
                  >
                    View All Leagues
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    )
  }

  const renderLeague = (leagueKey: string, leagueData: any) => {
    const isExpanded = expandedSections.includes(leagueKey)
    const isFixtureLeague = leagueKey.startsWith('fixture-')

    return (
      <div key={leagueKey} className="border-t border-gray-700">
        {/* League Header */}
        <div
          className="bg-yellow-500 text-gray-900 py-2 px-4 cursor-pointer hover:bg-yellow-600 transition-colors"
          onClick={() => toggleSection(leagueKey)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={leagueData.logo || "/placeholder.svg"}
                alt={leagueData.name}
                className="w-5 h-5"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=20&width=20&text=🏆"
                }}
              />
              <span className="font-semibold text-sm">
                🏆 {leagueData.name}
                {isFixtureLeague && " (Fixtures)"}
              </span>
              <span className="text-xs opacity-75">({leagueData.matches.length} matches)</span>
            </div>
            <div className="flex items-center space-x-4">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Matches - Always show when league is selected, otherwise follow expand state */}
        {(isExpanded || selectedLeague) && (
          <div className="bg-white">
            {leagueData.matches.map((match: any, index: number) => (
              <div
                key={match.id}
                className={`flex items-center py-3 px-4 hover:bg-gray-50 transition-colors ${
                  index % 2 === 1 ? "bg-blue-50" : "bg-white"
                }`}
              >
                {/* Time and Teams */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-gray-600 text-sm font-medium">{match.time}</span>
                    <div className="w-4 h-4 text-gray-400">📅</div>
                    {match.status === "LIVE" && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-600 text-xs font-bold">LIVE</span>
                      </div>
                    )}
                    {match.status === "FINISHED" && (
                      <div className="flex items-center space-x-1">
                        <span className="text-green-600 text-xs font-bold">FT</span>
                      </div>
                    )}
                    {match.venue && <span className="text-gray-400 text-xs">📍 {match.venue}</span>}
                  </div>

                  {/* Home Team */}
                  <div className="flex items-center space-x-2 mb-1">
                    <img
                      src={match.homeTeam.logo || "/placeholder.svg"}
                      alt={match.homeTeam.name}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=24&width=24&text=H"
                      }}
                    />
                    <span className="text-gray-900 text-sm font-medium">{match.homeTeam.name}</span>
                    {match.homeScore !== null && <span className="text-gray-700 font-bold">({match.homeScore})</span>}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center space-x-2">
                    <img
                      src={match.awayTeam.logo || "/placeholder.svg"}
                      alt={match.awayTeam.name}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=24&width=24&text=A"
                      }}
                    />
                    <span className="text-gray-900 text-sm font-medium">{match.awayTeam.name}</span>
                    {match.awayScore !== null && <span className="text-gray-700 font-bold">({match.awayScore})</span>}
                  </div>

                  {/* Additional Match Info */}
                  {match.referee && <div className="text-gray-400 text-xs mt-1">👨‍⚖️ {match.referee}</div>}
                </div>

                {/* Additional Bet */}
                <div className="px-3">
                  <span className="text-gray-600 text-sm font-medium">+{match.additionalBets}</span>
                </div>

                {/* Betting Odds - ENHANCED VERSION */}
                {match.odds && match.status !== "FINISHED" && (
                  <div className="flex flex-col items-center space-y-1">
                    {/* 1X2 Headers aligned with odds buttons */}
                    <div className="flex items-center space-x-2 text-xs text-gray-600 font-medium">
                      <div className="min-w-12 text-center">1</div>
                      <div className="min-w-12 text-center">X</div>
                      <div className="min-w-12 text-center">2</div>
                    </div>
                    
                    {/* Betting Odds Buttons */}
                    <div className="flex items-center space-x-2">
                      {/* Home Bet */}
                      <Button
                        variant="outline"
                        size="sm"
                        className={`px-3 py-1 text-sm font-medium min-w-12 h-8 transition-all ${
                          isBetSelected(`${match.id}-home`)
                            ? "bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-600 hover:border-yellow-600"
                            : "bg-gray-100 border-gray-300 text-gray-900 hover:bg-blue-100 hover:border-blue-300"
                        }`}
                        onClick={() => {
                          const betData = createBetData(match, 'home')
                          if (betData) {
                            console.log('🏠 Home bet clicked:', betData)
                            onAddToBetSlip(betData)
                          }
                        }}
                      >
                        {match.odds.home.toFixed(2)}
                      </Button>

                      {/* Draw Bet */}
                      <Button
                        variant="outline"
                        size="sm"
                        className={`px-3 py-1 text-sm font-medium min-w-12 h-8 transition-all ${
                          isBetSelected(`${match.id}-draw`)
                            ? "bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-600 hover:border-yellow-600"
                            : "bg-gray-100 border-gray-300 text-gray-900 hover:bg-blue-100 hover:border-blue-300"
                        }`}
                        onClick={() => {
                          const betData = createBetData(match, 'draw')
                          if (betData) {
                            console.log('🤝 Draw bet clicked:', betData)
                            onAddToBetSlip(betData)
                          }
                        }}
                      >
                        {match.odds.draw.toFixed(2)}
                      </Button>

                      {/* Away Bet */}
                      <Button
                        variant="outline"
                        size="sm"
                        className={`px-3 py-1 text-sm font-medium min-w-12 h-8 transition-all ${
                          isBetSelected(`${match.id}-away`)
                            ? "bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-600 hover:border-yellow-600"
                            : "bg-gray-100 border-gray-300 text-gray-900 hover:bg-blue-100 hover:border-blue-300"
                        }`}
                        onClick={() => {
                          const betData = createBetData(match, 'away')
                          if (betData) {
                            console.log('✈️ Away bet clicked:', betData)
                            onAddToBetSlip(betData)
                          }
                        }}
                      >
                        {match.odds.away.toFixed(2)}
                      </Button>
                    </div>
                  </div>
                )}

                {/* No odds available */}
                {!match.odds && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">Odds not available</span>
                  </div>
                )}

                {/* Star Icon */}
                <div className="pl-3">
                  <Button variant="ghost" size="icon" className="w-6 h-6 text-gray-400 hover:text-yellow-500">
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No matches in this league */}
        {(isExpanded || selectedLeague) && leagueData.matches.length === 0 && (
          <div className="bg-white p-4 text-center text-gray-500">
            No matches available for this league
          </div>
        )}
      </div>
    )
  }

  // Show loading only when both are loading and we have no data
  if ((loading || fixtureLoading) && matches.length === 0 && fixtures.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          <span className="text-white">Loading comprehensive league data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Live Football Section */}
      {renderFootballSection()}

      {/* Fixture Section */}
      {renderFixtureSection()}

      {/* Other Sports - Only show when no specific league is selected and in 'all' mode */}
      {!selectedLeague && viewMode === 'all' && (
        <div className="space-y-2">
          {["Hockey", "Tennis", "Basketball", "Baseball"].map((sport) => (
            <Card key={sport} className="bg-gray-800 border-gray-700">
              <CardHeader
                className="py-3 px-4 cursor-pointer hover:bg-gray-700"
                onClick={() => toggleSection(sport.toLowerCase())}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">🏒 {sport}</span>
                    <span className="text-gray-400 text-xs">(Coming Soon)</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-20 right-4 bg-black/80 text-white p-3 rounded text-xs max-w-sm z-50">
          <div>View Mode: {viewMode}</div>
          <div>Selected League: {selectedLeague || 'None'}</div>
          <div>Live Matches: {matches.length}</div>
          <div>Fixtures: {fixtures.length}</div>
          <div>Live Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Fixture Loading: {fixtureLoading ? 'Yes' : 'No'}</div>
          <div>Selected Bets: {selectedBets.length}</div>
        </div>
      )}
    </div>
  )
}