"use client"
import { PromoBanner } from "@/components/promo-banner"
import { PopularEvents } from "@/components/popular-events"
import { TopLeagues } from "@/components/top-leagues"
import { DetailedMatchTables } from "@/components/detailed-match-tables"
import { RealSportsGrid } from "@/components/real-sports-grid"
import { FixturesGrid }  from "@/components/fixtures-grid"

interface MainContentProps {
  onAddToBetSlip: (bet: any) => void
  isBetSlipOpen: boolean
}

export function MainContent({ onAddToBetSlip, isBetSlipOpen }: MainContentProps) {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 space-y-6">
        <PromoBanner />
        <PopularEvents onAddToBetSlip={onAddToBetSlip} />
        <TopLeagues />
        
        {/* Live Matches Section */}
        <RealSportsGrid onAddToBetSlip={onAddToBetSlip} />
        
        {/* Fixtures Section - Right after live matches */}
        <FixturesGrid onAddToBetSlip={onAddToBetSlip} />
      </div>
    </div>
  )
}