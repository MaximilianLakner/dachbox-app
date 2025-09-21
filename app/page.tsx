'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Car, Shield, Clock, Star, ArrowRight, CheckCircle, MapPin } from 'lucide-react';
import DachboxCard from '@/components/DachboxCard';
import { Dachbox } from '@/types';
import { supabase } from '@/lib/supabase-client';

export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredDachboxes, setFeaturedDachboxes] = useState<Dachbox[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedDachboxes = async () => {
      const { data, error } = await supabase
        .from('dachboxes')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (!error && data) {
        setFeaturedDachboxes(data);
      }
      setLoading(false);
    };
    
    fetchFeaturedDachboxes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-white to-blue-50/80" />
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-orange-600 shadow-sm ring-1 ring-black/5 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              Jetzt in Deutschland verfügbar
            </div>
          
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-orange-600 bg-clip-text text-transparent">
                Dachboxen einfach mieten
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
              Finde hochwertige Dachboxen in deiner Nähe oder verdiene Geld mit deiner eigenen. Einfach, sicher und günstig.
            </p>
          
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative bg-white rounded-xl shadow-lg p-1 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="In welcher Stadt suchst du?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-12 pr-36 py-3 text-base sm:text-lg bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchLocation) {
                        window.location.href = `/angebote?location=${encodeURIComponent(searchLocation)}`;
                      }
                    }}
                  />
                  <Link
                    href={`/angebote${searchLocation ? `?location=${encodeURIComponent(searchLocation)}` : ''}`}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg inline-flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Suchen</span>
                  </Link>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Über 200 Dachboxen in ganz Deutschland verfügbar
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/angebote" 
                className="group relative px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-xl text-center transform hover:-translate-y-0.5 text-sm"
              >
                Jetzt Dachbox mieten
              </Link>
              <Link 
                href="/anbieten" 
                className="group relative px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-md hover:shadow-xl text-center transform hover:-translate-y-0.5 text-sm"
              >
                Dachbox anbieten
              </Link>
            </div>
          </div>
        </div>
        
        {/* Curved Divider */}
        <div className="absolute -bottom-6 left-0 right-0 h-12 -z-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,64L80,69.3C160,75,320,85,480,90.7C640,96,800,96,960,85.3C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="currentColor" className="text-gray-50" />
          </svg>
        </div>
      </section>

      {/* Featured Dachboxes */}
      <section className="pt-20 pb-16 bg-gray-50 relative overflow-hidden -mt-1">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-orange-100 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Beliebte Dachboxen in deiner Nähe
            </h2>
            <p className="text-lg text-gray-600">
              Finde die perfekte Dachbox für dein nächstes Abenteuer
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Car className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-gray-600">Lade Dachboxen...</p>
            </div>
          ) : featuredDachboxes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
                {featuredDachboxes.map((dachbox) => (
                  <DachboxCard key={dachbox.id} dachbox={dachbox} />
                ))}
              </div>
              
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
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-xl text-center">
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

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="text-center p-4 sm:p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-100 hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">320L</div>
              <div className="text-sm sm:text-base font-medium text-orange-700">Durchschn. Volumen</div>
              <p className="mt-1 text-xs sm:text-sm text-orange-500">Platz für dein Gepäck</p>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">€15</div>
              <div className="text-sm sm:text-base font-medium text-blue-700">pro Tag</div>
              <p className="mt-1 text-xs sm:text-sm text-blue-500">Günstig & flexibel</p>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-100 hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">100%</div>
              <div className="text-sm sm:text-base font-medium text-green-700">Sicher & Versichert</div>
              <p className="mt-1 text-xs sm:text-sm text-green-500">Deine Sicherheit zählt</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
