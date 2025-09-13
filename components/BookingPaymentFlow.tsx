'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, MapPin, Euro, Info, CreditCard } from 'lucide-react'
import { formatCurrency, calculatePlatformFee, calculateLandlordEarnings } from '@/lib/stripe-client'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BookingData {
  dachbox_id: string
  dachbox_title: string
  dachbox_location: string
  start_date: string
  end_date: string
  total_days: number
  price_per_day: number
  landlord_name: string
  landlord_email: string
  landlord_phone?: string
}

interface BookingPaymentFlowProps {
  bookingData: BookingData
  onSuccess: (bookingId: string) => void
  onCancel: () => void
}

function CheckoutForm({ bookingData, onSuccess, onCancel }: BookingPaymentFlowProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [bookingId, setBookingId] = useState('')

  const totalAmount = bookingData.total_days * bookingData.price_per_day * 100 // Convert to cents
  const platformFee = calculatePlatformFee(totalAmount)
  const landlordEarnings = calculateLandlordEarnings(totalAmount)

  useEffect(() => {
    createPaymentIntent()
  }, [])

  const createPaymentIntent = async () => {
    try {
      console.log('Creating payment intent with data:', {
        dachbox_id: bookingData.dachbox_id,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        total_days: bookingData.total_days,
        price_per_day: bookingData.price_per_day,
      })

      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          dachbox_id: bookingData.dachbox_id,
          start_date: bookingData.start_date,
          end_date: bookingData.end_date,
          total_days: bookingData.total_days,
          price_per_day: bookingData.price_per_day,
        }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      
      if (response.ok) {
        setClientSecret(data.client_secret)
        setPaymentIntentId(data.payment_intent_id)
        setBookingId(data.booking_id)
      } else {
        console.error('Error creating payment intent:', data.error)
        alert(`Fehler: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      alert(`Netzwerkfehler: ${error}`)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-success?booking_id=${bookingId}`,
      },
    })

    if (error) {
      console.error('Payment failed:', error)
      setLoading(false)
    } else {
      onSuccess(bookingId)
    }
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Buchungsübersicht
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{bookingData.dachbox_title}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {bookingData.dachbox_location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Von:</span>
              <p className="font-medium">{new Date(bookingData.start_date).toLocaleDateString('de-DE')}</p>
            </div>
            <div>
              <span className="text-gray-600">Bis:</span>
              <p className="font-medium">{new Date(bookingData.end_date).toLocaleDateString('de-DE')}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{bookingData.total_days} Tage × {formatCurrency(bookingData.price_per_day * 100)}</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Plattformgebühr (10%)</span>
              <span>{formatCurrency(platformFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Gesamt</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Kontaktdaten werden nach Zahlung geteilt</p>
                <p>Nach erfolgreicher Zahlung erhältst du die Kontaktdaten des Vermieters und kannst die Abholung koordinieren.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Zahlungsmethode
          </CardTitle>
          <CardDescription>
            Wähle deine bevorzugte Zahlungsmethode. Alle Zahlungen werden sicher über Stripe abgewickelt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={!stripe || loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                {formatCurrency(totalAmount)} bezahlen
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BookingPaymentFlow(props: BookingPaymentFlowProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
