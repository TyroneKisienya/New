// hooks/use-league-filter.ts

import { useState, useCallback, useMemo } from 'react'

interface UseLeagueFilterProps {
  matches?: any[]
  fixtures?: any[]
}

export function useLeagueFilter({ matches = [], fixtures = [] }: UseLeagueFilterProps = {}) {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null)

  // Get all available leagues from both matches and fixtures
  const availableLeagues = useMemo(() => {
    const leagueSet = new Set<string>()
    
    matches.forEach(match => {
      if (match.league) leagueSet.add(match.league)
    })
    fixtures.forEach(fixture => {
      if (fixture.league) leagueSet.add(fixture.league)
    })
    
    return Array.from(leagueSet).sort()
  }, [matches, fixtures])

  // Filter matches based on selected league
  const filteredMatches = useMemo(() => {
    if (!selectedLeague) return matches
    return matches.filter(match => match.league === selectedLeague)
  }, [matches, selectedLeague])

  // Filter fixtures based on selected league
  const filteredFixtures = useMemo(() => {
    if (!selectedLeague) return fixtures
    return fixtures.filter(fixture => fixture.league === selectedLeague)
  }, [fixtures, selectedLeague])

  // Handler to update selected league
  const handleLeagueSelection = useCallback((league: string | null) => {
    setSelectedLeague(league)
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedLeague(null)
  }, [])

  // Check if any filters are active
  const hasActiveFilters = selectedLeague !== null

  // Get filter statistics
  const filterStats = useMemo(() => {
    return {
      totalLeagues: availableLeagues.length,
      selectedLeague: selectedLeague,
      totalMatches: matches.length,
      filteredMatches: filteredMatches.length,
      totalFixtures: fixtures.length,
      filteredFixtures: filteredFixtures.length,
    }
  }, [availableLeagues, selectedLeague, matches, fixtures, filteredMatches, filteredFixtures])

  return {
    selectedLeague,
    availableLeagues,
    filteredMatches,
    filteredFixtures,
    handleLeagueSelection,
    clearFilters,
    hasActiveFilters,
    filterStats,
  }
}