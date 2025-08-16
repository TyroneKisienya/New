"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, Settings, Menu, X, Radio, Calendar, Target } from "lucide-react"

type ViewMode = 'all' | 'live' | 'fixtures'

interface MainHeaderProps {
  betCount: number
  onToggleBetSlip: () => void
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
}

export function MainHeader({ 
  betCount, 
  onToggleBetSlip, 
  viewMode = 'fixtures',
  onViewModeChange 
}: MainHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])
  
  const sports = [
    { name: "Football", active: true },
    { name: "Hockey", active: false },
    { name: "Tennis", active: false },
    { name: "Basketball", active: false },
    { name: "Baseball", active: false },
    { name: "Volleyball", active: false },
    { name: "Rugby", active: false },
  ]

  const handleViewModeClick = (mode: ViewMode) => {
    onViewModeChange?.(mode)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      {/* Desktop View */}
      <div className="hidden lg:flex lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        
        {/* Left Section: View mode buttons and sports */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle Buttons */}
          <div className="flex items-center bg-gray-900 rounded-lg p-1 mr-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewModeClick('fixtures')}
              className={`px-3 py-1.5 text-xs transition-all duration-200 ${
                viewMode === 'fixtures'
                  ? "text-blue-400 bg-blue-400/20 shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Calendar className="w-3 h-3 mr-1" />
              Sportsbook
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewModeClick('live')}
              className={`px-3 py-1.5 text-xs transition-all duration-200 ${
                viewMode === 'live'
                  ? "text-red-400 bg-red-400/20 shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Radio className="w-3 h-3 mr-1" />
              Live
            </Button>
          </div>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>

          {/* Sport Buttons - Only show when in fixtures mode */}
          {viewMode === 'fixtures' && (
            <>
              {sports.map((sport) => (
                <Button
                  key={sport.name}
                  variant="ghost"
                  size="sm"
                  className={
                    sport.active
                      ? "text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }
                >
                  {sport.name}
                </Button>
              ))}
            </>
          )}

          {/* View Mode Status Indicator */}
          {viewMode === 'live' && (
            <div className="flex items-center space-x-2 ml-4 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-xs font-medium">Live Matches Only</span>
            </div>
          )}
        </div>

        {/* Right Section: Search + Betslip */}
        <div className="flex items-center gap-4">
          <div className="relative w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full"
            />
          </div>

          <Button
            variant="ghost"
            onClick={onToggleBetSlip}
            className="text-gray-300 hover:text-white relative bg-gray-700 hover:bg-gray-600"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            ({betCount})
            {betCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {betCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden" ref={mobileMenuRef}>
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between gap-4">
          {/* Hamburger Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* View Mode Toggle - Mobile Compact */}
          <div className="flex items-center bg-gray-900 rounded-lg p-1 flex-1 max-w-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewModeClick('fixtures')}
              className={`px-2 py-1 text-xs flex-1 ${
                viewMode === 'fixtures'
                  ? "text-blue-400 bg-blue-400/20"
                  : "text-gray-300"
              }`}
            >
              Sportsbook
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewModeClick('live')}
              className={`px-2 py-1 text-xs flex-1 ${
                viewMode === 'live'
                  ? "text-red-400 bg-red-400/20"
                  : "text-gray-300"
              }`}
            >
              <Radio className="w-3 h-3 mr-1" />
              Live
            </Button>
          </div>

          {/* Betslip Button */}
          <Button
            variant="ghost"
            onClick={onToggleBetSlip}
            className="text-gray-300 hover:text-white relative bg-gray-700 hover:bg-gray-600"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="ml-1">({betCount})</span>
            {betCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {betCount}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full bg-gray-800 border-t border-gray-700 shadow-lg z-40">
            <div className="p-4 space-y-4">
              {/* View Mode Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">View Mode</h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleViewModeClick('fixtures')}
                    className={`w-full justify-start ${
                      viewMode === 'fixtures'
                        ? "text-blue-400 bg-blue-400/20"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Sportsbook (Fixtures)
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleViewModeClick('live')}
                    className={`w-full justify-start ${
                      viewMode === 'live'
                        ? "text-red-400 bg-red-400/20"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <Radio className="w-4 h-4 mr-2" />
                    Live Matches
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-auto"></div>
                  </Button>
                </div>
              </div>

              {/* Sports - Only show when in sportsbook mode */}
              {viewMode === 'fixtures' && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Sports</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {sports.map((sport) => (
                      <Button
                        key={sport.name}
                        variant="ghost"
                        size="sm"
                        className={
                          sport.active
                            ? "text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30 justify-start"
                            : "text-gray-300 hover:text-white hover:bg-gray-700 justify-start"
                        }
                      >
                        {sport.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Settings</h3>
                <Button variant="ghost" className="text-gray-300 hover:text-white w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}