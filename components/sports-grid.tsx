"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, TrendingUp } from "lucide-react"

interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  league: string
  time: string
  status: "live" | "upcoming" | "finished"
  homeOdds: number
  drawOdds: number
  awayOdds: number
  viewers?: number
}

interface SportsGridProps {
  onAddToBetSlip: (bet: any) => void
}

export function SportsGrid({ onAddToBetSlip }: SportsGridProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data - replace with API-Football integration
  useEffect(() => {
    const mockMatches: Match[] = [
      {
        id: "1",
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        league: "Premier League",
        time: "15:30",
        status: "live",
        homeOdds: 2.1,
        drawOdds: 3.4,
        awayOdds: 3.2,
        viewers: 45000,
      },
      {
        id: "2",
        homeTeam: "Barcelona",
        awayTeam: "Real Madrid",
        league: "La Liga",
        time: "18:00",
        status: "upcoming",
        homeOdds: 1.8,
        drawOdds: 3.6,
        awayOdds: 4.2,
      },
      {
        id: "3",
        homeTeam: "Bayern Munich",
        awayTeam: "Borussia Dortmund",
        league: "Bundesliga",
        time: "20:30",
        status: "upcoming",
        homeOdds: 1.6,
        drawOdds: 4.1,
        awayOdds: 5.2,
      },
      {
        id: "4",
        homeTeam: "PSG",
        awayTeam: "Marseille",
        league: "Ligue 1",
        time: "21:00",
        status: "upcoming",
        homeOdds: 1.4,
        drawOdds: 4.8,
        awayOdds: 7.2,
      },
    ]

    setTimeout(() => {
      setMatches(mockMatches)
      setLoading(false)
    }, 1000)
  }, [])

  const handleBetClick = (match: Match, betType: "home" | "draw" | "away", odds: number) => {
    const bet = {
      id: `${match.id}-${betType}`,
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      betType,
      odds,
      stake: 0,
    }
    onAddToBetSlip(bet)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-6 bg-gray-700 rounded"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Live & Upcoming Matches</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>Updated live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-400">{match.league}</CardTitle>
                <div className="flex items-center space-x-2">
                  {match.status === "live" && (
                    <>
                      <Badge variant="destructive" className="bg-red-600">
                        LIVE
                      </Badge>
                      {match.viewers && (
                        <div className="flex items-center text-xs text-gray-400">
                          <Users className="w-3 h-3 mr-1" />
                          {match.viewers.toLocaleString()}
                        </div>
                      )}
                    </>
                  )}
                  {match.status === "upcoming" && (
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {match.time}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-white font-semibold">{match.homeTeam}</div>
                <div className="text-gray-400 text-sm my-1">vs</div>
                <div className="text-white font-semibold">{match.awayTeam}</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 hover:bg-yellow-500/20 hover:border-yellow-500 text-white flex flex-col py-3 h-auto"
                  onClick={() => handleBetClick(match, "home", match.homeOdds)}
                >
                  <span className="text-xs text-gray-400">1</span>
                  <span className="font-semibold">{match.homeOdds}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 hover:bg-yellow-500/20 hover:border-yellow-500 text-white flex flex-col py-3 h-auto"
                  onClick={() => handleBetClick(match, "draw", match.drawOdds)}
                >
                  <span className="text-xs text-gray-400">X</span>
                  <span className="font-semibold">{match.drawOdds}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 hover:bg-yellow-500/20 hover:border-yellow-500 text-white flex flex-col py-3 h-auto"
                  onClick={() => handleBetClick(match, "away", match.awayOdds)}
                >
                  <span className="text-xs text-gray-400">2</span>
                  <span className="font-semibold">{match.awayOdds}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
