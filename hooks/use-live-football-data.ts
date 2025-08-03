import { useState, useEffect, useCallback } from 'react'

// API Response Types
interface ApiFixture {
  fixture: {
    id: number
    referee: string | null
    timezone: string
    date: string
    timestamp: number
    periods: {
      first: number | null
      second: number | null
    }
    venue: {
      id: number
      name: string
      city: string
    }
    status: {
      long: string
      short: string
      elapsed: number | null
      extra: number | null
    }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
    round: string
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
      winner: boolean | null
    }
    away: {
      id: number
      name: string
      logo: string
      winner: boolean | null
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: {
      home: number | null
      away: number | null
    }
    fulltime: {
      home: number | null
      away: number | null
    }
  }
}

interface ApiResponse {
  get: string
  parameters: any
  errors: any[]
  results: number
  paging: {
    current: number
    total: number
  }
  response: ApiFixture[]
}

// Your existing Match interface (adjusted)
interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  league: string
  leagueLogo: string
  time: string
  status: "live" | "scheduled" | "finished"
  homeScore: number | null
  awayScore: number | null
  venue?: string
  referee?: string | undefined
  odds?: {
    home: number
    draw: number
    away: number
  }
}

// Mock odds generator (since you don't have a real odds provider yet)
const generateMockOdds = (homeTeam: string, awayTeam: string) => {
  // Generate realistic odds based on team names (simple hash-based approach)
  const homeHash = homeTeam.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const awayHash = awayTeam.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  
  const homeFactor = (homeHash % 100) / 100
  const awayFactor = (awayHash % 100) / 100
  
  // Create realistic odds (between 1.1 and 15.0)
  const homeOdds = Number((1.1 + homeFactor * 8).toFixed(2))
  const awayOdds = Number((1.1 + awayFactor * 8).toFixed(2))
  const drawOdds = Number((2.8 + Math.random() * 2.5).toFixed(2))
  
  return { home: homeOdds, draw: drawOdds, away: awayOdds }
}

export function useLiveFootballData() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Your API configuration
  const API_CONFIG = {
    url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
    headers: {
      'x-rapidapi-key': '0845bccc57msh16ea8f673b29afep116648jsnc52ca133830d',
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
    }
  }

  const transformApiDataToMatches = useCallback((apiFixtures: ApiFixture[]): Match[] => {
    return apiFixtures.map((fixture) => {
      const { fixture: fix, league, teams, goals } = fixture
      
      // Determine status
      let status: "live" | "scheduled" | "finished"
      if (fix.status.short === "1H" || fix.status.short === "2H" || fix.status.short === "HT" || fix.status.short === "ET") {
        status = "live"
      } else if (fix.status.short === "FT" || fix.status.short === "AET" || fix.status.short === "PEN") {
        status = "finished"
      } else {
        status = "scheduled"
      }

      // Format time
      const matchDate = new Date(fix.date)
      const timeString = status === "scheduled" 
        ? matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        : fix.status.short

      return {
        id: fix.id.toString(),
        homeTeam: teams.home.name,
        awayTeam: teams.away.name,
        homeTeamLogo: teams.home.logo,
        awayTeamLogo: teams.away.logo,
        league: league.name,
        leagueLogo: league.logo,
        time: timeString,
        status,
        homeScore: goals.home,
        awayScore: goals.away,
        venue: fix.venue.name,
        referee: fix.referee || undefined,
        // Generate mock odds for each match
        odds: generateMockOdds(teams.home.name, teams.away.name)
      }
    })
  }, [])

  const fetchLiveMatches = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_CONFIG.url}?live=all`, {
        method: 'GET',
        headers: API_CONFIG.headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      
      if (data.errors && data.errors.length > 0) {
        throw new Error(`API Error: ${data.errors.join(', ')}`)
      }

      const transformedMatches = transformApiDataToMatches(data.response)
      setMatches(transformedMatches)
      setLastUpdated(new Date())
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching live matches:', err)
      
      // Fallback to mock data on error
      const mockMatches: Match[] = [
        {
          id: "mock-1",
          homeTeam: "Manchester United",
          awayTeam: "Liverpool",
          homeTeamLogo: "/placeholder.svg",
          awayTeamLogo: "/placeholder.svg",
          league: "Premier League",
          leagueLogo: "/placeholder.svg",
          time: "15:30",
          status: "live",
          homeScore: 1,
          awayScore: 2,
          venue: "Old Trafford",
          referee: undefined,
          odds: { home: 2.1, draw: 3.4, away: 3.2 }
        },
        {
          id: "mock-2",
          homeTeam: "Barcelona",
          awayTeam: "Real Madrid",
          homeTeamLogo: "/placeholder.svg",
          awayTeamLogo: "/placeholder.svg",
          league: "La Liga",
          leagueLogo: "/placeholder.svg",
          time: "18:00",
          status: "scheduled",
          homeScore: null,
          awayScore: null,
          venue: "Camp Nou",
          referee: undefined,
          odds: { home: 1.8, draw: 3.6, away: 4.2 }
        }
      ]
      setMatches(mockMatches)
    } finally {
      setLoading(false)
    }
  }, [transformApiDataToMatches])

  // Fetch data on mount
  useEffect(() => {
    fetchLiveMatches()
  }, [fetchLiveMatches])

  // Auto-refresh every 30 seconds for live matches
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveMatches()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchLiveMatches])

  return {
    matches,
    loading,
    error,
    lastUpdated,
    refetch: fetchLiveMatches,
    isUsingMockData: !!error
  }
}