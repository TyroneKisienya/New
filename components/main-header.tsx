"use client"

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30">
              Sportsbook
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
              Live
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1">
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
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-10 w-48 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
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
    </div>
  )
}
