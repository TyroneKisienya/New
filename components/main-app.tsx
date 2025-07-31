"use client"

import { useState } from "react"
import { TopHeader } from "@/components/top-header"
import { MainHeader } from "@/components/main-header"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { WheelOfFortune } from "@/components/wheel-of-fortune"
import { BetSlip } from "@/components/bet-slip"
import { Footer } from "@/components/footer"

export function MainApp() {
  const [selectedBets, setSelectedBets] = useState([
    {
      id: "1",
      type: "acca",
      title: "Football Acca The Voice Cup",
      matches: [{ team1: "Burnham United", team2: "Hurst Hammers", odds: 2.44 }],
      stake: 100,
      possibleProfit: 244.0,
    },
  ])
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false)

  const addToBetSlip = (bet: any) => {
    setSelectedBets((prev) => [...prev, bet])
  }

  const removeFromBetSlip = (betId: string) => {
    setSelectedBets((prev) => prev.filter((bet) => bet.id !== betId))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Fixed Headers */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900">
        <TopHeader />
        <MainHeader betCount={selectedBets.length} onToggleBetSlip={() => setIsBetSlipOpen(!isBetSlipOpen)} />
      </div>

      {/* Main Layout - Fixed positioning */}
      <div className="fixed top-[8rem] left-0 right-0 bottom-0 flex overflow-hidden">
        {/* Left Sidebar - Completely Fixed */}
        <div className="w-72 h-full bg-gray-800 border-r border-gray-700 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Middle Content - Scrollable with Footer */}
        <div className="flex-1 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <MainContent onAddToBetSlip={addToBetSlip} isBetSlipOpen={isBetSlipOpen} />
            <Footer />
          </div>
        </div>

        {/* Right Sidebar - Wheel of Fortune - Completely Fixed */}
        <div className="w-80 h-full bg-gray-800 border-l border-gray-700 flex-shrink-0 overflow-y-auto scrollbar-hide">
          <div className="p-4">
            <WheelOfFortune />
          </div>
        </div>

        {/* Right Betting Slip - Fixed when open */}
        <BetSlip
          bets={selectedBets}
          onRemoveBet={removeFromBetSlip}
          isOpen={isBetSlipOpen}
          onToggle={() => setIsBetSlipOpen(!isBetSlipOpen)}
        />
      </div>
    </div>
  )
}
