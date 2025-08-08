"use client"
import { PromoBanner } from "@/components/promo-banner"
import { PopularEvents } from "@/components/popular-events"
import { TopLeagues } from "@/components/top-leagues"
import { DetailedMatchTables } from "@/components/detailed-match-tables"

interface Match {
  id: string
  league: string
  leagueLogo?: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo?: string
  awayTeamLogo?: string
  homeScore: number | null
  awayScore: number | null
  time: string
  status: string
  venue?: string
  referee?: string
  odds?: {
    home: number
    draw: number
    away: number
  }
}

interface FilterStats {
  totalMatches: number
  filteredMatches: number
  totalFixtures: number
  filteredFixtures: number
}

interface MainContentProps {
  onAddToBetSlip: (bet: any) => void
  isBetSlipOpen: boolean
  selectedLeagues?: string[]
  filteredMatches?: Match[]
  filteredFixtures?: Match[]
  onClearFilters?: () => void
  filterStats?: FilterStats
}

export function MainContent({ 
  onAddToBetSlip, 
  isBetSlipOpen, 
  selectedLeagues = [],
  filteredMatches = [],
  filteredFixtures = [],
  onClearFilters,
  filterStats
}: MainContentProps) {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 space-y-6">
        <PromoBanner />
        <PopularEvents onAddToBetSlip={onAddToBetSlip} />
        <TopLeagues />
        
        {/* Live Matches Section with filtering */}
        <DetailedMatchTables 
          onAddToBetSlip={onAddToBetSlip} 
          selectedLeagues={selectedLeagues}
          filteredMatches={filteredMatches}
          filteredFixtures={filteredFixtures}
          onClearFilters={onClearFilters}
          filterStats={filterStats}
        />
      </div>
    </div>
  )
}