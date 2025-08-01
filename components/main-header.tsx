"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, Settings } from "lucide-react"

interface MainHeaderProps {
  betCount: number
  onToggleBetSlip: () => void
}

export function MainHeader({ betCount, onToggleBetSlip }: MainHeaderProps) {
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full"
            />
          </div>

          <Button
            variant="ghost"
            onClick={onToggleBetSlip}
            className="text-gray-300 hover:text-white relative bg-gray-700 hover:bg-gray-600 w-full sm:w-auto"
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
    </div>
  )
}
