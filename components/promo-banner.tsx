"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "GET A 100% BONUS",
      subtitle: "ON YOUR FIRST DEPOSIT",
      description: "",
      imagePosition: "left",
    },
    {
      id: 2,
      title: "YOUR COMFORT",
      subtitle: "IS OUR PRIORITY",
      description: "TRANSPARENT CALCULATIONS. FAIR ODDS.",
      imagePosition: "left",
    },
    {
      id: 3,
      title: "BET WITH CONFIDENCE",
      subtitle: "PLAY WITH PRIMEBET",
      description: "",
      imagePosition: "right",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg overflow-hidden">
      {/* Background with gradient only */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-r from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60"></div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </Button>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center z-20">
        <div className="w-full px-4 sm:px-6 md:px-8 text-center max-w-4xl">
          <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
            {/* Main Headlines */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-none tracking-tight">
                {currentSlideData.title}
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-yellow-400 leading-none tracking-tight">
                {currentSlideData.subtitle}
              </h2>
            </div>

            {/* Description */}
            {currentSlideData.description && (
              <div className="space-y-1">
                {currentSlideData.description.includes(".") ? (
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-yellow-400 tracking-wide">
                      {currentSlideData.description.split(".")[0]}.
                    </p>
                    {currentSlideData.description.split(".")[1] && (
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white tracking-wide">
                        {currentSlideData.description.split(".")[1].trim()}.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-yellow-400 tracking-wide">
                    {currentSlideData.description}
                  </p>
                )}
              </div>
            )}

            {/* Register Button */}
            <div className="pt-0 sm:pt-2 md:pt-2 lg:pt-0">
              <Button className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 lg:px-4 lg:py-4 text-sm sm:text-base md:text-lg lg:text-xl rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-white">
                REGISTER
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 md:space-x-4 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-yellow-400 scale-125 shadow-lg"
                : "bg-white/60 hover:bg-white/80 hover:scale-110"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
