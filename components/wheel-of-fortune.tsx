"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function WheelOfFortune() {
  const [selectedAmount, setSelectedAmount] = useState("50.00")
  const [isSpinning, setIsSpinning] = useState(false)

  const handleSpin = () => {
    setIsSpinning(true)
    setTimeout(() => {
      setIsSpinning(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Select an event */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Select an event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span>⚠️</span>
                <span>Always agree to a change in the coefficient</span>
              </div>
            </div>
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
              Select Bets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wheel of Fortune */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Wheel of Fortune</CardTitle>
          <p className="text-gray-400 text-sm">Spin the wheel of fortune and try your luck with a chance to win!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wheel Display */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={`w-48 h-48 rounded-full border-4 border-yellow-500 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 flex items-center justify-center ${
                  isSpinning ? "animate-spin" : ""
                }`}
                style={{
                  background: `conic-gradient(
                    from 0deg,
                    #ef4444 0deg 60deg,
                    #eab308 60deg 120deg,
                    #22c55e 120deg 180deg,
                    #3b82f6 180deg 240deg,
                    #8b5cf6 240deg 300deg,
                    #f97316 300deg 360deg
                  )`,
                }}
              >
                <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center border-4 border-yellow-500">
                  <div className="text-center">
                    <div className="text-yellow-400 text-2xl font-bold">${selectedAmount}</div>
                  </div>
                </div>
              </div>
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-500"></div>
              </div>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Bet Amount</label>
              <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="10.00">$10.00</SelectItem>
                  <SelectItem value="25.00">$25.00</SelectItem>
                  <SelectItem value="50.00">$50.00</SelectItem>
                  <SelectItem value="100.00">$100.00</SelectItem>
                  <SelectItem value="250.00">$250.00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Custom Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold py-3"
            >
              {isSpinning ? "Spinning..." : "SPIN THE WHEEL"}
            </Button>
          </div>

          {/* Rules */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Minimum bet: $10.00</p>
            <p>• Maximum bet: $1,000.00</p>
            <p>• Win up to 10x your bet amount</p>
            <p>• Results are determined randomly</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
