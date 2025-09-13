'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, X } from 'lucide-react'
import DachboxCard from '@/components/DachboxCard'
import { Dachbox, SearchFilters, MountingType, MOUNTING_TYPES, EXTRAS } from '@/types'
import { supabase } from '@/lib/supabase-client'

export default function AngebotePage() {
  const [searchLocation, setSearchLocation] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [allDachboxes, setAllDachboxes] = useState<Dachbox[]>([])
  const [filteredDachboxes, setFilteredDachboxes] = useState<Dachbox[]>([])

  useEffect(() => {
    const fetchDachboxes = async () => {
      const { data, error } = await supabase
        .from('dachboxes')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
      if (!error && data) {
        setAllDachboxes(data as any)
        setFilteredDachboxes(data as any)
      }
    }
    fetchDachboxes()
  }, [])

  useEffect(() => {
    let filtered = allDachboxes

    // Location filter
    if (searchLocation) {
      filtered = filtered.filter(dachbox => 
        dachbox.pickup_city.toLowerCase().includes(searchLocation.toLowerCase()) ||
        dachbox.pickup_postal_code.includes(searchLocation)
      )
    }

    // Price filter
    if (filters.min_price !== undefined) {
      filtered = filtered.filter(dachbox => dachbox.price_per_day >= filters.min_price!)
    }
    if (filters.max_price !== undefined) {
      filtered = filtered.filter(dachbox => dachbox.price_per_day <= filters.max_price!)
    }

    // Mounting type filter
    if (filters.mounting_type && filters.mounting_type.length > 0) {
      filtered = filtered.filter(dachbox => 
        filters.mounting_type!.includes(dachbox.mounting_type as MountingType)
      )
    }

    // Volume filter
    if (filters.min_volume !== undefined) {
      filtered = filtered.filter(dachbox => dachbox.volume >= filters.min_volume!)
    }
    if (filters.max_volume !== undefined) {
      filtered = filtered.filter(dachbox => dachbox.volume <= filters.max_volume!)
    }

    // Lock filter
    if (filters.has_lock !== undefined) {
      filtered = filtered.filter(dachbox => dachbox.has_lock === filters.has_lock)
    }

    // Roof rack filter
    if (filters.includes_roof_rack !== undefined) {
      filtered = filtered.filter(dachbox => dachbox.includes_roof_rack === filters.includes_roof_rack)
    }

    // Extras filter
    if (filters.extras && filters.extras.length > 0) {
      filtered = filtered.filter(dachbox => 
        filters.extras!.every(extra => dachbox.extras.includes(extra))
      )
    }

    setFilteredDachboxes(filtered)
  }, [searchLocation, filters, allDachboxes])

  const clearFilters = () => {
    setFilters({})
    setSearchLocation('')
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined
  ).length + (searchLocation ? 1 : 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header - Coinbase inspired */}
        <div className="mb-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
            Verfügbare Dachboxen
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Dachboxen
            <span className="block text-orange-500">finden</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Finde die perfekte Dachbox für deinen nächsten Urlaub –
            <br className="hidden md:block" />
            hochwertig, geprüft und sofort verfügbar.
          </p>
        </div>

        {/* Search and Filters - Modern design */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-12">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Stadt oder PLZ eingeben..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 text-lg"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-2xl border border-gray-200 py-6 px-6 shadow-md mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preis pro Tag (€)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.min_price || ''}
                      onChange={(e) => setFilters({...filters, min_price: e.target.value ? Number(e.target.value) : undefined})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.max_price || ''}
                      onChange={(e) => setFilters({...filters, max_price: e.target.value ? Number(e.target.value) : undefined})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Volume Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volumen (L)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.min_volume || ''}
                      onChange={(e) => setFilters({...filters, min_volume: e.target.value ? Number(e.target.value) : undefined})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.max_volume || ''}
                      onChange={(e) => setFilters({...filters, max_volume: e.target.value ? Number(e.target.value) : undefined})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Mounting Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Befestigungsart
                  </label>
                  <select
                    value={filters.mounting_type?.[0] || ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      mounting_type: e.target.value ? [e.target.value as MountingType] : undefined
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Alle</option>
                    {Object.entries(MOUNTING_TYPES).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ausstattung
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.has_lock || false}
                        onChange={(e) => setFilters({...filters, has_lock: e.target.checked || undefined})}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Mit Schloss</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.includes_roof_rack || false}
                        onChange={(e) => setFilters({...filters, includes_roof_rack: e.target.checked || undefined})}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Dachträger inkl.</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Extras */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extras
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {EXTRAS.map((extra) => (
                    <label key={extra} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.extras?.includes(extra) || false}
                        onChange={(e) => {
                          const currentExtras = filters.extras || []
                          if (e.target.checked) {
                            setFilters({...filters, extras: [...currentExtras, extra]})
                          } else {
                            setFilters({...filters, extras: currentExtras.filter(e => e !== extra)})
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{extra}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-orange-600 hover:text-orange-700 font-semibold flex items-center space-x-2 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-full transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Filter zurücksetzen</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results - Modern styling */}
        <div className="mb-8">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 sm:gap-4">
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium text-sm">
              {filteredDachboxes.length} Dachboxen gefunden
            </div>
            {searchLocation && (
              <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                in {searchLocation}
              </div>
            )}
          </div>
        </div>

        {/* Dachbox Grid - Responsive */}
        {filteredDachboxes.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredDachboxes.map((dachbox) => (
              <div key={dachbox.id} className="flex">
                <DachboxCard dachbox={dachbox} />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-xl text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Keine Dachboxen gefunden
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Versuche es mit anderen Suchkriterien oder erweitere deinen Suchradius.
                <br />Neue Angebote werden täglich hinzugefügt!
              </p>
              <button
                onClick={clearFilters}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
              >
                Filter zurücksetzen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
