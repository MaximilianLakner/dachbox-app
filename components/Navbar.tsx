'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Car, User, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">DachBox</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/angebote" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2.5 rounded-full hover:bg-gray-50">
              Dachboxen finden
            </Link>
            <Link href="/how-to" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2.5 rounded-full hover:bg-gray-50">
              Wie es funktioniert
            </Link>
            
            {user ? (
              <>
                <Link href="/anbieten" className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-full transition-all duration-200">
                  Dachbox anbieten
                </Link>
                <Link href="/account" className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2.5 rounded-full flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/anmelden" className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2.5 rounded-full">
                  Anmelden
                </Link>
                <Link href="/registrieren" className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-full transition-all duration-200">
                  Registrieren
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
            <div className="absolute inset-y-0 right-0 w-5/6 max-w-sm bg-white shadow-xl p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Menü</span>
                <button onClick={() => setIsOpen(false)} className="text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <Link
                href="/angebote"
                className="px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                Dachboxen finden
              </Link>
              <Link
                href="/how-to"
                className="px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                Wie es funktioniert
              </Link>
              {user ? (
                <>
                  <Link
                    href="/anbieten"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 mt-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Dachbox anbieten
                  </Link>
                  <Link
                    href="/account"
                    className="px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Mein Account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/anmelden"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Anmelden
                  </Link>
                  <Link
                    href="/registrieren"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Registrieren
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
