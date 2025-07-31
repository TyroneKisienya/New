"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { useFootballData } from "@/hooks/use-football-data"

interface RealSportsGridProps {
  onAddToBetSlip: (bet: any) => void
}

export function RealSportsGrid({ onAddToBetSlip }: RealSportsGridProps) {
  const { matches, loading, error, refetch } = useFootballData()

  const handleBetClick = (match: any, betType: "home" | "draw" | "away", odds: number) => {
    const bet = {
      id: `${match.id}-${betType}`,
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      betType,
      odds: Number.parseFloat(odds.toFixed(2)),
      stake: 0,
    }
    onAddToBetSlip(bet)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          <span className="text-white">Loading matches...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Today's Matches</h2>
        <div className="flex items-center space-x-4">
          {error && (
            <div className="flex items-center space-x-2 text-orange-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Using demo data</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>Live updates</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10 bg-transparent"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.slice(0, 6).map((match) => (
          <Card key={match.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
                  <img
                    src={match.leagueLogo || "/placeholder.svg"}
                    alt={match.league}
                    className="w-4 h-4"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=16&width=16&text=L"
                    }}
                  />
                  <span>{match.league}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {match.status === "live" && (
                    <Badge variant="destructive" className="bg-red-600">
                      LIVE {match.homeScore}-{match.awayScore}
                    </Badge>
                  )}
                  {match.status === "scheduled" && (
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {match.time}
                    </div>
                  )}
                  {match.status === "finished" && (
                    <Badge variant="secondary" className="bg-gray-600">
                      FT {match.homeScore}-{match.awayScore}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <img
                      src={match.homeTeamLogo || "/placeholder.svg"}
                      alt={match.homeTeam}
                      className="w-12 h-12 mx-auto mb-2"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=48&width=48&text=H"
                      }}
                    />
                    <div className="text-white text-sm font-medium">{match.homeTeam}</div>
                  </div>

                  <div className="text-gray-400 text-sm">VS</div>

                  <div className="text-center">
                    <img
                      src={match.awayTeamLogo || "/placeholder.svg"}
                      alt={match.awayTeam}
                      className="w-12 h-12 mx-auto mb-2"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=48&width=48&text=A"
                      }}
                    />
                    <div className="text-white text-sm font-medium">{match.awayTeam}</div>
                  </div>
                </div>
              </div>

              {match.odds && match.status === "scheduled" && (
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 hover:bg-yellow-500/20 hover:border-yellow-500 text-white flex flex-col py-3 h-auto"
                    onClick={() => handleBetClick(match, "home", match.odds!.home)}
                  >
                    <span className="text-xs text-gray-400">1</span>
                    <span className="font-semibold">{match.odds.home.toFixed(2)}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 hover:bg-yellow-500/20 hover:border-yellow-500 text-white flex flex-col py-3 h-auto"
                    onClick={() => handleBetClick(match, "draw", match.odds!.draw)}
                  >
                    <span className="text-xs text-gray-400">X</span>
                    <span className="font-semibold">{match.odds.draw.toFixed(2)}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 hover:bg-yellow-500/20 hover:border-yellow-500 text-white flex flex-col py-3 h-auto"
                    onClick={() => handleBetClick(match, "away", match.odds!.away)}
                  >
                    <span className="text-xs text-gray-400">2</span>
                    <span className="font-semibold">{match.odds.away.toFixed(2)}</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
