// API Configuration for API-Football v3
export const API_CONFIG = {
  BASE_URL: "https://v3.football.api-sports.io",
  HEADERS: {
    "x-rapidapi-host": "v3.football.api-sports.io",
    "x-rapidapi-key": "357ea5c0c2ec6049580a1e3ffbec1798",
  },
  RATE_LIMITS: {
    DAILY: 100,
    PER_MINUTE: 30,
  },
}

// League IDs for top leagues (API-Football v3 IDs)
export const LEAGUE_IDS = {
  PREMIER_LEAGUE: 39,
  LA_LIGA: 140,
  BUNDESLIGA: 78,
  SERIE_A: 135,
  LIGUE_1: 61,
  CHAMPIONS_LEAGUE: 2,
  EUROPA_LEAGUE: 3,
  UEFA_SUPER_CUP: 531,
  WORLD_CUP: 1,
}

// Time zones for different regions
export const TIME_ZONES = {
  KENYA: "Africa/Nairobi",
  USA: "America/New_York",
  UK: "Europe/London",
}

// Current season
export const CURRENT_SEASON = new Date().getFullYear()
