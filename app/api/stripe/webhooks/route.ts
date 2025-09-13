import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe-server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { sendBookingConfirmationEmails, scheduleReviewReminder } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object, supabase)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object, supabase)
        break
      
      case 'account.updated':
        await handleAccountUpdated(event.data.object, supabase)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handlePaymentSucceeded(paymentIntent: any, supabase: any) {
  const bookingId = paymentIntent.metadata.booking_id

  if (!bookingId) {
    console.error('No booking_id in payment intent metadata')
    return
  }

  // Update booking status
  await supabase
    .from('bookings')
    .update({
      payment_status: 'succeeded',
      status: 'confirmed',
      stripe_charge_id: paymentIntent.latest_charge,
      contact_shared_at: new Date().toISOString()
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  // Update payment record
  await supabase
    .from('payments')
    .update({
      status: 'succeeded',
      stripe_charge_id: paymentIntent.latest_charge
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  // Send confirmation emails
  try {
    await sendBookingConfirmationEmailsForBooking(bookingId, supabase)
    await scheduleReviewReminderForBooking(bookingId, supabase)
  } catch (error) {
    console.error('Error sending confirmation emails:', error)
  }

  console.log(`Payment succeeded for booking ${bookingId}`)
}

async function handlePaymentFailed(paymentIntent: any, supabase: any) {
  const bookingId = paymentIntent.metadata.booking_id

  if (!bookingId) {
    console.error('No booking_id in payment intent metadata')
    return
  }

  // Update booking status
  await supabase
    .from('bookings')
    .update({
      payment_status: 'failed',
      status: 'canceled'
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  // Update payment record
  await supabase
    .from('payments')
    .update({
      status: 'failed'
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  console.log(`Payment failed for booking ${bookingId}`)
}

async function handleAccountUpdated(account: any, supabase: any) {
  // Update user's onboarding status if account is now fully set up
  if (account.charges_enabled && account.payouts_enabled) {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_connect_account_id', account.id)
      .single()

    if (userData) {
      await supabase
        .from('users')
        .update({ stripe_onboarding_completed: true })
        .eq('id', userData.id)
      
      console.log(`Account updated for user ${userData.id}`)
    }
  }
}

async function sendBookingConfirmationEmailsForBooking(bookingId: string, supabase: any) {
  // Fetch booking details with related data
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      dachbox:dachboxes(*),
      renter:users!bookings_user_id_fkey(*),
      landlord:users!bookings_landlord_id_fkey(*)
    `)
    .eq('id', bookingId)
    .single()

  if (error || !booking) {
    console.error('Error fetching booking for email:', error)
    return
  }

  const bookingData = {
    renterName: `${booking.renter.first_name} ${booking.renter.last_name}`,
    landlordName: `${booking.landlord.first_name} ${booking.landlord.last_name}`,
    dachboxTitle: `${booking.dachbox.brand} ${booking.dachbox.model}`,
    dachboxLocation: `${booking.dachbox.pickup_city}, ${booking.dachbox.pickup_postal_code}`,
    startDate: booking.start_date,
    endDate: booking.end_date,
    totalDays: Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24)),
    totalAmount: booking.total_amount,
    landlordEmail: booking.landlord.email,
    landlordPhone: booking.landlord.phone || 'Nicht angegeben',
    renterEmail: booking.renter.email,
    renterPhone: booking.renter.phone || 'Nicht angegeben',
    bookingId: booking.id
  }

  await sendBookingConfirmationEmails(bookingData)
}

async function scheduleReviewReminderForBooking(bookingId: string, supabase: any) {
  // Fetch booking details
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      dachbox:dachboxes(*),
      renter:users!bookings_user_id_fkey(*)
    `)
    .eq('id', bookingId)
    .single()

  if (error || !booking) {
    console.error('Error fetching booking for review reminder:', error)
    return
  }

  await scheduleReviewReminder(bookingId, booking.end_date)
}
