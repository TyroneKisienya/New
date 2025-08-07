"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, AlertCircle, Star, RefreshCw, Filter } from "lucide-react"
import { useFixturesData } from "@/hooks/use-fixtures-data"
import { useState } from "react"

interface FixturesGridProps {
  onAddToBetSlip: (bet: any) => void
  dateFrom?: string
  dateTo?: string
}

export function FixturesGrid({ onAddToBetSlip, dateFrom, dateTo }: FixturesGridProps) {
  const { fixtures, loading, error, refetch, isUsingMockData, lastUpdated, getTodayFixtures, getUpcomingFixtures } = useFixturesData(dateFrom, dateTo)
  const [selectedDateFilter, setSelectedDateFilter] = useState<'today' | 'upcoming' | 'all'>('upcoming')

  const handleBetClick = (match: any, betType: "home" | "draw" | "away", odds: number) => {
    const selection = betType === 'home' 
      ? match.homeTeam 
      : betType === 'away' 
      ? match.awayTeam 
      : 'Draw'

    const bet = {
      id: `${match.id}-${betType}`,
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      selection: selection,
      eventName: `${match.homeTeam} vs ${match.awayTeam}`,
      match: `${match.homeTeam} vs ${match.awayTeam}`,
      league: match.league,
      betType,
      bet: selection,
      odds: Number.parseFloat(odds.toFixed(2)),
      stake: 0,
    }

    onAddToBetSlip(bet)
  }

  const handleDateFilterChange = (filter: 'today' | 'upcoming' | 'all') => {
    setSelectedDateFilter(filter)
    switch (filter) {
      case 'today':
        getTodayFixtures()
        break
      case 'upcoming':
        getUpcomingFixtures()
        break
      case 'all':
        refetch()
        break
    }
  }

  // Group matches by league
  const groupedFixtures = fixtures.reduce((groups: any, fixture) => {
    const leagueKey = fixture.league.toLowerCase().replace(/\s+/g, '-')
    if (!groups[leagueKey]) {
      groups[leagueKey] = {
        name: fixture.league,
        logo: fixture.leagueLogo,
        fixtures: []
      }
    }
    groups[leagueKey].fixtures.push(fixture)
    return groups
  }, {})

  if (loading && fixtures.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-yellow-400" />
          <span className="text-white">Loading upcoming fixtures...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Upcoming Fixtures</h2>
        <div className="flex items-center space-x-4">
          {isUsingMockData && (
            <div className="flex items-center space-x-2 text-orange-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Using fallback data</span>
            </div>
          )}
          {error && (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">API Error</span>
            </div>
          )}
          {lastUpdated && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={loading}
            className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10 bg-transparent"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Date Filter Buttons */}
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-4 h-4 text-gray-400" />
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          <Button
            variant={selectedDateFilter === 'today' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleDateFilterChange('today')}
            className={`${
              selectedDateFilter === 'today' 
                ? 'bg-yellow-500 text-gray-900' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Today
          </Button>
          <Button
            variant={selectedDateFilter === 'upcoming' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleDateFilterChange('upcoming')}
            className={`${
              selectedDateFilter === 'upcoming' 
                ? 'bg-yellow-500 text-gray-900' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Next 7 Days
          </Button>
          <Button
            variant={selectedDateFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleDateFilterChange('all')}
            className={`${
              selectedDateFilter === 'all' 
                ? 'bg-yellow-500 text-gray-900' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </Button>
        </div>
      </div>

      {fixtures.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-2" />
            <p>No fixtures available for the selected period</p>
            <p className="text-sm">Try selecting a different date range</p>
          </div>
          <Button
            variant="outline"
            onClick={refetch}
            className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedFixtures).map(([leagueKey, leagueData]: [string, any]) => (
            <Card key={leagueKey} className="bg-gray-800 border-gray-700">
              {/* League Header */}
              <CardHeader className="bg-yellow-500 text-gray-900 py-2 px-4">
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
                    <span className="font-semibold text-sm">🏆 {leagueData.name}</span>
                    <span className="text-xs opacity-75">({leagueData.fixtures.length} fixtures)</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm font-medium">
                    <span>1</span>
                    <span>X</span>
                    <span>2</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {leagueData.fixtures.map((fixture: any, index: number) => (
                  <div
                    key={fixture.id}
                    className={`flex items-center py-4 px-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 ${
                      index % 2 === 1 ? "bg-gray-800" : "bg-gray-750"
                    }`}
                  >
                    {/* Time and Teams */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-gray-300 text-sm font-medium">{fixture.time}</span>
                        <div className="w-4 h-4 text-gray-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        {fixture.status === "live" && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 text-xs font-bold">LIVE</span>
                          </div>
                        )}
                        {fixture.venue && (
                          <div className="flex items-center space-x-1 text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs truncate">{fixture.venue}</span>
                          </div>
                        )}
                      </div>

                      {/* Home Team */}
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={fixture.homeTeamLogo || "/placeholder.svg"}
                          alt={fixture.homeTeam}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=24&width=24&text=H"
                          }}
                        />
                        <span className="text-white text-sm font-medium">{fixture.homeTeam}</span>
                        {fixture.homeScore !== null && (
                          <span className="text-white font-bold">({fixture.homeScore})</span>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center space-x-3">
                        <img
                          src={fixture.awayTeamLogo || "/placeholder.svg"}
                          alt={fixture.awayTeam}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=24&width=24&text=A"
                          }}
                        />
                        <span className="text-white text-sm font-medium">{fixture.awayTeam}</span>
                        {fixture.awayScore !== null && (
                          <span className="text-white font-bold">({fixture.awayScore})</span>
                        )}
                      </div>

                      {/* Additional Match Info */}
                      <div className="mt-2 space-y-1">
                        {fixture.referee && (
                          <div className="text-gray-400 text-xs">👨‍⚖️ {fixture.referee}</div>
                        )}
                        {fixture.country && (
                          <div className="text-gray-400 text-xs">📍 {fixture.country}</div>
                        )}
                        {fixture.round && (
                          <div className="text-gray-400 text-xs">{fixture.round}</div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="px-3">
                      {fixture.status === "live" && (
                        <Badge variant="destructive" className="bg-red-600 animate-pulse">
                          LIVE {fixture.homeScore !== null && fixture.awayScore !== null && 
                            `${fixture.homeScore}-${fixture.awayScore}`}
                        </Badge>
                      )}
                      {fixture.status === "finished" && (
                        <Badge variant="secondary" className="bg-gray-600 text-gray-200">
                          FT {fixture.homeScore}-{fixture.awayScore}
                        </Badge>
                      )}
                      {fixture.status === "scheduled" && (
                        <Badge variant="outline" className="border-gray-500 text-gray-300">
                          Scheduled
                        </Badge>
                      )}
                    </div>

                    {/* Betting Odds */}
                    {fixture.odds && fixture.status === "scheduled" && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 transition-colors px-3 py-1 text-sm font-medium min-w-12 h-8"
                          onClick={() => handleBetClick(fixture, "home", fixture.odds.home)}
                        >
                          {fixture.odds.home.toFixed(2)}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 transition-colors px-3 py-1 text-sm font-medium min-w-12 h-8"
                          onClick={() => handleBetClick(fixture, "draw", fixture.odds.draw)}
                        >
                          {fixture.odds.draw.toFixed(2)}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 transition-colors px-3 py-1 text-sm font-medium min-w-12 h-8"
                          onClick={() => handleBetClick(fixture, "away", fixture.odds.away)}
                        >
                          {fixture.odds.away.toFixed(2)}
                        </Button>
                      </div>
                    )}

                    {/* No odds available */}
                    {(!fixture.odds || fixture.status !== "scheduled") && fixture.status === "scheduled" && (
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

                {/* No fixtures in this league */}
                {leagueData.fixtures.length === 0 && (
                  <div className="bg-gray-800 p-4 text-center text-gray-400">
                    No fixtures available for this league
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}