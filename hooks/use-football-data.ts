"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

interface Match {
  id: number
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  league: string
  leagueLogo: string
  date: string
  time: string
  status: "scheduled" | "live" | "finished"
  homeScore?: number
  awayScore?: number
  odds?: {
    home: number
    draw: number
    away: number
  }
}

export function useFootballData() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTodaysMatches = async () => {
    try {
      setLoading(true)
      setError(null)

      let response
      try {
        const today = new Date().toISOString().split("T")[0]
        response = await apiClient.getFixtures(today)
      } catch (apiError) {
        console.warn("API failed, using mock data:", apiError)
        response = apiClient.getMockData()
      }

      if (response && response.api && response.api.fixtures) {
        const formattedMatches: Match[] = response.api.fixtures.map((fixture: any) => ({
          id: fixture.fixture_id,
          homeTeam: fixture.homeTeam.team_name,
          awayTeam: fixture.awayTeam.team_name,
          homeTeamLogo: fixture.homeTeam.logo,
          awayTeamLogo: fixture.awayTeam.logo,
          league: fixture.league.name,
          leagueLogo: fixture.league.logo,
          date: fixture.event_date,
          time: new Date(fixture.event_date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: fixture.statusShort === "NS" ? "scheduled" : fixture.statusShort === "FT" ? "finished" : "live",
          homeScore: fixture.goalsHomeTeam,
          awayScore: fixture.goalsAwayTeam,
          // Add mock odds for demo
          odds: {
            home: 2.1 + Math.random() * 2,
            draw: 3.2 + Math.random() * 1.5,
            away: 2.8 + Math.random() * 2,
          },
        }))

        setMatches(formattedMatches)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch matches")
      console.error("Error fetching matches:", err)

      // Fallback to mock data
      const mockData = apiClient.getMockData()
      if (mockData && mockData.api && mockData.api.fixtures) {
        const formattedMatches: Match[] = mockData.api.fixtures.map((fixture: any) => ({
          id: fixture.fixture_id,
          homeTeam: fixture.homeTeam.team_name,
          awayTeam: fixture.awayTeam.team_name,
          homeTeamLogo: fixture.homeTeam.logo,
          awayTeamLogo: fixture.awayTeam.logo,
          league: fixture.league.name,
          leagueLogo: fixture.league.logo,
          date: fixture.event_date,
          time: new Date(fixture.event_date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "scheduled",
          odds: {
            home: 2.1 + Math.random() * 2,
            draw: 3.2 + Math.random() * 1.5,
            away: 2.8 + Math.random() * 2,
          },
        }))
        setMatches(formattedMatches)
        setError(null) // Clear error since we have fallback data
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchLiveMatches = async () => {
    try {
      const response = await apiClient.getLiveMatches()
      if (response && response.api && response.api.fixtures) {
        return response.api.fixtures.map((fixture: any) => ({
          id: fixture.fixture_id,
          homeTeam: fixture.homeTeam.team_name,
          awayTeam: fixture.awayTeam.team_name,
          homeTeamLogo: fixture.homeTeam.logo,
          awayTeamLogo: fixture.awayTeam.logo,
          league: fixture.league.name,
          leagueLogo: fixture.league.logo,
          date: fixture.event_date,
          time: new Date(fixture.event_date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "live",
          homeScore: fixture.goalsHomeTeam,
          awayScore: fixture.goalsAwayTeam,
        }))
      }
    } catch (err) {
      console.error("Error fetching live matches:", err)
    }
    return []
  }

  useEffect(() => {
    fetchTodaysMatches()

    // Set up interval for updates every 2 minutes to respect rate limits
    const interval = setInterval(() => {
      fetchTodaysMatches()
    }, 120000)

    return () => clearInterval(interval)
  }, [])

  return {
    matches,
    loading,
    error,
    refetch: fetchTodaysMatches,
    fetchLiveMatches,
  }
}
