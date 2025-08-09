"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Search, Settings, Menu, X, Trophy, Target, Gamepad2, Loader2, AlertCircle } from "lucide-react"
import { useLiveFootballData } from "@/hooks/use-live-football-data"
import { useFixtureData } from "@/hooks/use-fixture-data"

interface SidebarProps {
  isMobileSidebarOpen?: boolean
  setIsMobileSidebarOpen?: (open: boolean) => void
  onLeagueSelect?: (selectedLeague: string | null) => void
  selectedLeague?: string | null
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

interface LeagueData {
  name: string
  count: number
  logo: string
  country?: string
  isLive: boolean
  hasFixtures: boolean
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative">
    <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
    <Input
      placeholder="Search leagues..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-8 sm:pl-10 pr-3 py-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent h-8 sm:h-10"
    />
  </div>
)

export function Sidebar({ 
  isMobileSidebarOpen: propMobileSidebarOpen, 
  setIsMobileSidebarOpen: propSetMobileSidebarOpen,
  onLeagueSelect,
  selectedLeague
}: SidebarProps = {}) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["dynamic-leagues"])
  const [internalMobileSidebarOpen, setInternalMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Get data from your existing hooks
  const { matches, loading: liveLoading, error: liveError } = useLiveFootballData()
  const { fixtures, loading: fixtureLoading, error: fixtureError } = useFixtureData()

  const isMobileSidebarOpen = propMobileSidebarOpen ?? internalMobileSidebarOpen
  const setIsMobileSidebarOpen = propSetMobileSidebarOpen ?? setInternalMobileSidebarOpen

  // Process API data to extract unique leagues with counts
  const dynamicLeagues = useMemo(() => {
    const leagueMap = new Map<string, LeagueData>()

    // Process live matches
    matches.forEach((match: { league: string; leagueLogo: any }) => {
      const leagueKey = match.league.toLowerCase()
      if (leagueMap.has(leagueKey)) {
        const existing = leagueMap.get(leagueKey)!
        leagueMap.set(leagueKey, {
          ...existing,
          count: existing.count + 1,
          isLive: true
        })
      } else {
        leagueMap.set(leagueKey, {
          name: match.league,
          count: 1,
          logo: match.leagueLogo,
          country: extractCountryFromLeague(match.league),
          isLive: true,
          hasFixtures: false
        })
      }
    })

    // Process fixtures
    fixtures.forEach(match => {
      const leagueKey = match.league.toLowerCase()
      if (leagueMap.has(leagueKey)) {
        const existing = leagueMap.get(leagueKey)!
        leagueMap.set(leagueKey, {
          ...existing,
          count: existing.count + 1,
          hasFixtures: true
        })
      } else {
        leagueMap.set(leagueKey, {
          name: match.league,
          count: 1,
          logo: match.leagueLogo,
          country: extractCountryFromLeague(match.league),
          isLive: false,
          hasFixtures: true
        })
      }
    })

    return Array.from(leagueMap.values()).sort((a, b) => b.count - a.count)
  }, [matches, fixtures])

  // Extract country from league name (basic implementation)
  function extractCountryFromLeague(leagueName: string): string {
    const countryMappings: { [key: string]: string } = {
      'premier league': 'England',
      'la liga': 'Spain',
      'bundesliga': 'Germany',
      'serie a': 'Italy',
      'ligue 1': 'France',
      'champions league': 'Europe',
      'europa league': 'Europe',
      'world cup': 'World',
    }

    const lowerName = leagueName.toLowerCase()
    for (const [key, country] of Object.entries(countryMappings)) {
      if (lowerName.includes(key)) {
        return country
      }
    }

    // Try to extract country from league name patterns
    if (lowerName.includes('england') || lowerName.includes('english')) return 'England'
    if (lowerName.includes('spain') || lowerName.includes('spanish')) return 'Spain'
    if (lowerName.includes('germany') || lowerName.includes('german')) return 'Germany'
    if (lowerName.includes('italy') || lowerName.includes('italian')) return 'Italy'
    if (lowerName.includes('france') || lowerName.includes('french')) return 'France'
    if (lowerName.includes('uefa') || lowerName.includes('champions')) return 'Europe'
    
    return 'International'
  }

  // Group leagues by country
  const groupedDynamicLeagues = useMemo(() => {
    return dynamicLeagues.reduce((groups: { [country: string]: LeagueData[] }, league) => {
      const country = league.country || 'Other'
      if (!groups[country]) {
        groups[country] = []
      }
      groups[country].push(league)
      return groups
    }, {})
  }, [dynamicLeagues])

  // Filter leagues based on search
  const filteredGroupedLeagues = useMemo(() => {
    if (!searchQuery) return groupedDynamicLeagues

    const filtered: { [country: string]: LeagueData[] } = {}
    Object.entries(groupedDynamicLeagues).forEach(([country, leagues]) => {
      const filteredLeagues = leagues.filter(league =>
        league.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (filteredLeagues.length > 0) {
        filtered[country] = filteredLeagues
      }
    })
    return filtered
  }, [groupedDynamicLeagues, searchQuery])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  // Single league selection handler
  const handleLeagueClick = (leagueName: string) => {
    // If clicking the same league, deselect it
    const newSelection = selectedLeague === leagueName ? null : leagueName
    
    onLeagueSelect?.(newSelection)
    
    // Close mobile sidebar automatically after selection
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false)
    }

    // Clear search after selection for better UX
    setSearchQuery("")
  }

  // View all leagues handler
  const handleViewAll = () => {
    onLeagueSelect?.(null)
    
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false)
    }
    
    setSearchQuery("")
  }

  // Close on outside click (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileSidebarOpen(false)
      }
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileSidebarOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [isMobileSidebarOpen, setIsMobileSidebarOpen])

  // Lock scroll on mobile sidebar open
  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileSidebarOpen])

  const totalMatches = dynamicLeagues.reduce((sum, league) => sum + league.count, 0)
  const isLoading = liveLoading || fixtureLoading
  const hasError = liveError || fixtureError

  const SidebarContent = useMemo(() => {
    return ({ isMobile = false }: { isMobile?: boolean }) => (
      <div className={`h-full overflow-y-auto scrollbar-hide bg-gray-900 w-full ${isMobile ? 'pb-safe' : ''}`}>
        <div className="p-3 sm:p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
            <span className="text-white font-semibold text-sm sm:text-base truncate">Sports Betting</span>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-xs sm:text-sm font-medium">All Sports</span>
              <div className="flex items-center space-x-2">
                <div className="w-12 sm:w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="w-8 sm:w-10 h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                </div>
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-white cursor-pointer transition-colors flex-shrink-0" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs">{totalMatches} events available</span>
              {isLoading && <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />}
              {hasError && <AlertCircle className="w-3 h-3 text-orange-400" />}
            </div>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
          {/* View All Option */}
          <div>
            <Button
              variant="ghost"
              onClick={handleViewAll}
              className={`w-full justify-between p-2 sm:p-3 rounded-lg group transition-all duration-200 h-auto min-h-[40px] sm:min-h-[48px] ${
                selectedLeague === null 
                  ? "bg-yellow-400/10 border border-yellow-400/20 text-yellow-400" 
                  : "text-white hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">View All Leagues</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-800 px-2 py-1 rounded-full">
                  {totalMatches}
                </span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0" />
              </div>
            </Button>
          </div>

          {/* Dynamic Leagues from API */}
          <div>
            <Button
              variant="ghost"
              onClick={() => toggleSection("dynamic-leagues")}
              className="w-full justify-between text-yellow-400 hover:bg-gray-800 p-2 sm:p-3 rounded-lg group transition-all duration-200 h-auto min-h-[40px] sm:min-h-[48px]"
            >
              <div className="flex items-center space-x-2">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Available Leagues</span>
                {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                  {dynamicLeagues.length}
                </span>
                {expandedSections.includes("dynamic-leagues") ? (
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0" />
                )}
              </div>
            </Button>

            {expandedSections.includes("dynamic-leagues") && (
              <div className="ml-1 sm:ml-2 mt-2 space-y-3 animate-in slide-in-from-top-2 duration-200">
                {Object.entries(filteredGroupedLeagues).map(([country, leagues]) => (
                  <div key={country}>
                    <div className="flex items-center justify-between mb-2 px-2">
                      <span className="text-gray-400 text-xs font-medium">{country}</span>
                    </div>
                    
                    <div className="space-y-1">
                      {leagues.map((league) => (
                        <div
                          key={league.name}
                          className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedLeague === league.name
                              ? "bg-yellow-400/10 border border-yellow-400/20"
                              : "hover:bg-gray-800"
                          }`}
                          onClick={() => handleLeagueClick(league.name)}
                        >
                          <img
                            src={league.logo || "/placeholder.svg"}
                            alt={league.name}
                            className="w-5 h-5 object-contain mr-3 flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=20&width=20&text=🏆"
                            }}
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs sm:text-sm font-medium truncate ${
                                selectedLeague === league.name ? "text-yellow-400" : "text-gray-300"
                              }`}>
                                {league.name}
                              </span>
                              {league.isLive && (
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {league.count} match{league.count !== 1 ? 'es' : ''}
                              </span>
                              {league.isLive && (
                                <span className="text-xs text-red-400 font-medium">LIVE</span>
                              )}
                              {league.hasFixtures && !league.isLive && (
                                <span className="text-xs text-blue-400">Fixtures</span>
                              )}
                            </div>
                          </div>

                          {/* Selection indicator */}
                          {selectedLeague === league.name && (
                            <div className="ml-2 w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {Object.keys(filteredGroupedLeagues).length === 0 && searchQuery && (
                  <div className="text-center py-4 text-gray-500">
                    <Search className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs sm:text-sm">No leagues found</p>
                    <p className="text-xs">Try a different search term</p>
                  </div>
                )}

                {dynamicLeagues.length === 0 && !isLoading && (
                  <div className="text-center py-4 text-gray-500">
                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs sm:text-sm">No leagues available</p>
                    <p className="text-xs">Data will appear when matches are loaded</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected League Summary */}
          {selectedLeague && (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
              <div className="text-yellow-400 text-xs font-medium mb-2">
                Currently viewing: {selectedLeague}
              </div>
              <Button
                variant="ghost"
                onClick={handleViewAll}
                className="text-xs text-yellow-300 hover:text-yellow-400 p-0 h-auto font-normal"
              >
                View all leagues →
              </Button>
            </div>
          )}

          {/* Other Sports Categories */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-3">
              <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-400 text-xs sm:text-sm font-medium">Other Sports</span>
            </div>

            {["Hockey", "Tennis", "Basketball", "Baseball"].map((sport) => (
              <Button
                key={sport}
                variant="ghost"
                className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-800 p-2 sm:p-3 rounded-lg transition-all duration-200 group h-auto min-h-[40px] sm:min-h-[48px]"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <span className="text-sm sm:text-base flex-shrink-0">
                    {sport === "Hockey" ? "🏒" : sport === "Tennis" ? "🎾" : sport === "Basketball" ? "🏀" : "⚾"}
                  </span>
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-medium truncate w-full">{sport}</span>
                    <span className="text-xs text-gray-500">Coming soon</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            ))}
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t border-gray-700 mt-auto">
          <div className="text-center text-gray-500">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">Live Updates</span>
            </div>
            <p className="text-xs">Real-time odds & scores</p>
          </div>
        </div>
      </div>
    )
  }, [searchQuery, expandedSections, selectedLeague, dynamicLeagues, filteredGroupedLeagues, totalMatches, isLoading, hasError, handleLeagueClick, handleViewAll])

  return (
    <>
      <div className="hidden lg:block fixed top-32 left-0 h-[calc(100vh-8rem)] bg-gray-900 w-64 z-30 shadow-xl overflow-y-auto scrollbar-hide">
        {SidebarContent({ isMobile: false })}
      </div>

      {!propSetMobileSidebarOpen && (
        <div className="lg:hidden fixed top-3 sm:top-4 left-3 sm:left-4 z-40">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700 border border-gray-600 shadow-lg w-10 h-10 sm:w-12 sm:h-12"
          >
            <Menu className="text-white w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      )}

      {isMobileSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div
            ref={sidebarRef}
            className="fixed top-0 left-0 z-50 h-full w-[85vw] max-w-[320px] sm:w-80 sm:max-w-[350px] bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out"
            style={{
              transform: isMobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
            }}
          >
            <div className="flex justify-end p-2 sm:p-3 border-b border-gray-700">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="hover:bg-gray-800 w-8 h-8 sm:w-10 sm:h-10"
              >
                <X className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            {SidebarContent({ isMobile: true })}
          </div>
        </>
      )}
    </>
  )
}