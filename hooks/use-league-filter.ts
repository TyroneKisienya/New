import { useState, useMemo } from 'react'

interface Match {
  id: string
  league: string
  leagueLogo?: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo?: string
  awayTeamLogo?: string
  homeScore: number | null
  awayScore: number | null
  time: string
  status: string
  venue?: string
  referee?: string
  odds?: {
    home: number
    draw: number
    away: number
  }
}

interface UseLeagueFilterProps {
  matches: Match[]
  fixtures: Match[]
}

interface FilterStats {
  totalMatches: number
  filteredMatches: number
  totalFixtures: number
  filteredFixtures: number
  selectedLeague: string | null
}

export function useLeagueFilter({ matches, fixtures }: UseLeagueFilterProps) {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null)

  // Enhanced league matching function
  const isLeagueMatch = (matchLeague: string, selectedLeague: string): boolean => {
    const normalize = (str: string) => str.toLowerCase().trim()
    const matchLeagueNorm = normalize(matchLeague)
    const selectedLeagueNorm = normalize(selectedLeague)

    // Direct match
    if (matchLeagueNorm === selectedLeagueNorm) return true

    // Common league name mappings for better matching
    const leagueMappings: { [key: string]: string[] } = {
      'uefa champions league': ['champions league', 'ucl'],
      'england premier league': ['premier league', 'epl', 'english premier league'],
      'spain la liga': ['la liga', 'spanish la liga', 'laliga'],
      'italy serie a': ['serie a', 'italian serie a'],
      'germany bundesliga': ['bundesliga', 'german bundesliga'],
      'france ligue 1': ['ligue 1', 'french ligue 1'],
      'uefa europa league': ['europa league', 'uel'],
      'uefa super cup': ['super cup', 'uefa super cup'],
      'germany dfl-super cup': ['dfl-super cup', 'german super cup']
    }

    // Check if either league name maps to the other
    for (const [mainName, aliases] of Object.entries(leagueMappings)) {
      const allNames = [mainName, ...aliases]
      
      const hasSelectedLeague = allNames.some(name => selectedLeagueNorm.includes(name) || name.includes(selectedLeagueNorm))
      const hasMatchLeague = allNames.some(name => matchLeagueNorm.includes(name) || name.includes(matchLeagueNorm))
      
      if (hasSelectedLeague && hasMatchLeague) return true
    }

    // Partial matching as fallback
    return matchLeagueNorm.includes(selectedLeagueNorm) || selectedLeagueNorm.includes(matchLeagueNorm)
  }

  // Get all available leagues
  const availableLeagues = useMemo(() => {
    const leagueSet = new Set<string>()
    matches.forEach(match => leagueSet.add(match.league))
    fixtures.forEach(match => leagueSet.add(match.league))
    return Array.from(leagueSet).sort()
  }, [matches, fixtures])

  // Filter matches and fixtures based on selected league
  const filteredMatches = useMemo(() => {
    if (!selectedLeague) return matches
    return matches.filter(match => isLeagueMatch(match.league, selectedLeague))
  }, [matches, selectedLeague])

  const filteredFixtures = useMemo(() => {
    if (!selectedLeague) return fixtures
    return fixtures.filter(match => isLeagueMatch(match.league, selectedLeague))
  }, [fixtures, selectedLeague])

  // Calculate filter statistics
  const filterStats: FilterStats = useMemo(() => ({
    totalMatches: matches.length,
    filteredMatches: filteredMatches.length,
    totalFixtures: fixtures.length,
    filteredFixtures: filteredFixtures.length,
    selectedLeague
  }), [matches.length, filteredMatches.length, fixtures.length, filteredFixtures.length, selectedLeague])

  // League selection handler
  const handleLeagueSelection = (leagueName: string | null) => {
    setSelectedLeague(leagueName)
  }

  // Clear filters
  const clearFilters = () => {
    setSelectedLeague(null)
  }

  // Check if filters are active
  const hasActiveFilters = selectedLeague !== null

  return {
    selectedLeague,
    availableLeagues,
    filteredMatches,
    filteredFixtures,
    handleLeagueSelection,
    clearFilters,
    hasActiveFilters,
    filterStats
  }
}