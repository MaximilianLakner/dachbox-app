'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Star, 
  MapPin, 
  Lock, 
  Car, 
  Calendar, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  User,
  Clock
} from 'lucide-react'
import { Dachbox, Review, MOUNTING_TYPES } from '@/types'
import { supabase } from '@/lib/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ReviewList from '@/components/ReviewList'
import ReviewForm from '@/components/ReviewForm'
import BookingPaymentFlow from '@/components/BookingPaymentFlow'

interface DachboxDetailPageProps {
  params: {
    id: string
  }
}

export default function DachboxDetailPage({ params }: DachboxDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)
  const [dachbox, setDachbox] = useState<Dachbox | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0)
  
  const { user } = useAuth() as any
  const router = useRouter()

  useEffect(() => {
    fetchDachbox()
  }, [params.id])

  const fetchDachbox = async () => {
    try {
      const { data, error } = await supabase
        .from('dachboxes')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        throw error
      }

      setDachbox(data)
    } catch (error) {
      console.error('Error fetching dachbox:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!dachbox) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dachbox nicht gefunden</h1>
          <p className="text-gray-600">Die angeforderte Dachbox existiert nicht.</p>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % dachbox.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + dachbox.images.length) % dachbox.images.length)
  }

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    // Prevent negative rental periods
    if (days <= 0) return 0
    
    return days * dachbox.price_per_day + (dachbox.roof_rack_price || 0)
  }

  const handleBookingClick = () => {
    if (!user) {
      router.push('/anmelden')
      return
    }
    setShowBookingModal(true)
  }

  const handlePaymentStart = () => {
    setShowBookingModal(false)
    setShowPaymentFlow(true)
  }

  const handlePaymentSuccess = (bookingId: string) => {
    setShowPaymentFlow(false)
    router.push(`/booking-success?booking_id=${bookingId}`)
  }

  const handlePaymentCancel = () => {
    setShowPaymentFlow(false)
    setShowBookingModal(true)
  }

  const isValidDateRange = () => {
    if (!startDate || !endDate) return false
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Start date must be today or in the future
    if (start < today) return false
    
    // End date must be after start date
    if (end <= start) return false
    
    return true
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb - Sticky */}
        <nav className="sticky top-0 z-10 py-4 mb-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-primary-600">Startseite</a></li>
            <li>/</li>
            <li><a href="/angebote" className="hover:text-primary-600">Angebote</a></li>
            <li>/</li>
            <li className="text-gray-900">{dachbox.brand} {dachbox.model}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery - Sticky */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {dachbox.images && dachbox.images.length > 0 ? (
                <Image
                  src={dachbox.images[currentImageIndex]}
                  alt={`${dachbox.brand} ${dachbox.model}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">Kein Bild verfügbar</span>
                </div>
              )}
              
              {/* Navigation arrows */}
              {dachbox.images && dachbox.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail strip */}
            {dachbox.images && dachbox.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {dachbox.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    style={{ width: '80px', height: '60px' }}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={80}
                      height={60}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {dachbox.brand} {dachbox.model}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{dachbox.pickup_city} {dachbox.pickup_postal_code}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-primary-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    {dachbox.price_per_day}€
                  </span>
                  <span className="text-gray-600 ml-1">/Tag</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Abholung</p>
                  <p className="text-sm font-medium text-green-600">Verfügbar</p>
                </div>
              </div>
              
              {dachbox.includes_roof_rack ? (
                <p className="text-sm text-green-600 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Dachträger im Preis inbegriffen</span>
                </p>
              ) : dachbox.roof_rack_price ? (
                <p className="text-sm text-gray-600">
                  Dachträger: +{dachbox.roof_rack_price}€/Tag
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Dachträger nicht verfügbar
                </p>
              )}
            </div>

            {/* Quick Booking */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Schnellbuchung
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abholung
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rückgabe
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>
                </div>
                
                {startDate && endDate && !isValidDateRange() && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">
                      {new Date(startDate) >= new Date() 
                        ? "Das Rückgabedatum muss nach dem Abholdatum liegen."
                        : "Das Abholdatum muss heute oder in der Zukunft liegen."
                      }
                    </p>
                  </div>
                )}
                
                {startDate && endDate && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Gesamtpreis</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {calculateTotalPrice()}€
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} Tage × {dachbox.price_per_day}€
                      {dachbox.roof_rack_price && ` + Dachträger ${dachbox.roof_rack_price}€`}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleBookingClick}
                  disabled={!startDate || !endDate || !isValidDateRange()}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Jetzt buchen
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ausstattung
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Volumen</span>
                  <span className="font-medium">{dachbox.volume}L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Maße</span>
                  <span className="font-medium">{dachbox.length} × {dachbox.width} × {dachbox.height} cm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Befestigung</span>
                  <span className="font-medium">{MOUNTING_TYPES[dachbox.mounting_type]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Zustand</span>
                  <span className="font-medium capitalize">{dachbox.condition}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Schloss</span>
                  <div className="flex items-center space-x-1">
                    {dachbox.has_lock ? (
                      <>
                        <Lock className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">Ja</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Nein</span>
                    )}
                  </div>
                </div>
                {dachbox.extras.length > 0 && (
                  <div>
                    <span className="text-gray-600 block mb-2">Extras</span>
                    <div className="flex flex-wrap gap-2">
                      {dachbox.extras.map((extra, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full"
                        >
                          {extra}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Abholort
              </h3>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {dachbox.pickup_city}
                  </p>
                  <p className="text-sm text-gray-600">
                    {dachbox.pickup_postal_code}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Beschreibung
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {dachbox.description}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <div className="card">
            <ReviewList 
              dachboxId={params.id} 
              refreshTrigger={reviewRefreshTrigger}
            />
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Buchung bestätigen
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Zeitraum</span>
                  <span className="font-medium">
                    {new Date(startDate).toLocaleDateString('de-DE')} - {new Date(endDate).toLocaleDateString('de-DE')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dachbox</span>
                  <span className="font-medium">{dachbox.brand} {dachbox.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preis</span>
                  <span className="font-medium">{calculateTotalPrice()}€</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Gesamt</span>
                    <span>{calculateTotalPrice()}€</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="btn-secondary flex-1"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handlePaymentStart}
                  className="btn-primary flex-1"
                >
                  Bezahlen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Flow */}
        {showPaymentFlow && dachbox && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <BookingPaymentFlow
                  bookingData={{
                    dachbox_id: dachbox.id,
                    dachbox_title: `${dachbox.brand} ${dachbox.model}`,
                    dachbox_location: `${dachbox.pickup_city}, ${dachbox.pickup_postal_code}`,
                    start_date: startDate,
                    end_date: endDate,
                    total_days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
                    price_per_day: dachbox.price_per_day,
                    landlord_name: 'Vermieter', // Will be fetched from user data
                    landlord_email: 'landlord@example.com', // Will be fetched from user data
                    landlord_phone: '+49 123 456789' // Will be fetched from user data
                  }}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
