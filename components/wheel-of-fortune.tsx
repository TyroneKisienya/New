"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      {/* Wheel of Fortune */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg sm:text-xl">
            Wheel of Fortune
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Spin the wheel of fortune and try your luck with a chance to win!
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Wheel Display */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={`w-48 h-48 sm:w-40 sm:h-40 xs:w-32 xs:h-32 rounded-full border-4 border-yellow-500 flex items-center justify-center ${
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
                <div className="w-32 h-32 sm:w-28 sm:h-28 xs:w-24 xs:h-24 bg-gray-900 rounded-full flex items-center justify-center border-4 border-yellow-500">
                  <div className="text-center">
                    <div className="text-yellow-400 text-2xl sm:text-xl xs:text-lg font-bold">
                      ${selectedAmount}
                    </div>
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
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
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
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full"
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
