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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-orange-600 shadow-sm ring-1 ring-black/5 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            Verfügbare Dachboxen
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-orange-600 bg-clip-text text-transparent">
              Dachboxen finden
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Finde die perfekte Dachbox für deinen nächsten Urlaub –
            hochwertig, geprüft und sofort verfügbar.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Stadt oder PLZ eingeben..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-base sm:text-lg bg-transparent border-0 focus:ring-0 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchLocation) {
                    setFilteredDachboxes(
                      allDachboxes.filter(dachbox => 
                        dachbox.pickup_city.toLowerCase().includes(searchLocation.toLowerCase()) ||
                        dachbox.pickup_postal_code.includes(searchLocation)
                      )
                    )
                  }
                }}
              />
              {searchLocation && (
                <button
                  onClick={() => setSearchLocation('')}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setFilteredDachboxes(
                  allDachboxes.filter(dachbox => 
                    searchLocation && (
                      dachbox.pickup_city.toLowerCase().includes(searchLocation.toLowerCase()) ||
                      dachbox.pickup_postal_code.includes(searchLocation)
                    )
                  )
                )}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm h-10 flex items-center"
              >
                Suchen
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 font-medium transition-colors text-sm whitespace-nowrap h-10 w-full md:w-auto"
            >
              <Filter className="w-4 h-4" />
              Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>

          {/* Active Filters */}
          {(activeFiltersCount > 0 || searchLocation) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              {searchLocation && (
                <div className="flex items-center bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm border border-gray-200">
                  <span>Ort: {searchLocation}</span>
                  <button 
                    onClick={() => setSearchLocation('')}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {Object.entries(filters).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null
                
                let displayValue = value
                if (key === 'mounting_type' && Array.isArray(value)) {
                  displayValue = value.join(', ')
                } else if (key === 'has_lock' || key === 'includes_roof_rack') {
                  displayValue = value ? 'Ja' : 'Nein'
                }
                
                return (
                  <div key={key} className="flex items-center bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm border border-gray-200">
                    <span className="capitalize">{key.replace(/_/g, ' ')}: {displayValue}</span>
                    <button 
                      onClick={() => setFilters({...filters, [key]: undefined})}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
              <button 
                onClick={clearFilters}
                className="text-orange-500 hover:text-orange-700 text-sm font-medium ml-2 hover:underline"
              >
                Alle Filter zurücksetzen
              </button>
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
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

        {/* Dachboxen Grid */}
        {filteredDachboxes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
            {filteredDachboxes.map((dachbox) => (
              <DachboxCard key={dachbox.id} dachbox={dachbox} />
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-16 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Keine Ergebnisse gefunden</h3>
            <p className="text-gray-600 mb-6">Versuche deine Suchkriterien zu ändern oder setze die Filter zurück.</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
