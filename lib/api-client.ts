import { API_CONFIG, CURRENT_SEASON } from "./api-config"

class APIClient {
  private requestCount = 0
  private lastResetTime = Date.now()
  private cache = new Map()

  private async makeRequest(endpoint: string, params?: Record<string, string>) {
    // Rate limiting check
    if (this.requestCount >= API_CONFIG.RATE_LIMITS.PER_MINUTE) {
      const timeSinceReset = Date.now() - this.lastResetTime
      if (timeSinceReset < 60000) {
        console.warn("Rate limit exceeded, using cached/mock data")
        throw new Error("Rate limit exceeded. Please wait.")
      } else {
        this.requestCount = 0
        this.lastResetTime = Date.now()
      }
    }

    // Build URL with parameters
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    // Check cache first
    const cacheKey = url.toString()
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < 300000) {
        // 5 minutes cache
        return cached.data
      }
    }

    try {
      this.requestCount++
      console.log(`Making API request to: ${url.toString()}`)

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          ...API_CONFIG.HEADERS,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      console.log(`API Response status: ${response.status}`)

      if (!response.ok) {
        if (response.status === 403) {
          console.warn("API access forbidden (403). This could be due to:")
          console.warn("- Invalid API key")
          console.warn("- Subscription expired")
          console.warn("- Rate limits exceeded")
          throw new Error(`API access forbidden (403). Using fallback data.`)
        }
        if (response.status === 429) {
          console.warn("Rate limit exceeded (429)")
          throw new Error("Rate limit exceeded. Please wait.")
        }
        throw new Error(`API request failed: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API request successful, caching data")

      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      })

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Get fixtures for today
  async getFixtures(date?: string) {
    const today = date || new Date().toISOString().split("T")[0]
    return this.makeRequest("/fixtures", {
      date: today,
    })
  }

  // Get fixtures for a specific league
  async getLeagueFixtures(leagueId: number, season?: number) {
    const currentSeason = season || CURRENT_SEASON
    return this.makeRequest("/fixtures", {
      league: leagueId.toString(),
      season: currentSeason.toString(),
      next: "20", // Get next 20 fixtures
    })
  }

  // Get live matches
  async getLiveMatches() {
    return this.makeRequest("/fixtures", {
      live: "all",
    })
  }

  // Get leagues
  async getLeagues() {
    return this.makeRequest("/leagues")
  }

  // Get standings for a league
  async getStandings(leagueId: number, season?: number) {
    const currentSeason = season || CURRENT_SEASON
    return this.makeRequest("/standings", {
      league: leagueId.toString(),
      season: currentSeason.toString(),
    })
  }

  // Get odds for fixtures
  async getOdds(fixtureId: number) {
    return this.makeRequest("/odds", {
      fixture: fixtureId.toString(),
    })
  }

  // Get team information
  async getTeam(teamId: number) {
    return this.makeRequest("/teams", {
      id: teamId.toString(),
    })
  }

  // Fallback to mock data if API fails
  getMockData() {
    return {
      response: [
        {
          fixture: {
            id: 1,
            referee: "Michael Oliver",
            timezone: "UTC",
            date: new Date().toISOString(),
            timestamp: Math.floor(Date.now() / 1000),
            periods: {
              first: null,
              second: null,
            },
            venue: {
              id: 1,
              name: "Old Trafford",
              city: "Manchester",
            },
            status: {
              long: "Not Started",
              short: "NS",
              elapsed: null,
            },
          },
          league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
            flag: "https://media.api-sports.io/flags/gb.svg",
            season: CURRENT_SEASON,
            round: "Regular Season - 22",
          },
          teams: {
            home: {
              id: 33,
              name: "Manchester United",
              logo: "https://media.api-sports.io/football/teams/33.png",
              winner: null,
            },
            away: {
              id: 40,
              name: "Liverpool",
              logo: "https://media.api-sports.io/football/teams/40.png",
              winner: null,
            },
          },
          goals: {
            home: null,
            away: null,
          },
          score: {
            halftime: {
              home: null,
              away: null,
            },
            fulltime: {
              home: null,
              away: null,
            },
            extratime: {
              home: null,
              away: null,
            },
            penalty: {
              home: null,
              away: null,
            },
          },
        },
        {
          fixture: {
            id: 2,
            referee: "Antonio Mateu Lahoz",
            timezone: "UTC",
            date: new Date().toISOString(),
            timestamp: Math.floor(Date.now() / 1000),
            periods: {
              first: null,
              second: null,
            },
            venue: {
              id: 2,
              name: "Camp Nou",
              city: "Barcelona",
            },
            status: {
              long: "Not Started",
              short: "NS",
              elapsed: null,
            },
          },
          league: {
            id: 140,
            name: "La Liga",
            country: "Spain",
            logo: "https://media.api-sports.io/football/leagues/140.png",
            flag: "https://media.api-sports.io/flags/es.svg",
            season: CURRENT_SEASON,
            round: "Regular Season - 22",
          },
          teams: {
            home: {
              id: 529,
              name: "Barcelona",
              logo: "https://media.api-sports.io/football/teams/529.png",
              winner: null,
            },
            away: {
              id: 541,
              name: "Real Madrid",
              logo: "https://media.api-sports.io/football/teams/541.png",
              winner: null,
            },
          },
          goals: {
            home: null,
            away: null,
          },
          score: {
            halftime: {
              home: null,
              away: null,
            },
            fulltime: {
              home: null,
              away: null,
            },
            extratime: {
              home: null,
              away: null,
            },
            penalty: {
              home: null,
              away: null,
            },
          },
        },
      ],
    }
  }
}

export const apiClient = new APIClient()
