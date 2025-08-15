"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Search, Settings, Menu, X, Trophy, Target, Gamepad2, Loader2, AlertCircle, Star } from "lucide-react"
import { useLiveFootballData } from "@/hooks/use-live-football-data"
import { useFixtureData } from "@/hooks/use-fixture-data"

type ViewMode = 'all' | 'live' | 'fixtures'

interface SidebarProps {
  isMobileSidebarOpen?: boolean
  setIsMobileSidebarOpen?: (open: boolean) => void
  onLeagueSelect?: (selectedLeague: string | null) => void
  selectedLeague?: string | null
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
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
  liveCount: number
  fixtureCount: number
}

// Top leagues configuration with their logos
const TOP_LEAGUES = [
  {
    name: "UEFA Champions League",
    displayName: "Champions League",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UEFA%20Champions%20League-1038OsVDMz7U7fGckCiEjuVRDYluAV.jpeg",
    country: "Europe"
  },
  {
    name: "England Premier League",
    displayName: "Premier League",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/England%20Premier%20League-6grdGDMet2AzcnS6FgzSpIZSBwSR0K.png",
    country: "England"
  },
  {
    name: "Spain La Liga",
    displayName: "La Liga",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spain%20La%20Liga-vVMKZjwCJHTdItKFCpcbDBhQWRtEXj.png",
    country: "Spain"
  },
  {
    name: "Italy Serie A",
    displayName: "Serie A",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/taly%20Serie%20A-9BFcrHrLend4M8bRcV3OPiWJQ9dp3j.png",
    country: "Italy"
  },
  {
    name: "Germany Bundesliga",
    displayName: "Bundesliga",
    logo: "/placeholder.svg",
    country: "Germany"
  },
  {
    name: "France Ligue 1",
    displayName: "Ligue 1",
    logo: "/placeholder.svg",
    country: "France"
  }
]

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
  selectedLeague,
  viewMode = 'fixtures',
  onViewModeChange
}: SidebarProps = {}) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["top-leagues"])
  const [internalMobileSidebarOpen, setInternalMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Get data from your existing hooks
  const { matches, loading: liveLoading, error: liveError } = useLiveFootballData()
  const { fixtures, loading: fixtureLoading, error: fixtureError } = useFixtureData()

  const isMobileSidebarOpen = propMobileSidebarOpen ?? internalMobileSidebarOpen
  const setIsMobileSidebarOpen = propSetMobileSidebarOpen ?? setInternalMobileSidebarOpen

  // Process API data to extract unique leagues with counts, separating live and fixtures
  const allLeaguesData = useMemo(() => {
    const leagueMap = new Map<string, LeagueData>()

    // Process live matches
    matches.forEach((match: { league: string; leagueLogo: any }) => {
      const leagueKey = match.league.toLowerCase()
      if (leagueMap.has(leagueKey)) {
        const existing = leagueMap.get(leagueKey)!
        leagueMap.set(leagueKey, {
          ...existing,
          count: existing.count + 1,
          liveCount: existing.liveCount + 1,
          isLive: true
        })
      } else {
        leagueMap.set(leagueKey, {
          name: match.league,
          count: 1,
          liveCount: 1,
          fixtureCount: 0,
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
          fixtureCount: existing.fixtureCount + 1,
          hasFixtures: true
        })
      } else {
        leagueMap.set(leagueKey, {
          name: match.league,
          count: 1,
          liveCount: 0,
          fixtureCount: 1,
          logo: match.leagueLogo,
          country: extractCountryFromLeague(match.league),
          isLive: false,
          hasFixtures: true
        })
      }
    })

    return Array.from(leagueMap.values()).sort((a, b) => b.count - a.count)
  }, [matches, fixtures])

  // Get top leagues with data (always show all data)
  const topLeaguesWithData = useMemo(() => {
    return TOP_LEAGUES.map(topLeague => {
      const matchingLeague = allLeaguesData.find(league => 
        league.name.toLowerCase().includes(topLeague.name.toLowerCase()) ||
        topLeague.name.toLowerCase().includes(league.name.toLowerCase())
      )
      
      return {
        ...topLeague,
        count: matchingLeague?.count || 0,
        isLive: matchingLeague?.isLive || false,
        hasFixtures: matchingLeague?.hasFixtures || false,
        hasData: (matchingLeague?.count || 0) > 0,
        liveCount: matchingLeague?.liveCount || 0,
        fixtureCount: matchingLeague?.fixtureCount || 0
      }
    }).filter(league => league.hasData)
  }, [allLeaguesData])

  // Get remaining leagues (not in top leagues)
  const remainingLeagues = useMemo(() => {
    const topLeagueNames = TOP_LEAGUES.map(tl => tl.name.toLowerCase())
    return allLeaguesData.filter(league => 
      !topLeagueNames.some(topName => 
        league.name.toLowerCase().includes(topName) ||
        topName.includes(league.name.toLowerCase())
      )
    )
  }, [allLeaguesData])

  // Extract country from league name (enhanced version)
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
      'england': 'England',
      'spain': 'Spain',
      'germany': 'Germany',
      'italy': 'Italy',
      'france': 'France'
    }

    const lowerName = leagueName.toLowerCase()
    for (const [key, country] of Object.entries(countryMappings)) {
      if (lowerName.includes(key)) {
        return country
      }
    }

    return 'International'
  }

  // Group remaining leagues by country
  const groupedRemainingLeagues = useMemo(() => {
    return remainingLeagues.reduce((groups: { [country: string]: LeagueData[] }, league) => {
      const country = league.country || 'Other'
      if (!groups[country]) {
        groups[country] = []
      }
      groups[country].push(league)
      return groups
    }, {})
  }, [remainingLeagues])

  // Filter leagues based on search
  const filteredTopLeagues = useMemo(() => {
    if (!searchQuery) return topLeaguesWithData
    return topLeaguesWithData.filter(league =>
      league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [topLeaguesWithData, searchQuery])

  const filteredGroupedLeagues = useMemo(() => {
    if (!searchQuery) return groupedRemainingLeagues

    const filtered: { [country: string]: LeagueData[] } = {}
    Object.entries(groupedRemainingLeagues).forEach(([country, leagues]) => {
      const filteredLeagues = leagues.filter(league =>
        league.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (filteredLeagues.length > 0) {
        filtered[country] = filteredLeagues
      }
    })
    return filtered
  }, [groupedRemainingLeagues, searchQuery])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  // Enhanced league selection handler
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

  // Handle top league click
  const handleTopLeagueClick = (topLeagueName: string) => {
    // Find the matching league name from actual data
    const matchingLeague = allLeaguesData.find(league => 
      league.name.toLowerCase().includes(topLeagueName.toLowerCase()) ||
      topLeagueName.toLowerCase().includes(league.name.toLowerCase())
    )
    
    if (matchingLeague) {
      handleLeagueClick(matchingLeague.name)
    }
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

  const totalMatches = allLeaguesData.reduce((sum, league) => sum + league.count, 0)
  const isLoading = liveLoading || fixtureLoading
  const hasError = liveError || fixtureError

  const SidebarContent = useMemo(() => {
    return ({ isMobile = false }: { isMobile?: boolean }) => (
      <div className={`h-full overflow-y-auto scrollbar-hide bg-gray-900 w-full ${isMobile ? 'pb-safe' : ''}`}>
        <div className="p-3 sm:p-4 border-b border-gray-700">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
            <span className="text-white font-semibold text-sm sm:text-base truncate">Sports Betting</span>
          </div>

          {/* Status */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-xs sm:text-sm font-medium">Available Leagues</span>
              <div className="flex items-center space-x-2">
                <div className="w-12 sm:w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-8 sm:w-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300"></div>
                </div>
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-white cursor-pointer transition-colors flex-shrink-0" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs">
                {totalMatches} events available
              </span>
              {isLoading && <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />}
              {hasError && <AlertCircle className="w-3 h-3 text-orange-400" />}
            </div>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
          {/* Top Leagues Section - Always expanded by default */}
          <div>
            <Button
              variant="ghost"
              onClick={() => toggleSection("top-leagues")}
              className="w-full justify-between text-yellow-400 hover:bg-gray-800 p-2 sm:p-3 rounded-lg group transition-all duration-200 h-auto min-h-[40px] sm:min-h-[48px]"
            >
              <div className="flex items-center space-x-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Top Leagues</span>
                {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                  {filteredTopLeagues.length}
                </span>
                {expandedSections.includes("top-leagues") ? (
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0" />
                )}
              </div>
            </Button>

            {expandedSections.includes("top-leagues") && (
              <div className="ml-1 sm:ml-2 mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                {filteredTopLeagues.map((league) => (
                  <div
                    key={league.name}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                      selectedLeague && (
                        selectedLeague === league.name ||
                        allLeaguesData.find(l => 
                          l.name.toLowerCase().includes(league.name.toLowerCase()) ||
                          league.name.toLowerCase().includes(l.name.toLowerCase())
                        )?.name === selectedLeague
                      )
                        ? "bg-yellow-400/10 border-yellow-400/30 shadow-md"
                        : "bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                    }`}
                    onClick={() => handleTopLeagueClick(league.name)}
                  >
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 flex-shrink-0 p-1">
                      <img
                        src={league.logo || "/placeholder.svg"}
                        alt={league.displayName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24&text=🏆"
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium truncate ${
                          selectedLeague && (
                            selectedLeague === league.name ||
                            allLeaguesData.find(l => 
                              l.name.toLowerCase().includes(league.name.toLowerCase()) ||
                              league.name.toLowerCase().includes(l.name.toLowerCase())
                            )?.name === selectedLeague
                          ) ? "text-yellow-400" : "text-white"
                        }`}>
                          {league.displayName}
                        </span>
                        {league.liveCount > 0 && (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {league.count} matches
                        </span>
                        {league.liveCount > 0 && (
                          <span className="text-xs text-red-400 font-medium">
                            {league.liveCount} LIVE
                          </span>
                        )}
                        {league.fixtureCount > 0 && (
                          <span className="text-xs text-blue-400">
                            {league.fixtureCount} Fixtures
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {selectedLeague && (
                      selectedLeague === league.name ||
                      allLeaguesData.find(l => 
                        l.name.toLowerCase().includes(league.name.toLowerCase()) ||
                        league.name.toLowerCase().includes(l.name.toLowerCase())
                      )?.name === selectedLeague
                    ) && (
                      <div className="ml-2 w-2 h-2 rounded-full flex-shrink-0 bg-yellow-400" />
                    )}
                  </div>
                ))}
                
                {filteredTopLeagues.length === 0 && searchQuery && (
                  <div className="text-center py-4 text-gray-500">
                    <Search className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs sm:text-sm">No top leagues found</p>
                  </div>
                )}

                {filteredTopLeagues.length === 0 && !searchQuery && (
                  <div className="text-center py-4 text-gray-500">
                    <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs sm:text-sm">No matches in top leagues</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Other Available Leagues */}
          {Object.keys(groupedRemainingLeagues).length > 0 && (
            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection("other-leagues")}
                className="w-full justify-between text-gray-300 hover:bg-gray-800 p-2 sm:p-3 rounded-lg group transition-all duration-200 h-auto min-h-[40px] sm:min-h-[48px]"
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Other Leagues</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                    {remainingLeagues.length}
                  </span>
                  {expandedSections.includes("other-leagues") ? (
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0" />
                  )}
                </div>
              </Button>

              {expandedSections.includes("other-leagues") && (
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
                                {league.liveCount > 0 && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {league.count} matches
                                </span>
                                {league.liveCount > 0 && (
                                  <span className="text-xs text-red-400 font-medium">
                                    {league.liveCount} LIVE
                                  </span>
                                )}
                                {league.fixtureCount > 0 && (
                                  <span className="text-xs text-blue-400">
                                    {league.fixtureCount} Fixtures
                                  </span>
                                )}
                              </div>
                            </div>

                            {selectedLeague === league.name && (
                              <div className="ml-2 w-2 h-2 rounded-full flex-shrink-0 bg-yellow-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {Object.keys(filteredGroupedLeagues).length === 0 && !searchQuery && (
                    <div className="text-center py-4 text-gray-500">
                      <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm">No matches in other leagues</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Selected League Summary */}
          {selectedLeague && (
            <div className="bg-yellow-400/10 border-yellow-400/20 border rounded-lg p-3">
              <div className="text-xs font-medium mb-2 text-yellow-400">
                Currently viewing: {selectedLeague}
              </div>
              <Button
                variant="ghost"
                onClick={handleViewAll}
                className="text-xs p-0 h-auto font-normal text-yellow-300 hover:text-yellow-400"
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
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse bg-green-400"></div>
              <span className="text-xs">Live Updates</span>
            </div>
            <p className="text-xs">Real-time odds & scores</p>
          </div>
        </div>
      </div>
    )
  }, [searchQuery, expandedSections, selectedLeague, allLeaguesData, filteredTopLeagues, filteredGroupedLeagues, topLeaguesWithData, remainingLeagues, totalMatches, isLoading, hasError, handleLeagueClick, handleTopLeagueClick, handleViewAll])

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