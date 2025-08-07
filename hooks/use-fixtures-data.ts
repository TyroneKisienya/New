import { useState, useEffect, useCallback } from 'react'

// All Sports API Response Types
interface AllSportsFixture {
  event_key: string
  event_date: string
  event_time: string
  event_home_team: string
  home_team_key: string
  event_away_team: string
  away_team_key: string
  event_halftime_result: string
  event_final_result: string
  event_ft_result: string
  event_status: string
  country_name: string
  league_name: string
  league_key: string
  league_round: string
  league_season: string
  event_live: string
  event_stadium: string
  event_referee: string
  home_team_logo: string
  away_team_logo: string
  event_country_key: string
  league_logo: string
  country_logo: string
}

interface AllSportsApiResponse {
  success: number
  result: AllSportsFixture[]
}

// Your existing Match interface (reusing for consistency)
interface FixtureMatch {
  id: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  league: string
  leagueLogo: string
  time: string
  date: string
  status: "scheduled" | "live" | "finished"
  homeScore: number | null
  awayScore: number | null
  venue?: string
  referee?: string
  round?: string
  season?: string
  country?: string
  odds?: {
    home: number
    draw: number
    away: number
  }
}

// Mock odds generator (matching your existing pattern)
const generateMockOdds = (homeTeam: string, awayTeam: string) => {
  const homeHash = homeTeam.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const awayHash = awayTeam.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  
  const homeFactor = (homeHash % 100) / 100
  const awayFactor = (awayHash % 100) / 100
  
  const homeOdds = Number((1.1 + homeFactor * 8).toFixed(2))
  const awayOdds = Number((1.1 + awayFactor * 8).toFixed(2))
  const drawOdds = Number((2.8 + Math.random() * 2.5).toFixed(2))
  
  return { home: homeOdds, draw: drawOdds, away: awayOdds }
}

export function useFixturesData(dateFrom?: string, dateTo?: string) {
  const [fixtures, setFixtures] = useState<FixtureMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const transformAllSportsDataToFixtures = useCallback((apiFixtures: AllSportsFixture[]): FixtureMatch[] => {
    return apiFixtures.map((fixture) => {
      // Determine status based on All Sports API response
      let status: "scheduled" | "live" | "finished"
      const lowerStatus = fixture.event_status.toLowerCase()
      
      if (fixture.event_live === "1" || lowerStatus.includes('live') || lowerStatus === 'started') {
        status = "live"
      } else if (lowerStatus === "finished" || lowerStatus === "ended" || fixture.event_final_result !== "") {
        status = "finished"
      } else {
        status = "scheduled"
      }

      // Parse scores if available
      let homeScore: number | null = null
      let awayScore: number | null = null
      
      if (fixture.event_final_result && fixture.event_final_result !== "") {
        const scoreMatch = fixture.event_final_result.match(/(\d+)\s*-\s*(\d+)/)
        if (scoreMatch) {
          homeScore = parseInt(scoreMatch[1])
          awayScore = parseInt(scoreMatch[2])
        }
      }

      // Format date and time
      const matchDateTime = new Date(`${fixture.event_date}T${fixture.event_time}`)
      const timeString = status === "scheduled" 
        ? matchDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        : fixture.event_time

      return {
        id: fixture.event_key,
        homeTeam: fixture.event_home_team,
        awayTeam: fixture.event_away_team,
        homeTeamLogo: fixture.home_team_logo,
        awayTeamLogo: fixture.away_team_logo,
        league: fixture.league_name,
        leagueLogo: fixture.league_logo,
        time: timeString,
        date: fixture.event_date,
        status,
        homeScore,
        awayScore,
        venue: fixture.event_stadium,
        referee: fixture.event_referee || undefined,
        round: fixture.league_round,
        season: fixture.league_season,
        country: fixture.country_name,
        // Generate mock odds for each match
        odds: generateMockOdds(fixture.event_home_team, fixture.event_away_team)
      }
    })
  }, [])

  const fetchFixtures = useCallback(async (fromDate?: string, toDate?: string) => {
    setLoading(true)
    setError(null)

    // Default to today if no dates provided
    const today = new Date()
    const defaultFrom = fromDate || today.toISOString().split('T')[0]
    const defaultTo = toDate || new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    try {
      // Use your Next.js API route instead of direct API call
      const url = `/api/fixtures?from=${defaultFrom}&to=${defaultTo}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: AllSportsApiResponse = await response.json()
      
      if (data.success !== 1) {
        throw new Error('API returned unsuccessful response')
      }

      const transformedFixtures = transformAllSportsDataToFixtures(data.result || [])
      setFixtures(transformedFixtures)
      setLastUpdated(new Date())
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching fixtures:', err)
      
      // Fallback to mock data on error
      const mockFixtures: FixtureMatch[] = [
        {
          id: "fixture-mock-1",
          homeTeam: "Arsenal",
          awayTeam: "Chelsea",
          homeTeamLogo: "/placeholder.svg",
          awayTeamLogo: "/placeholder.svg",
          league: "Premier League",
          leagueLogo: "/placeholder.svg",
          time: "15:00",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: "scheduled",
          homeScore: null,
          awayScore: null,
          venue: "Emirates Stadium",
          referee: "M. Oliver",
          round: "Matchday 25",
          season: "2024/2025",
          country: "England",
          odds: { home: 2.3, draw: 3.2, away: 2.8 }
        },
        {
          id: "fixture-mock-2",
          homeTeam: "Bayern Munich",
          awayTeam: "Borussia Dortmund",
          homeTeamLogo: "/placeholder.svg",
          awayTeamLogo: "/placeholder.svg",
          league: "Bundesliga",
          leagueLogo: "/placeholder.svg",
          time: "18:30",
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: "scheduled",
          homeScore: null,
          awayScore: null,
          venue: "Allianz Arena",
          referee: "F. Zwayer",
          round: "Matchday 23",
          season: "2024/2025",
          country: "Germany",
          odds: { home: 1.7, draw: 4.1, away: 4.5 }
        },
        {
          id: "fixture-mock-3",
          homeTeam: "PSG",
          awayTeam: "Marseille",
          homeTeamLogo: "/placeholder.svg",
          awayTeamLogo: "/placeholder.svg",
          league: "Ligue 1",
          leagueLogo: "/placeholder.svg",
          time: "20:45",
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: "scheduled",
          homeScore: null,
          awayScore: null,
          venue: "Parc des Princes",
          referee: "C. Turpin",
          round: "Matchday 26",
          season: "2024/2025",
          country: "France",
          odds: { home: 1.4, draw: 4.8, away: 7.2 }
        }
      ]
      setFixtures(mockFixtures)
    } finally {
      setLoading(false)
    }
  }, [transformAllSportsDataToFixtures])

  // Fetch data on mount
  useEffect(() => {
    fetchFixtures(dateFrom, dateTo)
  }, [fetchFixtures, dateFrom, dateTo])

  // Auto-refresh every 5 minutes for fixtures (less frequent than live matches)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFixtures(dateFrom, dateTo)
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [fetchFixtures, dateFrom, dateTo])

  // Helper function to get fixtures for specific date range
  const getFixturesForDateRange = useCallback((from: string, to: string) => {
    fetchFixtures(from, to)
  }, [fetchFixtures])

  // Helper function to get today's fixtures
  const getTodayFixtures = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    fetchFixtures(today, today)
  }, [fetchFixtures])

  // Helper function to get upcoming fixtures (next 7 days)
  const getUpcomingFixtures = useCallback(() => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000)
    fetchFixtures(today.toISOString().split('T')[0], nextWeek.toISOString().split('T')[0])
  }, [fetchFixtures])

  return {
    fixtures,
    loading,
    error,
    lastUpdated,
    refetch: () => fetchFixtures(dateFrom, dateTo),
    getFixturesForDateRange,
    getTodayFixtures,
    getUpcomingFixtures,
    isUsingMockData: !!error
  }
}