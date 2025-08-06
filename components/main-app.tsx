"use client"

import { useState, useEffect } from "react"
import { supabase } from '@/lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'
import TopHeader from "@/components/top-header"
import { MainHeader } from "@/components/main-header"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { WheelOfFortune } from "@/components/wheel-of-fortune"
import { BetSlip } from "@/components/bet-slip"
import { BottomNavigation } from "./bottom-navigation"
import { Footer } from "@/components/footer"
import ResetPasswordPage from "@/components/reset-password-page"

// Define the bet type
interface Bet {
  id: string
  type?: string
  title?: string
  eventName?: string
  homeTeam?: string
  awayTeam?: string
  odds?: number
  selection?: string
  matches?: any[]
  stake?: number
  possibleProfit?: number
}

export function MainApp() {
  const [selectedBets, setSelectedBets] = useState<Bet[]>([])
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    // Check for password recovery session on app load
    const checkForPasswordRecovery = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Check URL parameters for password recovery
      const urlParams = new URLSearchParams(window.location.search)
      const accessToken = urlParams.get('access_token')
      const refreshToken = urlParams.get('refresh_token')
      const type = urlParams.get('type')
      
      if (type === 'recovery' && accessToken && refreshToken) {
        // Set the session for password recovery
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        
        if (!error && data.session) {
          setSession(data.session)
          setShowResetPassword(true)
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }
    }

    checkForPasswordRecovery()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setSession(session)
          setShowResetPassword(true)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const addToBetSlip = (bet: Bet) => {
    setSelectedBets((prev) => [...prev, bet])
  }

  const removeFromBetSlip = (betId: string) => {
    setSelectedBets((prev) => prev.filter((bet) => bet.id !== betId))
  }

  const handleResetPasswordComplete = () => {
    setShowResetPassword(false)
    setSession(null)
  }

  // Show reset password page if needed
  if (showResetPassword && session) {
    return <ResetPasswordPage onComplete={handleResetPasswordComplete} />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Fixed Headers */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg">
        <TopHeader />
        <MainHeader betCount={selectedBets.length} onToggleBetSlip={() => setIsBetSlipOpen(!isBetSlipOpen)} />
      </div>

      {/* Sidebar component - handles its own positioning, pass mobile control */}
      <Sidebar 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Main Layout - adjusted for fixed sidebars */}
      <div className="pt-32 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Left spacing for desktop sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0"></div>

          {/* Center content */}
          <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide pb-16 lg:pb-0">
            <MainContent onAddToBetSlip={addToBetSlip} isBetSlipOpen={isBetSlipOpen} />

            {/* Wheel - only visible on mobile */}
            <div className="block lg:hidden px-4 pb-4">
              <WheelOfFortune />
            </div>

            <Footer />
          </div>

          {/* Right spacing for desktop wheel sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0"></div>

          {/* Bet Slip */}
          <BetSlip
            bets={selectedBets}
            onRemoveBet={removeFromBetSlip}
            isOpen={isBetSlipOpen}
            onToggle={() => setIsBetSlipOpen(!isBetSlipOpen)}
          />
        </div>
      </div>

      {/* Fixed Right Sidebar - Desktop Only with Fixed Wheel */}
      <div className="hidden lg:block fixed top-32 right-0 w-80 h-[calc(100vh-8rem)] bg-gray-800 border-l border-gray-700 z-30 overflow-y-auto">
        <div className="p-4 h-full flex items-start">
          <div className="w-full">
            <WheelOfFortune />
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation - Mobile Only */}
      <div className="block lg:hidden">
        <BottomNavigation 
          betCount={selectedBets.length} 
          onToggleBetSlip={() => setIsBetSlipOpen(!isBetSlipOpen)}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
      </div>
    </div>
  )
}