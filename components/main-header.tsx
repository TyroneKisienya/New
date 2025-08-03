"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, Settings, Menu, X } from "lucide-react"

interface MainHeaderProps {
  betCount: number
  onToggleBetSlip: () => void
}

export function MainHeader({ betCount, onToggleBetSlip }: MainHeaderProps) {
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

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      {/* Desktop View - Keep as is */}
      <div className="hidden lg:flex lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        
        {/* Left Section: All main buttons including sports */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Actions */}
          <Button variant="ghost" className="text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30">
            Sportsbook
          </Button>
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
            Live
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>

          {/* Sport Buttons */}
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
            Betslip ({betCount})
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

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full"
            />
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
              {/* Primary Actions */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="ghost" className="text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30 justify-start">
                    Sportsbook
                  </Button>
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700 justify-start">
                    Live
                  </Button>
                </div>
                <Button variant="ghost" className="text-gray-300 hover:text-white w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>

              {/* Sports */}
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}