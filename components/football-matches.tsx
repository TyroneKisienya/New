"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChevronUp, Star } from "lucide-react"

interface FootballMatchesProps {
  onAddToBetSlip: (bet: any) => void
}

export function FootballMatches({ onAddToBetSlip }: FootballMatchesProps) {
  const matches = [
    {
      id: "1",
      time: "18:00 30.01 ⚽",
      league: "UEFA Champions League",
      team1: "Dynamo",
      team2: "Napoli",
      odds: { home: 1.22, draw: 5.65, away: 14.5 },
    },
    {
      id: "2",
      time: "20:00 30.01",
      league: "UEFA",
      team1: "Napoli",
      team2: "Napoli Juventus Juve",
      odds: { home: 1.29, draw: 5.4, away: 9.5 },
    },
    {
      id: "3",
      time: "20:00 30.01 ⚽",
      league: "UEFA",
      team1: "Napoli",
      team2: "Juventus Juve",
      odds: { home: 1.78, draw: 3.3, away: 4.94 },
    },
    {
      id: "4",
      time: "20:00 30.01 ⚽",
      league: "FC2B",
      team1: "Marseille",
      team2: "Marseille",
      odds: { home: 1.18, draw: 7, away: 13.5 },
    },
    {
      id: "5",
      time: "21:00 30.01 ⚽",
      league: "Al",
      team1: "Fenerbahce",
      team2: "Fenerbahce",
      odds: { home: 1.77, draw: 4, away: 4 },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center">⚽ Football</h3>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="bg-yellow-500 text-gray-900 py-2 px-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">🏆 UEFA Champions League</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">2</span>
              <Button variant="ghost" size="icon" className="w-4 h-4 text-gray-900">
                <ChevronUp className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {matches.slice(0, 2).map((match, index) => (
            <div key={match.id} className={`p-3 ${index > 0 ? "border-t border-gray-700" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-1">{match.time}</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm">{match.team1}</span>
                    <span className="text-gray-400 text-xs">vs</span>
                    <span className="text-white text-sm">{match.team2}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 px-2 py-1 text-xs min-w-12"
                    onClick={() =>
                      onAddToBetSlip({
                        id: `${match.id}-home`,
                        match: `${match.team1} vs ${match.team2}`,
                        bet: match.team1,
                        odds: match.odds.home,
                      })
                    }
                  >
                    {match.odds.home}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 px-2 py-1 text-xs min-w-12"
                    onClick={() =>
                      onAddToBetSlip({
                        id: `${match.id}-draw`,
                        match: `${match.team1} vs ${match.team2}`,
                        bet: "Draw",
                        odds: match.odds.draw,
                      })
                    }
                  >
                    {match.odds.draw}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 px-2 py-1 text-xs min-w-12"
                    onClick={() =>
                      onAddToBetSlip({
                        id: `${match.id}-away`,
                        match: `${match.team1} vs ${match.team2}`,
                        bet: match.team2,
                        odds: match.odds.away,
                      })
                    }
                  >
                    {match.odds.away}
                  </Button>
                  <Button variant="ghost" size="icon" className="w-6 h-6 text-gray-400 hover:text-yellow-400">
                    <Star className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional matches */}
      <div className="space-y-2">
        {matches.slice(2).map((match) => (
          <div key={match.id} className="bg-gray-800 border border-gray-700 rounded p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">{match.time}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">{match.team1}</span>
                  <span className="text-gray-400 text-xs">vs</span>
                  <span className="text-white text-sm">{match.team2}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 px-2 py-1 text-xs min-w-12"
                >
                  {match.odds.home}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 px-2 py-1 text-xs min-w-12"
                >
                  {match.odds.draw}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-yellow-500 hover:text-gray-900 px-2 py-1 text-xs min-w-12"
                >
                  {match.odds.away}
                </Button>
                <Button variant="ghost" size="icon" className="w-6 h-6 text-gray-400 hover:text-yellow-400">
                  <Star className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
