// Create this as hooks/use-league-filter.ts

import { useState, useCallback, useMemo } from 'react'

interface UseLeagueFilterProps {
  matches?: any[]
  fixtures?: any[]
}

export function useLeagueFilter({ matches = [], fixtures = [] }: UseLeagueFilterProps = {}) {
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([])

  // Get all available leagues from both matches and fixtures
  const availableLeagues = useMemo(() => {
    const leagueSet = new Set<string>()
    
    matches.forEach(match => leagueSet.add(match.league))
    fixtures.forEach(fixture => leagueSet.add(fixture.league))
    
    return Array.from(leagueSet).sort()
  }, [matches, fixtures])

  // Filter matches based on selected leagues
  const filteredMatches = useMemo(() => {
    if (selectedLeagues.length === 0) return matches
    return matches.filter(match => selectedLeagues.includes(match.league))
  }, [matches, selectedLeagues])

  // Filter fixtures based on selected leagues
  const filteredFixtures = useMemo(() => {
    if (selectedLeagues.length === 0) return fixtures
    return fixtures.filter(fixture => selectedLeagues.includes(fixture.league))
  }, [fixtures, selectedLeagues])

  // Handler to update selected leagues
  const handleLeagueSelection = useCallback((leagues: string[]) => {
    setSelectedLeagues(leagues)
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedLeagues([])
  }, [])

  // Check if any filters are active
  const hasActiveFilters = selectedLeagues.length > 0

  // Get filter statistics
  const filterStats = useMemo(() => {
    return {
      totalLeagues: availableLeagues.length,
      selectedCount: selectedLeagues.length,
      totalMatches: matches.length,
      filteredMatches: filteredMatches.length,
      totalFixtures: fixtures.length,
      filteredFixtures: filteredFixtures.length,
    }
  }, [availableLeagues, selectedLeagues, matches, fixtures, filteredMatches, filteredFixtures])

  return {
    selectedLeagues,
    availableLeagues,
    filteredMatches,
    filteredFixtures,
    handleLeagueSelection,
    clearFilters,
    hasActiveFilters,
    filterStats,
  }
}