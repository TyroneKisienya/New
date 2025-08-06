"use client"

import { Home, Trophy, ShoppingCart, FileText, User } from "lucide-react"

interface BottomNavigationProps {
  betCount: number
  onToggleBetSlip: () => void
  onToggleSidebar?: () => void
}

export function BottomNavigation({ betCount, onToggleBetSlip, onToggleSidebar }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700">
      <div className="flex justify-around items-center py-2">
        <button 
          className="flex flex-col items-center space-y-1 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
          onClick={onToggleSidebar}
        >
          <Home className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          <span className="text-xs text-gray-400 hover:text-white transition-colors">Sports</span>
        </button>
        
        <button className="flex flex-col items-center space-y-1 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Trophy className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          <span className="text-xs text-gray-400 hover:text-white transition-colors">Live</span>
        </button>
        
        <button 
          className="flex flex-col items-center space-y-1 px-3 py-2 relative hover:bg-gray-800 rounded-lg transition-colors"
          onClick={onToggleBetSlip}
        >
          <ShoppingCart className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          <span className="text-xs text-gray-400 hover:text-white transition-colors">Betslip</span>
          {betCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {betCount}
            </span>
          )}
        </button>
        
        <button className="flex flex-col items-center space-y-1 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors">
          <FileText className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          <span className="text-xs text-gray-400 hover:text-white transition-colors">My Bets</span>
        </button>
        
        <button className="flex flex-col items-center space-y-1 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors">
          <User className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          <span className="text-xs text-gray-400 hover:text-white transition-colors">Account</span>
        </button>
      </div>
    </div>
  )
}