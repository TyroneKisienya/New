"use client"

import { useState, useEffect } from "react"
import { supabase } from '@/lib/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'
import TopHeader from "@/components/top-header"
import { MainHeader } from "@/components/main-header"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { WheelOfFortune } from "@/components/wheel-of-fortune"
import { BetSlip } from "@/components/bet-slip"
import { BottomNavigation } from "./bottom-navigation"
import { Footer } from "@/components/footer"
import ResetPasswordPage from "@/components/reset-password-page"
import LoginPage from "@/components/auth/LoginPage"
import RegisterPage from "@/components/auth/RegisterPage"
import ForgotPasswordPage from "@/components/auth/ForgotPasswordPage"

// Import the updated hooks
import { useLeagueFilter } from "@/hooks/use-league-filter"
import { useLiveFootballData } from "@/hooks/use-live-football-data"
import { useFixtureData } from "@/hooks/use-fixture-data"

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

// Auth Modal Component
interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  currentView: 'login' | 'register' | 'forgot-password'
  onViewChange: (view: 'login' | 'register' | 'forgot-password') => void
  onLoginSuccess: (session: Session) => void
}

function AuthModal({ isOpen, onClose, currentView, onViewChange, onLoginSuccess }: AuthModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
        >
          ×
        </button>
        
        <div className="p-6">
          {currentView === 'login' && (
            <LoginPage
              onClose={onClose}
              onSwitchToRegister={() => onViewChange('register')}
              onSwitchToForgotPassword={() => onViewChange('forgot-password')}
              onLoginSuccess={onLoginSuccess}
            />
          )}
          
          {currentView === 'register' && (
            <RegisterPage
              onClose={onClose}
              onSwitchToLogin={() => onViewChange('login')}
            />
          )}
          
          {currentView === 'forgot-password' && (
            <ForgotPasswordPage
              onClose={onClose}
              onSwitchToLogin={() => onViewChange('login')}
              onSwitchToRegister={() => onViewChange('register')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function MainApp() {
  const [selectedBets, setSelectedBets] = useState<Bet[]>([])
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot-password'>('login')

  // Get match data from your existing hooks
  const { matches } = useLiveFootballData()
  const { fixtures } = useFixtureData()

  // Use the updated league filter hook for single selection
  const {
    selectedLeague,
    availableLeagues,
    filteredMatches,
    filteredFixtures,
    handleLeagueSelection,
    clearFilters,
    hasActiveFilters,
    filterStats
  } = useLeagueFilter({ matches, fixtures })

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for password recovery first
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        const type = urlParams.get('type')
        
        console.log('URL check:', { type, hasTokens: !!(accessToken && refreshToken) })
        
        if (type === 'recovery' && accessToken && refreshToken) {
          console.log('Password recovery detected, showing reset page')
          setShowResetPassword(true)
          return // Don't proceed with normal session check
        }

        // Normal session check
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        console.log('Initial session check:', !!session)
        setSession(session)
        setUser(session?.user ?? null)

      } catch (error) {
        console.error('Auth initialization error:', error)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, !!session)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery event detected')
          setShowResetPassword(true)
        }
        
        if (event === 'SIGNED_IN' && session) {
          setIsAuthModalOpen(false)
        }

        if (event === 'SIGNED_OUT') {
          setShowResetPassword(false)
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
    console.log('Reset password completed')
    setShowResetPassword(false)
    
    // Clean up URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
    
    // Sign out user so they can log in with new password
    supabase.auth.signOut()
  }

  const handleOpenLoginModal = () => {
    setAuthView('login')
    setIsAuthModalOpen(true)
  }

  const handleLoginSuccess = (session: Session) => {
    setSession(session)
    setUser(session.user)
    setIsAuthModalOpen(false)
  }

  const handlePlaceBet = async (betData: any) => {
    try {
      // Here you would implement your bet placement logic
      console.log('Placing bet for user:', user?.id, betData)
      
      // Example: Save bet to database
      // const { data, error } = await supabase
      //   .from('bets')
      //   .insert({
      //     user_id: user?.id,
      //     bet_data: betData,
      //     stake: betData.stake,
      //     total_odds: betData.totalOdds,
      //     possible_profit: betData.possibleProfit,
      //     status: 'pending'
      //   })
      
      // if (error) throw error
      
      // For now, just show success message and clear bets
      alert('Bet placed successfully!')
      setSelectedBets([]) // Clear bets after successful placement
      setIsBetSlipOpen(false) // Close bet slip
      
    } catch (error) {
      console.error('Error placing bet:', error)
      alert('Failed to place bet. Please try again.')
    }
  }

  // Show reset password page if needed
  if (showResetPassword) {
    return <ResetPasswordPage onComplete={handleResetPasswordComplete} />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Fixed Headers */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg">
        <TopHeader session={session} user={user} />
        <MainHeader betCount={selectedBets.length} onToggleBetSlip={() => setIsBetSlipOpen(!isBetSlipOpen)} />
      </div>

      {/* Sidebar with single league selection */}
      <Sidebar 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        onLeagueSelect={handleLeagueSelection}
        selectedLeague={selectedLeague}
      />

      {/* Main Layout - adjusted for fixed sidebars */}
      <div className="pt-32 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Left spacing for desktop sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0"></div>

          {/* Center content with filtered data */}
          <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide pb-16 lg:pb-0">
            <MainContent 
              onAddToBetSlip={addToBetSlip} 
              isBetSlipOpen={isBetSlipOpen}
              selectedLeague={selectedLeague}
              filteredMatches={filteredMatches}
              filteredFixtures={filteredFixtures}
              onClearFilters={clearFilters}
              filterStats={filterStats}
            />

            {/* Wheel - only visible on mobile */}
            <div className="block lg:hidden px-4 pb-4">
              <WheelOfFortune />
            </div>

            <Footer />
          </div>

          {/* Right spacing for desktop wheel sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0"></div>

          {/* Bet Slip with Authentication */}
          <BetSlip
            bets={selectedBets}
            onRemoveBet={removeFromBetSlip}
            isOpen={isBetSlipOpen}
            onToggle={() => setIsBetSlipOpen(!isBetSlipOpen)}
            isAuthenticated={!!user}
            onLogin={handleOpenLoginModal}
            onPlaceBet={handlePlaceBet}
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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentView={authView}
        onViewChange={setAuthView}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}