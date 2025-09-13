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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white overflow-x-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-blue-50/30" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Live in Deutschland
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
              <span className="block">Dachboxen</span>
              <span className="text-orange-500">einfach mieten</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Finde hochwertige Dachboxen in deiner Nähe oder verdiene Geld mit deiner eigenen.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative bg-white rounded-2xl shadow-xl p-1">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="In welcher Stadt suchst du?"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-12 pr-36 py-4 text-base sm:text-lg bg-transparent border-0 focus:ring-0 focus:outline-none"
                />
                <Link
                  href={`/angebote${searchLocation ? `?location=${encodeURIComponent(searchLocation)}` : ''}`}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl inline-flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Search className="h-4 w-4" />
                  <span>Suchen</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/angebote" 
              className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center"
            >
              Jetzt Dachbox mieten
            </Link>
            <Link 
              href="/anbieten" 
              className="px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg text-center"
            >
              Dachbox anbieten
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-100">
              <div className="text-4xl font-bold text-orange-600 mb-2">320L</div>
              <div className="text-lg font-medium text-orange-700">Durchschn. Volumen</div>
              <p className="mt-2 text-orange-600">Genug Platz für dein Gepäck</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100">
              <div className="text-4xl font-bold text-blue-600 mb-2">€15</div>
              <div className="text-lg font-medium text-blue-700">pro Tag</div>
              <p className="mt-2 text-blue-600">Günstiger als ein Mietwagen</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-100">
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-lg font-medium text-green-700">Sicher & Versichert</div>
              <p className="mt-2 text-green-600">Deine Sicherheit steht an erster Stelle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dachboxes */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
    </div>
  );
}
