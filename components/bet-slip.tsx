"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { X, ChevronUp, Minus, Plus, Trash2, LogIn, Check } from "lucide-react"

interface BetSlipProps {
  bets: any[]
  onRemoveBet: (betId: string) => void
  isOpen: boolean
  onToggle: () => void
  isAuthenticated?: boolean
  onLogin?: () => void
  onPlaceBet?: (betData: any) => void
}

export function BetSlip({ 
  bets, 
  onRemoveBet, 
  isOpen, 
  onToggle, 
  isAuthenticated = false,
  onLogin,
  onPlaceBet 
}: BetSlipProps) {
  const [activeTab, setActiveTab] = useState("Ordinary")
  const [stake, setStake] = useState(100)
  const [autoAcceptChanges, setAutoAcceptChanges] = useState(true)
  const [isPlacingBet, setIsPlacingBet] = useState(false)

  const adjustStake = (increment: boolean) => {
    setStake((prev) => Math.max(0, prev + (increment ? 10 : -10)))
  }

  const handlePlaceBet = async () => {
    if (!isAuthenticated) {
      onLogin?.()
      return
    }

    setIsPlacingBet(true)

    const totalOdds = bets.reduce((acc, bet) => acc * (bet.odds || 2.44), 1)
    const betData = {
      bets,
      stake,
      autoAcceptChanges,
      betType: activeTab,
      totalOdds,
      possibleProfit: stake * totalOdds
    }

    try {
      await onPlaceBet?.(betData)
    } catch (error) {
      console.error('Error placing bet:', error)
    } finally {
      setIsPlacingBet(false)
    }
  }

  const clearAllBets = () => {
    bets.forEach(bet => onRemoveBet(bet.id))
  }

  const totalOdds = bets.reduce((acc, bet) => acc * (bet.odds || 2.44), 1)
  const possibleProfit = stake * totalOdds

  return (
    <div
      className={`fixed right-0 top-[8rem] h-[calc(100vh-8rem)] bg-gray-800 border-l border-gray-700 transition-all duration-300 z-40 ${
        isOpen ? "w-72" : "w-0"
      } overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">Betslip ({bets.length})</span>
            {bets.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllBets}
                className="text-xs text-gray-400 hover:text-red-400"
              >
                Clear All
              </Button>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle} className="w-6 h-6">
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex p-4 pb-2 space-x-2 flex-shrink-0">
          {["Ordinary", "Express", "System"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab
                  ? "bg-amber-600 text-white hover:bg-amber-700 text-xs px-4 py-2 rounded-full"
                  : "text-gray-400 hover:text-white text-xs px-4 py-2 rounded-full"
              }
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4">
          {bets.length > 0 ? (
            <div className="space-y-4">
              {bets.map((bet, index) => (
                <Card key={bet.id || index} className="bg-gray-700 border-gray-600 relative">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium mb-2 truncate">
                            {bet.eventName || "Football Austin The Waco Cup"}
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">👕</span>
                              </div>
                              <span className="text-gray-300 text-sm truncate">
                                {bet.homeTeam || "Enumclaw United"}
                              </span>
                            </div>
                            <div className="text-yellow-400 font-bold text-lg ml-2">
                              {bet.odds || "2.44"}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs">👕</span>
                            </div>
                            <span className="text-gray-300 text-sm truncate">
                              {bet.awayTeam || "Black Diamond FC"}
                            </span>
                          </div>
                          <div className="text-white text-sm">
                            <span className="text-gray-400">Selection: </span>
                            <span className="font-medium">
                              {bet.selection || "Enumclaw United"}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 text-gray-400 hover:text-red-400 flex-shrink-0 ml-2"
                          onClick={() => onRemoveBet(bet.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Stake Controls */}
              <div className="space-y-4 bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-white font-medium text-center">Stake & Betting Options</h3>

                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => adjustStake(false)}
                    className="w-8 h-8 text-gray-400 hover:text-white border border-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-white text-xl font-bold min-w-16 text-center">${stake}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => adjustStake(true)}
                    className="w-8 h-8 text-gray-400 hover:text-white border border-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="bg-gray-800 p-3 rounded space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Odds:</span>
                    <span className="text-white font-medium">{totalOdds.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Stake:</span>
                    <span className="text-white font-medium">${stake}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-2">
                    <span className="text-white font-medium">Possible Profit:</span>
                    <span className="text-green-400 font-bold">${possibleProfit.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded">
                  <Switch
                    checked={autoAcceptChanges}
                    onCheckedChange={setAutoAcceptChanges}
                    className="data-[state=checked]:bg-amber-600"
                  />
                  <span className="text-gray-300 text-sm flex-1">
                    Auto accept odds changes
                  </span>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handlePlaceBet}
                    disabled={isPlacingBet || bets.length === 0}
                    className={`w-full font-semibold py-3 transition-all ${
                      isAuthenticated 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                    }`}
                  >
                    {isPlacingBet ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Placing Bet...</span>
                      </div>
                    ) : !isAuthenticated ? (
                      <div className="flex items-center space-x-2">
                        <LogIn className="w-4 h-4" />
                        <span>Place Bet</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>Place Bet (${stake})</span>
                      </div>
                    )}
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="text-xs text-gray-400 text-center">
                      You need to login to place bets
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No bets selected</h3>
              <p className="text-sm">Click on odds in the matches to add bets to your slip</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
