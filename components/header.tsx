"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, User, Wallet, ShoppingCart } from "lucide-react"

interface HeaderProps {
  betCount: number
  onToggleBetSlip: () => void
}

export function Header({ betCount, onToggleBetSlip }: HeaderProps) {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold text-lg">P</span>
              </div>
            </div>
            <span className="text-xl font-bold text-yellow-400">PRIMEBET</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search sports, teams, events..."
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Bell className="w-5 h-5" />
          </Button>

          <Button variant="ghost" className="text-gray-300 hover:text-white">
            <Wallet className="w-4 h-4 mr-2" />
            $1,250.00
          </Button>

          <Button variant="ghost" onClick={onToggleBetSlip} className="text-gray-300 hover:text-white relative">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Bet Slip
            {betCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {betCount}
              </span>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
