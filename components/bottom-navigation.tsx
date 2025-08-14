"use client"

import { Home, Trophy, ShoppingCart, FileText, User, Radio } from "lucide-react"

type ViewMode = 'all' | 'live' | 'fixtures'

interface BottomNavigationProps {
  betCount: number
  onToggleBetSlip: () => void
  onToggleSidebar?: () => void
  viewMode?: ViewMode
  onBottomNavClick?: (action: 'sports' | 'live' | 'betslip' | 'my-bets' | 'account') => void
}

export function BottomNavigation({ 
  betCount, 
  onToggleBetSlip, 
  onToggleSidebar,
  viewMode = 'fixtures',
  onBottomNavClick
}: BottomNavigationProps) {
  
  const handleClick = (action: 'sports' | 'live' | 'betslip' | 'my-bets' | 'account') => {
    if (onBottomNavClick) {
      onBottomNavClick(action)
    } else {
      // Fallback to legacy handlers
      if (action === 'sports' && onToggleSidebar) {
        onToggleSidebar()
      } else if (action === 'betslip') {
        onToggleBetSlip()
      }
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700">
      <div className="flex justify-around items-center py-2">
        <button 
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
            viewMode === 'all' 
              ? 'bg-yellow-400/20 text-yellow-400' 
              : 'hover:bg-gray-800 text-gray-400 hover:text-white'
          }`}
          onClick={() => handleClick('sports')}
        >
          <Home className="w-5 h-5 transition-colors" />
          <span className="text-xs transition-colors">Sports</span>
        </button>
        
        <button 
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors relative ${
            viewMode === 'live' 
              ? 'bg-red-400/20 text-red-400' 
              : 'hover:bg-gray-800 text-gray-400 hover:text-white'
          }`}
          onClick={() => handleClick('live')}
        >
          <div className="relative">
            <Radio className="w-5 h-5 transition-colors" />
            {viewMode === 'live' && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <span className="text-xs transition-colors">Live</span>
        </button>
        
        <button 
          className="flex flex-col items-center space-y-1 px-3 py-2 relative hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          onClick={() => handleClick('betslip')}
        >
          <ShoppingCart className="w-5 h-5 transition-colors" />
          <span className="text-xs transition-colors">Betslip</span>
          {betCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {betCount}
            </span>
          )}
        </button>
        
        <button 
          className="flex flex-col items-center space-y-1 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          onClick={() => handleClick('my-bets')}
        >
          <FileText className="w-5 h-5 transition-colors" />
          <span className="text-xs transition-colors">My Bets</span>
        </button>
        
        <button 
          className="flex flex-col items-center space-y-1 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          onClick={() => handleClick('account')}
        >
          <User className="w-5 h-5 transition-colors" />
          <span className="text-xs transition-colors">Account</span>
        </button>
      </div>
    </div>
  )
}