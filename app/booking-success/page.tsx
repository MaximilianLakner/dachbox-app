'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Calendar, MapPin, Mail, Phone, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BookingSuccessPage() {
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('booking_id')

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      // In a real implementation, you would fetch the booking details from your API
      // For now, we'll simulate the data
      setTimeout(() => {
        setBooking({
          id: bookingId,
          dachbox_title: 'Thule Motion XT XL',
          dachbox_location: 'München, 80331',
          start_date: '2024-03-15',
          end_date: '2024-03-20',
          total_days: 5,
          total_amount: 125,
          landlord_name: 'Max Mustermann',
          landlord_email: 'max@example.com',
          landlord_phone: '+49 123 456789',
          status: 'confirmed'
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching booking details:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Buchung nicht gefunden</h1>
          <p className="text-gray-600">Die angeforderte Buchung existiert nicht.</p>
          <Button 
            onClick={() => router.push('/')}
            className="mt-4 bg-orange-500 hover:bg-orange-600"
          >
            Zur Startseite
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buchung erfolgreich!
          </h1>
          <p className="text-lg text-gray-600">
            Deine Zahlung wurde erfolgreich verarbeitet. Du erhältst in Kürze eine Bestätigungsemail.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Buchungsdetails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">{booking.dachbox_title}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {booking.dachbox_location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Von:</span>
                  <p className="font-medium">{new Date(booking.start_date).toLocaleDateString('de-DE')}</p>
                </div>
                <div>
                  <span className="text-gray-600">Bis:</span>
                  <p className="font-medium">{new Date(booking.end_date).toLocaleDateString('de-DE')}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gesamtbetrag:</span>
                  <span className="text-xl font-bold text-gray-900">{booking.total_amount}€</span>
                </div>
                <p className="text-sm text-gray-500">
                  {booking.total_days} Tage × {booking.total_amount / booking.total_days}€/Tag
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 font-medium">
                  Status: Bestätigt ✓
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Kontaktdaten des Vermieters
              </CardTitle>
              <CardDescription>
                Du kannst den Vermieter jetzt kontaktieren, um die Abholung zu koordinieren.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">{booking.landlord_name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a 
                    href={`mailto:${booking.landlord_email}`}
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    {booking.landlord_email}
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a 
                    href={`tel:${booking.landlord_phone}`}
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    {booking.landlord_phone}
                  </a>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Tipp:</strong> Kontaktiere den Vermieter mindestens 24 Stunden vor der Abholung, 
                  um den genauen Treffpunkt und die Uhrzeit zu vereinbaren.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Nächste Schritte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-orange-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Vermieter kontaktieren</h3>
                <p className="text-sm text-gray-600">
                  Vereinbare Treffpunkt und Uhrzeit für die Abholung
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Dachbox abholen</h3>
                <p className="text-sm text-gray-600">
                  Prüfe die Dachbox bei der Abholung auf Vollständigkeit
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Bewertung abgeben</h3>
                <p className="text-sm text-gray-600">
                  Nach der Rückgabe kannst du eine Bewertung hinterlassen
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button
            onClick={() => router.push('/account?tab=bookings')}
            variant="outline"
            className="flex items-center gap-2"
          >
            Meine Buchungen anzeigen
          </Button>
          
          <Button
            onClick={() => router.push('/angebote')}
            className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
          >
            Weitere Dachboxen entdecken
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
