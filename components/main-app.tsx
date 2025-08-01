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
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg">
        <TopHeader />
        <MainHeader betCount={selectedBets.length} onToggleBetSlip={() => setIsBetSlipOpen(!isBetSlipOpen)} />
      </div>

      {/* Main Layout */}
      <div className="pt-32 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-72 h-full bg-gray-800 border-r border-gray-700 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Sidebar for mobile (if applicable) */}
          <Sidebar />

          {/* Center content + wheel + footer */}
          <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
            <MainContent onAddToBetSlip={addToBetSlip} isBetSlipOpen={isBetSlipOpen} />

            {/* Wheel - only visible on mobile */}
            <div className="block lg:hidden px-4 pb-4">
              <WheelOfFortune />
            </div>

            <Footer />
          </div>

          {/* Right Sidebar - Desktop Only */}
          <div className="hidden lg:block w-80 h-full bg-gray-800 border-l border-gray-700 flex-shrink-0 overflow-y-auto scrollbar-hide">
            <div className="p-4">
              <WheelOfFortune />
            </div>
          </div>

          {/* Bet Slip */}
          <BetSlip
            bets={selectedBets}
            onRemoveBet={removeFromBetSlip}
            isOpen={isBetSlipOpen}
            onToggle={() => setIsBetSlipOpen(!isBetSlipOpen)}
          />
        </div>
      </div>
    </div>
  )
}