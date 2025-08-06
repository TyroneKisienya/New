"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Search, Settings, Menu, X, Trophy, Target, Gamepad2 } from "lucide-react"

interface SidebarProps {
  isMobileSidebarOpen?: boolean
  setIsMobileSidebarOpen?: (open: boolean) => void
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
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

export function Sidebar({ isMobileSidebarOpen: propMobileSidebarOpen, setIsMobileSidebarOpen: propSetMobileSidebarOpen }: SidebarProps = {}) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["top-leagues"])
  const [internalMobileSidebarOpen, setInternalMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeLeague, setActiveLeague] = useState<string | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const isMobileSidebarOpen = propMobileSidebarOpen ?? internalMobileSidebarOpen
  const setIsMobileSidebarOpen = propSetMobileSidebarOpen ?? setInternalMobileSidebarOpen

  const topLeagues = useMemo(() => [
    { name: "UEFA Super Cup", count: 12, icon: "🏆" },
    { name: "Germany DFL Super Cup", count: 8, icon: "🇩🇪" },
    { name: "UEFA Champions League", count: 24, icon: "⭐" },
    { name: "Greece Premier League", count: 16, icon: "🇬🇷" },
    { name: "Spain La Liga", count: 20, icon: "🇪🇸" },
    { name: "England Premier League", count: 18, icon: "🏴󐁧󐁢󐁥󐁮󐁧󐁿" },
    { name: "Futsal Friendlies", count: 6, icon: "⚽" },
  ], [])

  const sportsCategories = useMemo(() => [
    { name: "Football", icon: "⚽", count: 156, color: "text-green-400" },
    { name: "Hockey", icon: "🏒", count: 42, color: "text-blue-400" },
    { name: "Tennis", icon: "🎾", count: 28, color: "text-yellow-400" },
    { name: "Basketball", icon: "🏀", count: 34, color: "text-orange-400" },
    { name: "Baseball", icon: "⚾", count: 18, color: "text-red-400" },
  ], [])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
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

  const SidebarContent = useMemo(() => {
    const filteredLeagues = topLeagues.filter(league =>
      league.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
            <span className="text-gray-400 text-xs">156 events available</span>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => toggleSection("top-leagues")}
              className="w-full justify-between text-yellow-400 hover:bg-gray-800 p-2 sm:p-3 rounded-lg group transition-all duration-200 h-auto min-h-[40px] sm:min-h-[48px]"
            >
              <div className="flex items-center space-x-2">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Top Leagues</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                  {filteredLeagues.length}
                </span>
                {expandedSections.includes("top-leagues") ? (
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0" />
                )}
              </div>
            </Button>

            {expandedSections.includes("top-leagues") && (
              <div className="ml-1 sm:ml-2 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                {filteredLeagues.map((league) => (
                  <Button
                    key={league.name}
                    variant="ghost"
                    onClick={() => setActiveLeague(league.name === activeLeague ? null : league.name)}
                    className={`w-full justify-between text-left p-2 sm:p-3 rounded-lg transition-all duration-200 h-auto min-h-[44px] sm:min-h-[52px] ${
                      activeLeague === league.name
                        ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <span className="text-sm sm:text-base flex-shrink-0">{league.icon}</span>
                      <div className="flex flex-col items-start min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-medium truncate w-full">{league.name}</span>
                        <span className="text-xs text-gray-500">Live matches</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      <span className="text-xs bg-gray-800 text-gray-300 px-1.5 sm:px-2 py-1 rounded-full">
                        {league.count}
                      </span>
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                        league.count > 15 ? "bg-green-400" : league.count > 8 ? "bg-yellow-400" : "bg-gray-500"
                      }`} />
                    </div>
                  </Button>
                ))}
                {filteredLeagues.length === 0 && searchQuery && (
                  <div className="text-center py-4 text-gray-500">
                    <Search className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs sm:text-sm">No leagues found</p>
                    <p className="text-xs">Try a different search term</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-3">
              <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-400 text-xs sm:text-sm font-medium">Other Sports</span>
            </div>

            {sportsCategories.map((sport) => (
              <div key={sport.name}>
                <Button
                  variant="ghost"
                  onClick={() => toggleSection(sport.name.toLowerCase())}
                  className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-800 p-2 sm:p-3 rounded-lg transition-all duration-200 group h-auto min-h-[40px] sm:min-h-[48px]"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <span className="text-sm sm:text-base flex-shrink-0">{sport.icon}</span>
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-medium truncate w-full">{sport.name}</span>
                      <span className="text-xs text-gray-500">Multiple leagues</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <span className={`text-xs font-medium ${sport.color}`}>
                      {sport.count}
                    </span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Button>

                {expandedSections.includes(sport.name.toLowerCase()) && (
                  <div className="ml-4 sm:ml-6 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <div className="text-center py-4 sm:py-6 text-gray-500">
                      <Gamepad2 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-30" />
                      <p className="text-xs sm:text-sm">Coming Soon</p>
                      <p className="text-xs">{sport.name} leagues will be available soon</p>
                    </div>
                  </div>
                )}
              </div>
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
  }, [searchQuery, expandedSections, activeLeague])

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
 