"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Star, Loader2, AlertCircle } from "lucide-react"
import { useLeagueData } from "@/hooks/use-league-data"

interface DetailedMatchTablesProps {
  onAddToBetSlip: (bet: any) => void
}

export function DetailedMatchTables({ onAddToBetSlip }: DetailedMatchTablesProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["football", "champions-league"])
  const { leaguesData, loading, error, usingMockData, refetch } = useLeagueData()

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

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
              <span className="text-white font-medium">⚽ Football</span>
              {usingMockData && (
                <div className="flex items-center space-x-1 text-yellow-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">Demo Data</span>
                </div>
              )}
              {error && !usingMockData && (
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
            {Object.entries(leaguesData).map(([leagueKey, leagueData]) => renderLeague(leagueKey, leagueData))}
          </CardContent>
        )}
      </Card>
    )
  }

  const renderLeague = (leagueKey: string, leagueData: any) => {
    const isExpanded = expandedSections.includes(leagueKey)

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
              <span className="font-semibold text-sm">🏆 {leagueData.name}</span>
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
      </div>
    )
  }

  if (loading && Object.keys(leaguesData).length === 0) {
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
      {renderFootballSection()}

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