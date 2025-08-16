import { useState, useEffect, useCallback } from 'react'

// API Response Types for Fixtures
interface FixtureApiFixture {
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
    extratime: {
      home: number | null
      away: number | null
    }
    penalty: {
      home: number | null
      away: number | null
    }
  }
}

interface FixtureApiResponse {
  get: string
  parameters: any
  errors: any[]
  results: number
  paging: {
    current: number
    total: number
  }
  response: FixtureApiFixture[]
}

// Fixture Match interface
interface FixtureMatch {
  id: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  league: string
  leagueLogo: string
  time: string
  status: "scheduled" | "live" | "finished"
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

// Mock odds generator for fixtures
const generateFixtureOdds = (homeTeam: string, awayTeam: string, matchId: number) => {
  // Generate consistent odds based on team names and match ID
  const homeHash = homeTeam.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const awayHash = awayTeam.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const matchHash = matchId
  
  const homeFactor = ((homeHash + matchHash) % 100) / 100
  const awayFactor = ((awayHash + matchHash) % 100) / 100
  
  // Create realistic odds (between 1.2 and 12.0)
  const homeOdds = Number((1.2 + homeFactor * 6.8).toFixed(2))
  const awayOdds = Number((1.2 + awayFactor * 6.8).toFixed(2))
  const drawOdds = Number((2.5 + Math.random() * 3.0).toFixed(2))
  
  return { home: homeOdds, draw: drawOdds, away: awayOdds }
}

export function useFixtureData() {
  const [fixtures, setFixtures] = useState<FixtureMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // API configuration for fixtures
  const FIXTURE_API_CONFIG = {
    url: 'https://v3.football.api-sports.io/fixtures',
    headers: {
      'x-rapidapi-key': '357ea5c0c2ec6049580a1e3ffbec1798',
      'x-rapidapi-host': 'v3.football.api-sports.io'
    }
  }

  const transformFixtureData = useCallback((apiFixtures: FixtureApiFixture[]): FixtureMatch[] => {
    return apiFixtures.map((fixture) => {
      const { fixture: fix, league, teams, goals } = fixture
      
      // Determine status
      let status: "scheduled" | "live" | "finished"
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
        // Generate mock odds for each fixture
        odds: generateFixtureOdds(teams.home.name, teams.away.name, fix.id)
      }
    })
  }, [])

  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const fetchFixtures = useCallback(async (date?: Date) => {
    const targetDate = date || selectedDate
    setLoading(true)
    setError(null)

    try {
      const dateString = formatDateForAPI(targetDate)
      const response = await fetch(`${FIXTURE_API_CONFIG.url}?date=${dateString}`, {
        method: 'GET',
        headers: FIXTURE_API_CONFIG.headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: FixtureApiResponse = await response.json()
      
      if (data.errors && data.errors.length > 0) {
        throw new Error(`API Error: ${data.errors.join(', ')}`)
      }

      const transformedFixtures = transformFixtureData(data.response)
      setFixtures(transformedFixtures)
      setLastUpdated(new Date())
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching fixtures:', err)
      setFixtures([])
    } finally {
      setLoading(false)
    }
  }, [selectedDate, transformFixtureData])

  // Date navigation functions
  const goToPreviousDate = useCallback(() => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
    fetchFixtures(newDate)
  }, [selectedDate, fetchFixtures])

  const goToNextDate = useCallback(() => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
    fetchFixtures(newDate)
  }, [selectedDate, fetchFixtures])

  const goToToday = useCallback(() => {
    const today = new Date()
    setSelectedDate(today)
    fetchFixtures(today)
  }, [fetchFixtures])

  // Check if selected date is within allowed range (2 days before/after today)
  const isDateAllowed = useCallback((date: Date): boolean => {
    const today = new Date()
    const twoDaysAgo = new Date(today)
    twoDaysAgo.setDate(today.getDate() - 2)
    const twoDaysAhead = new Date(today)
    twoDaysAhead.setDate(today.getDate() + 2)

    return date >= twoDaysAgo && date <= twoDaysAhead
  }, [])

  const canGoToPrevious = isDateAllowed(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))
  const canGoToNext = isDateAllowed(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))

  // Fetch data on mount and when date changes
  useEffect(() => {
    fetchFixtures()
  }, [fetchFixtures])

  return {
    fixtures,
    loading,
    error,
    lastUpdated,
    selectedDate,
    refetch: fetchFixtures,
    goToPreviousDate,
    goToNextDate,
    goToToday,
    canGoToPrevious,
    canGoToNext,
    formatDateForAPI
  }
}