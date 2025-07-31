"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { LEAGUE_IDS } from "@/lib/api-config"

interface Match {
  id: number
  date: string
  time: string
  status: string
  homeTeam: {
    id: number
    name: string
    logo: string
  }
  awayTeam: {
    id: number
    name: string
    logo: string
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
  }
  venue: string
  referee: string | null
  homeScore: number | null
  awayScore: number | null
  odds: {
    home: number
    draw: number
    away: number
  }
  additionalBets: number
}

interface LeagueData {
  [leagueId: string]: {
    name: string
    country: string
    logo: string
    matches: Match[]
  }
}

export function useLeagueData() {
  const [leaguesData, setLeaguesData] = useState<LeagueData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  const fetchLeagueData = async () => {
    try {
      setLoading(true)
      setError(null)
      setUsingMockData(false)

      console.log("Starting to fetch league data from API-Football v3...")

      // Start with mock data immediately to avoid loading state
      const mockData = getComprehensiveMockData()
      setLeaguesData(mockData)
      setUsingMockData(true)
      setLoading(false)

      // Try to fetch real data in background
      try {
        const allLeaguesData: LeagueData = {}
        let hasRealData = false

        // Fetch data for all major leagues
        const leaguePromises = Object.entries(LEAGUE_IDS).map(async ([leagueName, leagueId]) => {
          try {
            console.log(`Attempting to fetch ${leagueName} (ID: ${leagueId})...`)
            const response = await apiClient.getLeagueFixtures(leagueId)

            if (response && response.response && response.response.length > 0) {
              console.log(`Successfully fetched ${response.response.length} fixtures for ${leagueName}`)

              const formattedMatches: Match[] = response.response.slice(0, 15).map((fixture: any) => ({
                id: fixture.fixture.id,
                date: fixture.fixture.date,
                time: new Date(fixture.fixture.date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                }),
                status: fixture.fixture.status.short,
                homeTeam: {
                  id: fixture.teams.home.id,
                  name: fixture.teams.home.name,
                  logo: fixture.teams.home.logo,
                },
                awayTeam: {
                  id: fixture.teams.away.id,
                  name: fixture.teams.away.name,
                  logo: fixture.teams.away.logo,
                },
                league: {
                  id: fixture.league.id,
                  name: fixture.league.name,
                  country: fixture.league.country,
                  logo: fixture.league.logo,
                },
                venue: fixture.fixture.venue?.name || "TBD",
                referee: fixture.fixture.referee,
                homeScore: fixture.goals.home,
                awayScore: fixture.goals.away,
                odds: {
                  home: 1.5 + Math.random() * 3,
                  draw: 3.0 + Math.random() * 2,
                  away: 1.5 + Math.random() * 3,
                },
                additionalBets: Math.floor(Math.random() * 1000) + 400,
              }))

              allLeaguesData[leagueName.toLowerCase().replace("_", "-")] = {
                name: response.response[0]?.league?.name || leagueName.replace("_", " "),
                country: response.response[0]?.league?.country || "",
                logo: response.response[0]?.league?.logo || "",
                matches: formattedMatches,
              }
              hasRealData = true
            }
          } catch (leagueError) {
            console.warn(`Failed to fetch ${leagueName}:`, leagueError)
            // Keep the mock data for this league
          }
        })

        await Promise.all(leaguePromises)

        // If we got some real data, merge it with mock data
        if (hasRealData) {
          console.log("Successfully fetched some real data, merging with mock data")
          const mergedData = { ...mockData, ...allLeaguesData }
          setLeaguesData(mergedData)
          setUsingMockData(false)
          setError(null)
        } else {
          console.log("No real data available, using comprehensive mock data")
          setError("API unavailable - using demo data")
        }
      } catch (apiError) {
        console.warn("API completely unavailable:", apiError)
        setError("API unavailable - using demo data")
        // Mock data is already set above
      }
    } catch (err) {
      console.error("Error in fetchLeagueData:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch league data")

      // Ensure we always have data to display
      if (Object.keys(leaguesData).length === 0) {
        setLeaguesData(getComprehensiveMockData())
        setUsingMockData(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const getComprehensiveMockData = (): LeagueData => ({
    "champions-league": {
      name: "UEFA Champions League",
      country: "Europe",
      logo: "https://media.api-sports.io/football/leagues/2.png",
      matches: [
        {
          id: 1001,
          date: "2024-02-06T22:00:00Z",
          time: "22:00 06.08",
          status: "NS",
          homeTeam: { id: 1, name: "Feyenoord", logo: "https://media.api-sports.io/football/teams/79.png" },
          awayTeam: { id: 2, name: "Fenerbahce", logo: "https://media.api-sports.io/football/teams/610.png" },
          league: {
            id: 2,
            name: "UEFA Champions League",
            country: "Europe",
            logo: "https://media.api-sports.io/football/leagues/2.png",
          },
          venue: "De Kuip",
          referee: "Clement Turpin",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.86, draw: 3.7, away: 3.9 },
          additionalBets: 716,
        },
        {
          id: 1002,
          date: "2024-02-06T22:00:00Z",
          time: "22:00 06.08",
          status: "NS",
          homeTeam: { id: 3, name: "Nice", logo: "https://media.api-sports.io/football/teams/1395.png" },
          awayTeam: { id: 4, name: "Benfica", logo: "https://media.api-sports.io/football/teams/211.png" },
          league: {
            id: 2,
            name: "UEFA Champions League",
            country: "Europe",
            logo: "https://media.api-sports.io/football/leagues/2.png",
          },
          venue: "Allianz Riviera",
          referee: "Daniele Orsato",
          homeScore: null,
          awayScore: null,
          odds: { home: 3.0, draw: 3.42, away: 2.27 },
          additionalBets: 724,
        },
        {
          id: 1003,
          date: "2024-02-07T20:00:00Z",
          time: "20:00 07.08",
          status: "NS",
          homeTeam: { id: 5, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" },
          awayTeam: { id: 6, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png" },
          league: {
            id: 2,
            name: "UEFA Champions League",
            country: "Europe",
            logo: "https://media.api-sports.io/football/leagues/2.png",
          },
          venue: "Santiago Bernabeu",
          referee: "Bjorn Kuipers",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.4, draw: 3.1, away: 2.9 },
          additionalBets: 892,
        },
        {
          id: 1004,
          date: "2024-02-07T20:00:00Z",
          time: "20:00 07.08",
          status: "NS",
          homeTeam: { id: 7, name: "Bayern Munich", logo: "https://media.api-sports.io/football/teams/157.png" },
          awayTeam: { id: 8, name: "PSG", logo: "https://media.api-sports.io/football/teams/85.png" },
          league: {
            id: 2,
            name: "UEFA Champions League",
            country: "Europe",
            logo: "https://media.api-sports.io/football/leagues/2.png",
          },
          venue: "Allianz Arena",
          referee: "Antonio Mateu Lahoz",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.95, draw: 3.6, away: 3.8 },
          additionalBets: 654,
        },
        {
          id: 1005,
          date: "2024-02-08T19:45:00Z",
          time: "19:45 08.08",
          status: "NS",
          homeTeam: { id: 9, name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" },
          awayTeam: { id: 10, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" },
          league: {
            id: 2,
            name: "UEFA Champions League",
            country: "Europe",
            logo: "https://media.api-sports.io/football/leagues/2.png",
          },
          venue: "Emirates Stadium",
          referee: "Slavko Vincic",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.8, draw: 3.3, away: 2.4 },
          additionalBets: 789,
        },
        {
          id: 1006,
          date: "2024-02-08T19:45:00Z",
          time: "19:45 08.08",
          status: "NS",
          homeTeam: { id: 11, name: "Atletico Madrid", logo: "https://media.api-sports.io/football/teams/530.png" },
          awayTeam: { id: 12, name: "Inter Milan", logo: "https://media.api-sports.io/football/teams/505.png" },
          league: {
            id: 2,
            name: "UEFA Champions League",
            country: "Europe",
            logo: "https://media.api-sports.io/football/leagues/2.png",
          },
          venue: "Wanda Metropolitano",
          referee: "Istvan Kovacs",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.2, draw: 3.1, away: 3.4 },
          additionalBets: 612,
        },
      ],
    },
    "premier-league": {
      name: "Premier League",
      country: "England",
      logo: "https://media.api-sports.io/football/leagues/39.png",
      matches: [
        {
          id: 2001,
          date: "2024-02-10T17:30:00Z",
          time: "17:30 10.08",
          status: "NS",
          homeTeam: { id: 33, name: "Manchester United", logo: "https://media.api-sports.io/football/teams/33.png" },
          awayTeam: { id: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" },
          league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
          },
          venue: "Old Trafford",
          referee: "Michael Oliver",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.45, draw: 3.2, away: 2.8 },
          additionalBets: 892,
        },
        {
          id: 2002,
          date: "2024-02-10T20:00:00Z",
          time: "20:00 10.08",
          status: "NS",
          homeTeam: { id: 42, name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" },
          awayTeam: { id: 49, name: "Chelsea", logo: "https://media.api-sports.io/football/teams/49.png" },
          league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
          },
          venue: "Emirates Stadium",
          referee: "Anthony Taylor",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.95, draw: 3.6, away: 3.8 },
          additionalBets: 654,
        },
        {
          id: 2003,
          date: "2024-02-11T15:00:00Z",
          time: "15:00 11.08",
          status: "NS",
          homeTeam: { id: 50, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png" },
          awayTeam: { id: 47, name: "Tottenham", logo: "https://media.api-sports.io/football/teams/47.png" },
          league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
          },
          venue: "Etihad Stadium",
          referee: "Paul Tierney",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.65, draw: 4.1, away: 4.5 },
          additionalBets: 743,
        },
        {
          id: 2004,
          date: "2024-02-11T17:30:00Z",
          time: "17:30 11.08",
          status: "NS",
          homeTeam: { id: 51, name: "Newcastle", logo: "https://media.api-sports.io/football/teams/34.png" },
          awayTeam: { id: 52, name: "Brighton", logo: "https://media.api-sports.io/football/teams/51.png" },
          league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
          },
          venue: "St. James' Park",
          referee: "Simon Hooper",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.1, draw: 3.4, away: 3.2 },
          additionalBets: 567,
        },
        {
          id: 2005,
          date: "2024-02-12T20:00:00Z",
          time: "20:00 12.08",
          status: "NS",
          homeTeam: { id: 53, name: "Aston Villa", logo: "https://media.api-sports.io/football/teams/66.png" },
          awayTeam: { id: 54, name: "West Ham", logo: "https://media.api-sports.io/football/teams/48.png" },
          league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
          },
          venue: "Villa Park",
          referee: "Craig Pawson",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.8, draw: 3.5, away: 4.2 },
          additionalBets: 423,
        },
        {
          id: 2006,
          date: "2024-02-13T19:30:00Z",
          time: "19:30 13.08",
          status: "NS",
          homeTeam: { id: 55, name: "Everton", logo: "https://media.api-sports.io/football/teams/45.png" },
          awayTeam: { id: 56, name: "Crystal Palace", logo: "https://media.api-sports.io/football/teams/52.png" },
          league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
          },
          venue: "Goodison Park",
          referee: "David Coote",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.3, draw: 3.2, away: 3.1 },
          additionalBets: 445,
        },
        {
          id: 2007,
          date: "2024-02-14T21:00:00Z",
          time: "21:00 14.08",
          status: "NS",
          homeTeam: { id: 57, name: "Fulham", logo: "https://media.api-sports.io/football/teams/36.png" },
          awayTeam: { id: 58, name: "Brentford", logo: "https://media.api-sports.io/football/teams/55.png" },
          league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
          },
          venue: "Craven Cottage",
          referee: "Robert Jones",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.0, draw: 3.4, away: 3.6 },
          additionalBets: 523,
        },
      ],
    },
    "la-liga": {
      name: "La Liga",
      country: "Spain",
      logo: "https://media.api-sports.io/football/leagues/140.png",
      matches: [
        {
          id: 3001,
          date: "2024-02-11T21:00:00Z",
          time: "21:00 11.08",
          status: "NS",
          homeTeam: { id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" },
          awayTeam: { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" },
          league: {
            id: 140,
            name: "La Liga",
            country: "Spain",
            logo: "https://media.api-sports.io/football/leagues/140.png",
          },
          venue: "Camp Nou",
          referee: "Jesus Gil Manzano",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.1, draw: 3.4, away: 3.2 },
          additionalBets: 1205,
        },
        {
          id: 3002,
          date: "2024-02-12T19:30:00Z",
          time: "19:30 12.08",
          status: "NS",
          homeTeam: { id: 530, name: "Atletico Madrid", logo: "https://media.api-sports.io/football/teams/530.png" },
          awayTeam: { id: 536, name: "Sevilla", logo: "https://media.api-sports.io/football/teams/536.png" },
          league: {
            id: 140,
            name: "La Liga",
            country: "Spain",
            logo: "https://media.api-sports.io/football/leagues/140.png",
          },
          venue: "Wanda Metropolitano",
          referee: "Alejandro Hernandez",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.8, draw: 3.5, away: 4.2 },
          additionalBets: 567,
        },
        {
          id: 3003,
          date: "2024-02-13T18:00:00Z",
          time: "18:00 13.08",
          status: "NS",
          homeTeam: { id: 532, name: "Valencia", logo: "https://media.api-sports.io/football/teams/532.png" },
          awayTeam: { id: 533, name: "Villarreal", logo: "https://media.api-sports.io/football/teams/533.png" },
          league: {
            id: 140,
            name: "La Liga",
            country: "Spain",
            logo: "https://media.api-sports.io/football/leagues/140.png",
          },
          venue: "Mestalla",
          referee: "Ricardo De Burgos",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.3, draw: 3.1, away: 3.0 },
          additionalBets: 834,
        },
        {
          id: 3004,
          date: "2024-02-14T16:15:00Z",
          time: "16:15 14.08",
          status: "NS",
          homeTeam: { id: 534, name: "Real Sociedad", logo: "https://media.api-sports.io/football/teams/548.png" },
          awayTeam: { id: 535, name: "Athletic Bilbao", logo: "https://media.api-sports.io/football/teams/531.png" },
          league: {
            id: 140,
            name: "La Liga",
            country: "Spain",
            logo: "https://media.api-sports.io/football/leagues/140.png",
          },
          venue: "Reale Arena",
          referee: "Mario Melero Lopez",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.0, draw: 3.3, away: 3.7 },
          additionalBets: 678,
        },
        {
          id: 3005,
          date: "2024-02-15T20:00:00Z",
          time: "20:00 15.08",
          status: "NS",
          homeTeam: { id: 537, name: "Real Betis", logo: "https://media.api-sports.io/football/teams/543.png" },
          awayTeam: { id: 538, name: "Getafe", logo: "https://media.api-sports.io/football/teams/546.png" },
          league: {
            id: 140,
            name: "La Liga",
            country: "Spain",
            logo: "https://media.api-sports.io/football/leagues/140.png",
          },
          venue: "Benito Villamarin",
          referee: "Pablo Gonzalez Fuertes",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.7, draw: 3.8, away: 4.5 },
          additionalBets: 456,
        },
      ],
    },
    "serie-a": {
      name: "Serie A",
      country: "Italy",
      logo: "https://media.api-sports.io/football/leagues/135.png",
      matches: [
        {
          id: 4001,
          date: "2024-02-11T20:45:00Z",
          time: "20:45 11.08",
          status: "NS",
          homeTeam: { id: 496, name: "Juventus", logo: "https://media.api-sports.io/football/teams/496.png" },
          awayTeam: { id: 489, name: "AC Milan", logo: "https://media.api-sports.io/football/teams/489.png" },
          league: {
            id: 135,
            name: "Serie A",
            country: "Italy",
            logo: "https://media.api-sports.io/football/leagues/135.png",
          },
          venue: "Allianz Stadium",
          referee: "Daniele Doveri",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.3, draw: 3.1, away: 3.0 },
          additionalBets: 834,
        },
        {
          id: 4002,
          date: "2024-02-12T18:00:00Z",
          time: "18:00 12.08",
          status: "NS",
          homeTeam: { id: 505, name: "Inter Milan", logo: "https://media.api-sports.io/football/teams/505.png" },
          awayTeam: { id: 492, name: "Napoli", logo: "https://media.api-sports.io/football/teams/492.png" },
          league: {
            id: 135,
            name: "Serie A",
            country: "Italy",
            logo: "https://media.api-sports.io/football/leagues/135.png",
          },
          venue: "San Siro",
          referee: "Maurizio Mariani",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.9, draw: 3.4, away: 3.7 },
          additionalBets: 692,
        },
        {
          id: 4003,
          date: "2024-02-13T15:00:00Z",
          time: "15:00 13.08",
          status: "NS",
          homeTeam: { id: 487, name: "AS Roma", logo: "https://media.api-sports.io/football/teams/487.png" },
          awayTeam: { id: 488, name: "Lazio", logo: "https://media.api-sports.io/football/teams/488.png" },
          league: {
            id: 135,
            name: "Serie A",
            country: "Italy",
            logo: "https://media.api-sports.io/football/leagues/135.png",
          },
          venue: "Stadio Olimpico",
          referee: "Marco Di Bello",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.2, draw: 3.3, away: 3.1 },
          additionalBets: 578,
        },
        {
          id: 4004,
          date: "2024-02-14T19:30:00Z",
          time: "19:30 14.08",
          status: "NS",
          homeTeam: { id: 490, name: "Atalanta", logo: "https://media.api-sports.io/football/teams/499.png" },
          awayTeam: { id: 491, name: "Fiorentina", logo: "https://media.api-sports.io/football/teams/502.png" },
          league: {
            id: 135,
            name: "Serie A",
            country: "Italy",
            logo: "https://media.api-sports.io/football/leagues/135.png",
          },
          venue: "Gewiss Stadium",
          referee: "Luca Pairetto",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.85, draw: 3.6, away: 4.0 },
          additionalBets: 723,
        },
        {
          id: 4005,
          date: "2024-02-15T17:00:00Z",
          time: "17:00 15.08",
          status: "NS",
          homeTeam: { id: 493, name: "Bologna", logo: "https://media.api-sports.io/football/teams/500.png" },
          awayTeam: { id: 494, name: "Torino", logo: "https://media.api-sports.io/football/teams/503.png" },
          league: {
            id: 135,
            name: "Serie A",
            country: "Italy",
            logo: "https://media.api-sports.io/football/leagues/135.png",
          },
          venue: "Stadio Renato Dall'Ara",
          referee: "Federico La Penna",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.4, draw: 3.2, away: 2.9 },
          additionalBets: 512,
        },
      ],
    },
    bundesliga: {
      name: "Bundesliga",
      country: "Germany",
      logo: "https://media.api-sports.io/football/leagues/78.png",
      matches: [
        {
          id: 5001,
          date: "2024-02-10T18:30:00Z",
          time: "18:30 10.08",
          status: "NS",
          homeTeam: { id: 157, name: "Bayern Munich", logo: "https://media.api-sports.io/football/teams/157.png" },
          awayTeam: { id: 165, name: "Borussia Dortmund", logo: "https://media.api-sports.io/football/teams/165.png" },
          league: {
            id: 78,
            name: "Bundesliga",
            country: "Germany",
            logo: "https://media.api-sports.io/football/leagues/78.png",
          },
          venue: "Allianz Arena",
          referee: "Felix Brych",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.7, draw: 3.8, away: 4.3 },
          additionalBets: 945,
        },
        {
          id: 5002,
          date: "2024-02-11T15:30:00Z",
          time: "15:30 11.08",
          status: "NS",
          homeTeam: { id: 173, name: "RB Leipzig", logo: "https://media.api-sports.io/football/teams/173.png" },
          awayTeam: { id: 168, name: "Bayer Leverkusen", logo: "https://media.api-sports.io/football/teams/168.png" },
          league: {
            id: 78,
            name: "Bundesliga",
            country: "Germany",
            logo: "https://media.api-sports.io/football/leagues/78.png",
          },
          venue: "Red Bull Arena",
          referee: "Tobias Stieler",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.2, draw: 3.3, away: 3.1 },
          additionalBets: 578,
        },
        {
          id: 5003,
          date: "2024-02-12T20:30:00Z",
          time: "20:30 12.08",
          status: "NS",
          homeTeam: {
            id: 169,
            name: "Eintracht Frankfurt",
            logo: "https://media.api-sports.io/football/teams/169.png",
          },
          awayTeam: { id: 172, name: "VfB Stuttgart", logo: "https://media.api-sports.io/football/teams/172.png" },
          league: {
            id: 78,
            name: "Bundesliga",
            country: "Germany",
            logo: "https://media.api-sports.io/football/leagues/78.png",
          },
          venue: "Deutsche Bank Park",
          referee: "Deniz Aytekin",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.6, draw: 3.2, away: 2.5 },
          additionalBets: 423,
        },
        {
          id: 5004,
          date: "2024-02-13T19:30:00Z",
          time: "19:30 13.08",
          status: "NS",
          homeTeam: { id: 170, name: "FC Union Berlin", logo: "https://media.api-sports.io/football/teams/170.png" },
          awayTeam: {
            id: 171,
            name: "Borussia Monchengladbach",
            logo: "https://media.api-sports.io/football/teams/163.png",
          },
          league: {
            id: 78,
            name: "Bundesliga",
            country: "Germany",
            logo: "https://media.api-sports.io/football/leagues/78.png",
          },
          venue: "Stadion An der Alten Forsterei",
          referee: "Harm Osmers",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.1, draw: 3.4, away: 3.3 },
          additionalBets: 634,
        },
        {
          id: 5005,
          date: "2024-02-14T17:30:00Z",
          time: "17:30 14.08",
          status: "NS",
          homeTeam: { id: 174, name: "SC Freiburg", logo: "https://media.api-sports.io/football/teams/160.png" },
          awayTeam: { id: 175, name: "TSG Hoffenheim", logo: "https://media.api-sports.io/football/teams/167.png" },
          league: {
            id: 78,
            name: "Bundesliga",
            country: "Germany",
            logo: "https://media.api-sports.io/football/leagues/78.png",
          },
          venue: "Europa-Park Stadion",
          referee: "Matthias Jollenbeck",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.9, draw: 3.5, away: 3.8 },
          additionalBets: 567,
        },
      ],
    },
    "ligue-1": {
      name: "Ligue 1",
      country: "France",
      logo: "https://media.api-sports.io/football/leagues/61.png",
      matches: [
        {
          id: 6001,
          date: "2024-02-11T21:00:00Z",
          time: "21:00 11.08",
          status: "NS",
          homeTeam: { id: 85, name: "PSG", logo: "https://media.api-sports.io/football/teams/85.png" },
          awayTeam: { id: 81, name: "Marseille", logo: "https://media.api-sports.io/football/teams/81.png" },
          league: {
            id: 61,
            name: "Ligue 1",
            country: "France",
            logo: "https://media.api-sports.io/football/leagues/61.png",
          },
          venue: "Parc des Princes",
          referee: "Clement Turpin",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.4, draw: 4.5, away: 6.8 },
          additionalBets: 1156,
        },
        {
          id: 6002,
          date: "2024-02-12T17:00:00Z",
          time: "17:00 12.08",
          status: "NS",
          homeTeam: { id: 80, name: "Lyon", logo: "https://media.api-sports.io/football/teams/80.png" },
          awayTeam: { id: 91, name: "Monaco", logo: "https://media.api-sports.io/football/teams/91.png" },
          league: {
            id: 61,
            name: "Ligue 1",
            country: "France",
            logo: "https://media.api-sports.io/football/leagues/61.png",
          },
          venue: "Groupama Stadium",
          referee: "Ruddy Buquet",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.6, draw: 3.2, away: 2.5 },
          additionalBets: 423,
        },
        {
          id: 6003,
          date: "2024-02-13T19:00:00Z",
          time: "19:00 13.08",
          status: "NS",
          homeTeam: { id: 82, name: "Lille", logo: "https://media.api-sports.io/football/teams/82.png" },
          awayTeam: { id: 83, name: "Nice", logo: "https://media.api-sports.io/football/teams/1395.png" },
          league: {
            id: 61,
            name: "Ligue 1",
            country: "France",
            logo: "https://media.api-sports.io/football/leagues/61.png",
          },
          venue: "Stade Pierre-Mauroy",
          referee: "Francois Letexier",
          homeScore: null,
          awayScore: null,
          odds: { home: 1.9, draw: 3.4, away: 3.7 },
          additionalBets: 692,
        },
        {
          id: 6004,
          date: "2024-02-14T20:00:00Z",
          time: "20:00 14.08",
          status: "NS",
          homeTeam: { id: 84, name: "Rennes", logo: "https://media.api-sports.io/football/teams/84.png" },
          awayTeam: { id: 86, name: "Strasbourg", logo: "https://media.api-sports.io/football/teams/1395.png" },
          league: {
            id: 61,
            name: "Ligue 1",
            country: "France",
            logo: "https://media.api-sports.io/football/leagues/61.png",
          },
          venue: "Roazhon Park",
          referee: "Benoit Bastien",
          homeScore: null,
          awayScore: null,
          odds: { home: 2.2, draw: 3.3, away: 3.1 },
          additionalBets: 578,
        },
      ],
    },
  })

  useEffect(() => {
    fetchLeagueData()
  }, [])

  return {
    leaguesData,
    loading,
    error,
    usingMockData,
    refetch: fetchLeagueData,
  }
}
