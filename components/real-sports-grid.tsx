"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Loader2, AlertCircle, Star, RefreshCw } from "lucide-react"
import { useLiveFootballData } from "@/hooks/use-live-football-data"

interface RealSportsGridProps {
  onAddToBetSlip: (bet: any) => void
}

export function RealSportsGrid({ onAddToBetSlip }: RealSportsGridProps) {
  const { matches, loading, error, refetch, isUsingMockData, lastUpdated } = useLiveFootballData()

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

  if (loading && matches.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          <span className="text-white">Loading live matches...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Live Football Matches</h2>
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
              <TrendingUp className="w-4 h-4" />
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
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {matches.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <p>No live matches available right now</p>
            <p className="text-sm">Check back later for live football action!</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <Card key={match.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
                    <img
                      src={match.leagueLogo}
                      alt={match.league}
                      className="w-4 h-4"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=16&width=16&text=L"
                      }}
                    />
                    <span className="truncate">{match.league}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {match.status === "live" && (
                      <Badge variant="destructive" className="bg-red-600 animate-pulse">
                        LIVE {match.homeScore !== null && match.awayScore !== null && 
                          `${match.homeScore}-${match.awayScore}`}
                      </Badge>
                    )}
                    {match.status === "scheduled" && (
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {match.time}
                      </div>
                    )}
                    {match.status === "finished" && (
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        FT {match.homeScore}-{match.awayScore}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Teams */}
                <div className="space-y-3">
                  {/* Home Team */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={match.homeTeamLogo}
                      alt={match.homeTeam}
                      className="w-8 h-8 rounded-full bg-gray-700 p-1"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=32&width=32&text=H"
                      }}
                    />
                    <span className="text-white font-medium flex-1 truncate">{match.homeTeam}</span>
                    {match.status === "live" && match.homeScore !== null && (
                      <span className="text-lg font-bold text-white">{match.homeScore}</span>
                    )}
                  </div>

                  {/* VS Divider */}
                  <div className="flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">VS</span>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={match.awayTeamLogo}
                      alt={match.awayTeam}
                      className="w-8 h-8 rounded-full bg-gray-700 p-1"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=32&width=32&text=A"
                      }}
                    />
                    <span className="text-white font-medium flex-1 truncate">{match.awayTeam}</span>
                    {match.status === "live" && match.awayScore !== null && (
                      <span className="text-lg font-bold text-white">{match.awayScore}</span>
                    )}
                  </div>
                </div>

                {/* Betting Odds */}
                {match.odds && match.status !== "finished" && (
                  <div className="pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-medium">1X2 (Mock Odds)</span>
                      <Button variant="ghost" size="icon" className="w-5 h-5 text-gray-400 hover:text-yellow-400">
                        <Star className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 transition-colors text-sm font-medium h-9"
                        onClick={() => match.odds && handleBetClick(match, "home", match.odds.home)}
                      >
                        <div className="text-center">
                          <div className="text-xs opacity-75">1</div>
                          <div>{match.odds?.home.toFixed(2)}</div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 transition-colors text-sm font-medium h-9"
                        onClick={() => match.odds && handleBetClick(match, "draw", match.odds.draw)}
                      >
                        <div className="text-center">
                          <div className="text-xs opacity-75">X</div>
                          <div>{match.odds?.draw.toFixed(2)}</div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 transition-colors text-sm font-medium h-9"
                        onClick={() => match.odds && handleBetClick(match, "away", match.odds.away)}
                      >
                        <div className="text-center">
                          <div className="text-xs opacity-75">2</div>
                          <div>{match.odds?.away.toFixed(2)}</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Match Details */}
                <div className="pt-2 space-y-1">
                  {match.venue && (
                    <div className="text-xs text-gray-400 flex items-center">
                      <span>📍 {match.venue}</span>
                    </div>
                  )}
                  {match.referee && (
                    <div className="text-xs text-gray-400 flex items-center">
                      <span>👨‍⚖️ {match.referee}</span>
                    </div>
                  )}
                </div>

                {/* No odds available for finished matches or when odds are missing */}
                {(!match.odds || match.status === "finished") && (
                  <div className="pt-3 border-t border-gray-700 text-center">
                    <span className="text-gray-400 text-sm">
                      {match.status === "finished" ? "Match Finished" : "Odds not available"}
                    </span>
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