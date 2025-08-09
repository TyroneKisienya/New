"use client"

import { useState, useMemo } from "react"
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

interface DetailedMatchTablesProps {
  onAddToBetSlip: (bet: any) => void
  selectedLeague?: string | null
  filteredMatches?: Match[]
  filteredFixtures?: Match[]
  onClearFilters?: () => void
  filterStats?: FilterStats
}

export function DetailedMatchTables({ 
  onAddToBetSlip, 
  selectedLeague = null,
  filteredMatches = [],
  filteredFixtures = [],
  onClearFilters,
  filterStats
}: DetailedMatchTablesProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["football", "fixtures"])
  
  // Use the original hooks as fallback when filtered data is not provided
  const { matches: originalMatches, loading, error, refetch, isUsingMockData } = useLiveFootballData()
  const { 
    fixtures: originalFixtures, 
    loading: fixtureLoading, 
    error: fixtureError, 
    selectedDate,
    refetch: refetchFixtures,
    goToPreviousDate,
    goToNextDate,
    goToToday,
    canGoToPrevious,
    canGoToNext
  } = useFixtureData()

  // Use filtered data if provided, otherwise use original data
  const matches = filteredMatches.length > 0 || selectedLeague ? filteredMatches : originalMatches
  const fixtures = filteredFixtures.length > 0 || selectedLeague ? filteredFixtures : originalFixtures

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  // Add a filter status indicator
  const renderFilterStatus = () => {
    if (!selectedLeague) return null

    return (
      <div className="mb-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-yellow-400 text-sm font-medium">
              Viewing: {selectedLeague}
            </span>
            {filterStats && (
              <div className="text-xs text-yellow-300 mt-1">
                {filterStats.filteredMatches}/{filterStats.totalMatches} matches • {filterStats.filteredFixtures}/{filterStats.totalFixtures} fixtures
              </div>
            )}
          </div>
          {onClearFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-yellow-400 hover:text-yellow-300"
            >
              View All
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Group matches by league
  const groupedMatches = useMemo(() => {
    return matches.reduce((groups: any, match) => {
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
        odds: match.odds,
        additionalBets: Math.floor(Math.random() * 50) + 10 // Mock additional bets count
      })
      return groups
    }, {})
  }, [matches])

  // Group fixtures by league
  const groupedFixtures = useMemo(() => {
    return fixtures.reduce((groups: any, match) => {
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
        odds: match.odds,
        additionalBets: Math.floor(Math.random() * 50) + 10 // Mock additional bets count
      })
      return groups
    }, {})
  }, [fixtures])

  const renderFootballSection = () => {
    const isFootballExpanded = expandedSections.includes("football")

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
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  refetch()
                }}
                className="text-yellow-400 hover:text-yellow-300 text-xs px-2 py-1"
              >
                Refresh
              </Button>
              {isFootballExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </CardHeader>

        {isFootballExpanded && (
          <CardContent className="p-0">
            {Object.entries(groupedMatches).map(([leagueKey, leagueData]) => renderLeague(leagueKey, leagueData))}
          </CardContent>
        )}
      </Card>
    )
  }

  const renderFixtureSection = () => {
    const isFixtureExpanded = expandedSections.includes("fixtures")

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
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  refetchFixtures()
                }}
                className="text-yellow-400 hover:text-yellow-300 text-xs px-2 py-1"
              >
                Refresh
              </Button>
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
            {Object.keys(groupedFixtures).length > 0 ? (
              Object.entries(groupedFixtures).map(([leagueKey, leagueData]) => 
                renderLeague(`fixture-${leagueKey}`, leagueData)
              )
            ) : !fixtureLoading ? (
              selectedLeague ? (
                <div className="bg-white p-8 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                  <p className="text-yellow-600 mb-2">No fixtures for {selectedLeague}</p>
                  <p className="text-gray-500 text-sm mb-4">Try viewing all leagues or select a different date</p>
                  {onClearFilters && (
                    <Button
                      variant="outline"
                      onClick={onClearFilters}
                      className="text-yellow-600 border-yellow-400 hover:bg-yellow-50 mr-2"
                    >
                      View All Leagues
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={refetchFixtures}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Refresh Data
                  </Button>
                </div>
              ) : (
                <div className="bg-white p-8 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">No fixtures available for this date</p>
                  <p className="text-gray-500 text-sm mb-4">Try selecting a different date</p>
                  <Button
                    variant="outline"
                    onClick={refetchFixtures}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Refresh Data
                  </Button>
                </div>
              )
            ) : null}
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
              <div className="flex items-center space-x-4 text-sm font-medium">
                <span>1</span>
                <span>X</span>
                <span>2</span>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Matches */}
        {isExpanded && (
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

                {/* Betting Odds */}
                {match.odds && match.status !== "FINISHED" && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-100 border-gray-300 text-gray-900 hover:bg-blue-100 hover:border-blue-300 px-3 py-1 text-sm font-medium min-w-12 h-8"
                      onClick={() =>
                        onAddToBetSlip({
                          id: `${match.id}-home`,
                          matchId: match.id,
                          homeTeam: match.homeTeam.name,
                          awayTeam: match.awayTeam.name,
                          selection: match.homeTeam.name,
                          eventName: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                          match: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                          betType: 'home',
                          bet: match.homeTeam.name,
                          odds: Number.parseFloat(match.odds.home.toFixed(2)),
                          league: leagueData.name,
                        })
                      }
                    >
                      {match.odds.home.toFixed(2)}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-100 border-gray-300 text-gray-900 hover:bg-blue-100 hover:border-blue-300 px-3 py-1 text-sm font-medium min-w-12 h-8"
                      onClick={() =>
                        onAddToBetSlip({
                          id: `${match.id}-draw`,
                          matchId: match.id,
                          homeTeam: match.homeTeam.name,
                          awayTeam: match.awayTeam.name,
                          selection: "Draw",
                          eventName: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                          match: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                          betType: 'draw',
                          bet: "Draw",
                          odds: Number.parseFloat(match.odds.draw.toFixed(2)),
                          league: leagueData.name,
                        })
                      }
                    >
                      {match.odds.draw.toFixed(2)}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-100 border-gray-300 text-gray-900 hover:bg-blue-100 hover:border-blue-300 px-3 py-1 text-sm font-medium min-w-12 h-8"
                      onClick={() =>
                        onAddToBetSlip({
                          id: `${match.id}-away`,
                          matchId: match.id,
                          homeTeam: match.homeTeam.name,
                          awayTeam: match.awayTeam.name,
                          selection: match.awayTeam.name,
                          eventName: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                          match: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                          betType: 'away',
                          bet: match.awayTeam.name,
                          odds: Number.parseFloat(match.odds.away.toFixed(2)),
                          league: leagueData.name,
                        })
                      }
                    >
                      {match.odds.away.toFixed(2)}
                    </Button>
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
        {isExpanded && leagueData.matches.length === 0 && (
          <div className="bg-white p-4 text-center text-gray-500">
            No matches available for this league
          </div>
        )}
      </div>
    )
  }

  if (loading && matches.length === 0 && fixtureLoading && fixtures.length === 0) {
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
      {/* Filter Status */}
      {renderFilterStatus()}
      
      {/* Live Football Section */}
      {Object.keys(groupedMatches).length > 0 ? (
        renderFootballSection()
      ) : selectedLeague && !loading ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <p className="text-yellow-400 mb-2">No live matches for {selectedLeague}</p>
            <p className="text-gray-500 text-sm mb-4">
              Try viewing all leagues or check back later for live matches
            </p>
            {onClearFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10 mr-2"
              >
                View All Leagues
              </Button>
            )}
            <Button
              variant="outline"
              onClick={refetch}
              className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
            >
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 mb-2">No live football matches available</p>
            <p className="text-gray-500 text-sm mb-4">Check back later for live matches</p>
            <Button
              variant="outline"
              onClick={refetch}
              className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
            >
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Fixture Section */}
      {renderFixtureSection()}

      {/* Other Sports - Collapsed by default */}
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
    </div>
  )
}