"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Section - Legal Links */}
          <div className="space-y-3">
            <a href="#" className="block text-gray-300 hover:text-white text-sm underline transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="block text-gray-300 hover:text-white text-sm underline transition-colors">
              Terms & Conditions
            </a>
            <a href="#" className="block text-gray-300 hover:text-white text-sm underline transition-colors">
              License
            </a>
          </div>

          {/* Center Section - Business Links */}
          <div className="space-y-3">
            <a href="#" className="block text-gray-300 hover:text-white text-sm underline transition-colors">
              Affiliate Program
            </a>
            <a href="#" className="block text-gray-300 hover:text-white text-sm underline transition-colors">
              Public Offer Agreement
            </a>
          </div>

          {/* Right Section - App Downloads */}
          <div className="flex flex-wrap gap-3 justify-start md:flex-col md:items-end">
            <a href="#" className="inline-block hover:opacity-80 transition-opacity">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/goodplaystore-IiZTQLP7KJFNJtzuYjwr5SVDsjkZfc.png"
                alt="Get it on Google Play"
                className="h-12 w-auto"
              />
            </a>
            <a href="#" className="inline-block hover:opacity-80 transition-opacity">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/appstore-4n9wm5kaIdgnpCkvKhU8hbzBxqUZbL.svg"
                alt="Download on the App Store"
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mastercard-7u3t2KgNY8Q4iGJA8JoRCE3CAaGKXX.png"
            alt="MasterCard"
            className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
          />
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/footer-18-years-Qsf3FRl088FMEVGwdEQJfJyeUnOZOf.png"
            alt="18+ Age Verification"
            className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
          />
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/visa-AGHLsDjiCIWCESKf59IMvpZ0S3vf5p.png"
            alt="Visa"
            className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Copyright and Developer Credit */}
        <div className="text-center text-gray-400 text-sm space-y-2">
          <p>primebet.com © {currentYear} | PrimeBet</p>
          <p>
            Developed by{" "}
            <a
              href="https://www.digitalflwsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 underline transition-colors"
            >
              DFS
            </a>
          </p>
        </div>
      </div>
</footer>
  )
}
