'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Car, Shield, Clock, Star, ArrowRight, CheckCircle, MapPin } from 'lucide-react'
import DachboxCard from '@/components/DachboxCard'
import { Dachbox } from '@/types'
import { supabase } from '@/lib/supabase-client'

export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState('')
  const [featuredDachboxes, setFeaturedDachboxes] = useState<Dachbox[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedDachboxes = async () => {
      const { data, error } = await supabase
        .from('dachboxes')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (!error && data) {
        setFeaturedDachboxes(data as any)
      }
      setLoading(false)
    }
    
    fetchFeaturedDachboxes()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section - Modern Clean White */}
      <section className="relative bg-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-50 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 mb-8">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Live in Deutschland
              </div>
              
              <h1 className="text-gray-900 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                Dachboxen
                <span className="block text-orange-500">einfach mieten</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
                Die erste Plattform für Dachbox-Vermietung in Deutschland. 
                Finde hochwertige Dachboxen in deiner Nähe oder verdiene Geld mit deiner eigenen.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mb-10">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Stadt oder PLZ eingeben..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-16 pr-40 py-5 text-lg rounded-2xl bg-white border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 shadow-lg"
                  />
                  <Link
                    href={`/angebote${searchLocation ? `?location=${encodeURIComponent(searchLocation)}` : ''}`}
                    className="absolute right-2 top-2 bottom-2 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold inline-flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Search className="h-5 w-5" />
                    Suchen
                  </Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/angebote" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg">
                  Jetzt Dachbox mieten
                </Link>
                <Link href="/anbieten" className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg">
                  Dachbox anbieten
                </Link>
              </div>
            </div>

            {/* Right visual - Coinbase-inspired card */}
            <div className="relative lg:pl-8">
              <div className="relative mx-auto max-w-md">
                {/* Floating background elements */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000" />
                
                {/* Main card */}
                <div className="relative bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-gray-600 font-medium">Deine Einnahmen</div>
                    <div className="text-2xl font-bold text-gray-900">€0,00</div>
                  </div>
                  
                  {/* Chart placeholder */}
                  <div className="h-40 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-500 mb-6">
                    <Car className="w-12 h-12 mb-2 text-gray-400" />
                    <div className="text-sm font-medium">Deine erste Dachbox</div>
                    <div className="text-xs">Verdiene bis zu €50/Tag</div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-orange-50 border border-orange-100">
                      <div className="text-lg font-bold text-orange-600">320L</div>
                      <div className="text-xs text-orange-600 font-medium">Volumen</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-orange-50 border border-orange-100">
                      <div className="text-lg font-bold text-orange-600">€15</div>
                      <div className="text-xs text-orange-600 font-medium">pro Tag</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-green-50 border border-green-100">
                      <div className="text-lg font-bold text-green-600">Sicher</div>
                      <div className="text-xs text-green-600 font-medium">& Versichert</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>

      {/* Featured Dachboxes - Coinbase inspired */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-orange-100 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
              Warum DachBox?
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Einfach, sicher und
              <span className="block text-orange-500">kostengünstig</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Miete eine Dachbox für dein nächstes Abenteuer oder verdiene Geld mit deiner eigenen.
              <br className="hidden md:block" />
              Alles versichert und in wenigen Klicks erledigt.
            </p>
          </div>
          
          {/* Featured Dachboxes Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Car className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-gray-600">Lade Dachboxen...</p>
            </div>
          ) : featuredDachboxes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredDachboxes.map((dachbox) => (
                  <DachboxCard key={dachbox.id} dachbox={dachbox} />
                ))}
              </div>
              
              {/* View All Button */}
              <div className="text-center">
                <Link 
                  href="/angebote" 
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Alle Dachboxen anzeigen
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Car className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Noch keine Dachboxen verfügbar
                </h3>
                <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                  Sei der Erste und biete deine Dachbox an oder schaue später wieder vorbei.
                  <br />Werde Teil der DachBox-Community!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/anbieten" 
                    className="group bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Erste Dachbox anbieten
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link 
                    href="/angebote" 
                    className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Alle Angebote durchsuchen
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section - Coinbase inspired */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-50 to-transparent rounded-full opacity-50"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-gray-50 to-transparent rounded-full opacity-50"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              Bewährte Vorteile
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Warum Dachboxen
              <span className="block text-orange-500">mieten?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Spare Geld und nutze hochwertige Dachboxen nur wenn du sie brauchst – 
              <br className="hidden md:block" />
              nachhaltig, flexibel und kostengünstig.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Car className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Kostengünstig</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Miete statt kaufen – spare hunderte von Euro bei seltenen Nutzungen und investiere das Geld lieber in deinen Urlaub.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sicher & Versichert</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Alle Dachboxen sind vollständig versichert und von vertrauenswürdigen, geprüften Anbietern.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Flexibel</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Buche nur für die Zeit, die du die Dachbox wirklich brauchst – von einem Tag bis zu mehreren Wochen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Coinbase inspired */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-orange-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gray-200 rounded-full opacity-30 blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Einfacher Prozess
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              So funktioniert's
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              In nur wenigen Schritten zu deiner perfekten Dachbox – 
              <br className="hidden md:block" />
              schnell, sicher und unkompliziert.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group relative">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Suchen & Finden</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Gib deinen Standort ein und finde verfügbare Dachboxen in deiner Nähe. Filtere nach Größe, Preis und Verfügbarkeit.
                </p>
              </div>
              {/* Connection line */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-orange-300 to-orange-400 transform -translate-y-1/2"></div>
            </div>
            
            <div className="group relative">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Buchen & Bezahlen</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Wähle deine gewünschte Dachbox und buche sie für deine Reise. Sichere Zahlung über unsere Plattform.
                </p>
              </div>
              {/* Connection line */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-orange-300 to-orange-400 transform -translate-y-1/2"></div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Abholen & Nutzen</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Hole deine Dachbox ab und genieße deinen Urlaub mit mehr Platz. Nach der Nutzung einfach zurückbringen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Coinbase inspired */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Über 1000+ zufriedene Nutzer
            </div>
            
            {/* Main heading */}
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Bereit für dein nächstes
              <span className="block bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                Abenteuer?
              </span>
            </h2>
            
            {/* Subtext */}
            <p className="text-xl md:text-2xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Finde jetzt die perfekte Dachbox für deine Reise oder verdiene Geld 
              <br className="hidden md:block" />
              mit deiner eigenen – einfach, sicher und profitabel.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/angebote" 
                className="group relative bg-white text-orange-600 hover:text-orange-700 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10">Jetzt mieten</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                href="/anbieten" 
                className="group relative bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10">Jetzt anbieten</span>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-orange-100">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Kostenlose Registrierung</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Sichere Zahlungen</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}