import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createPaymentIntent, createCustomer } from '@/lib/stripe-server'
import { calculatePlatformFee, calculateLandlordEarnings } from '@/lib/stripe-client'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Session check - Session exists:', !!session, 'Error:', sessionError)
    
    if (sessionError || !session?.user) {
      console.log('Session authentication failed:', sessionError)
      return NextResponse.json({ error: `Unauthorized: ${sessionError?.message || 'No session found'}` }, { status: 401 })
    }
    
    const user = session.user

    const body = await request.json()
    const { dachbox_id, start_date, end_date, total_days, price_per_day } = body

    // Validate input
    if (!dachbox_id || !start_date || !end_date || !total_days || !price_per_day) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get DachBox and landlord info
    const { data: dachbox, error: dachboxError } = await supabase
      .from('dachboxes')
      .select(`
        *,
        users!dachboxes_user_id_fkey (
          id,
          email,
          first_name,
          last_name,
          stripe_connect_account_id,
          stripe_onboarding_completed
        )
      `)
      .eq('id', dachbox_id)
      .single()

    if (dachboxError || !dachbox) {
      return NextResponse.json({ error: 'DachBox not found' }, { status: 404 })
    }

    const landlord = dachbox.users
    if (!landlord.stripe_connect_account_id || !landlord.stripe_onboarding_completed) {
      return NextResponse.json({ 
        error: 'Landlord has not completed Stripe onboarding' 
      }, { status: 400 })
    }

    // Get renter info
    const { data: renter, error: renterError } = await supabase
      .from('users')
      .select('email, first_name, last_name, phone, stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (renterError || !renter) {
      return NextResponse.json({ error: 'Renter not found' }, { status: 404 })
    }

    // Create Stripe customer if doesn't exist
    let customerId = renter.stripe_customer_id
    if (!customerId) {
      const customer = await createCustomer(
        renter.email,
        `${renter.first_name} ${renter.last_name}`,
        renter.phone
      )
      customerId = customer.id

      // Save customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Calculate amounts
    const totalAmount = total_days * price_per_day * 100 // Convert to cents
    const platformFee = calculatePlatformFee(totalAmount)
    const landlordEarnings = calculateLandlordEarnings(totalAmount)

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        dachbox_id,
        renter_id: user.id,
        landlord_id: landlord.id,
        start_date,
        end_date,
        total_days,
        price_per_day: price_per_day * 100, // Convert to cents
        total_amount: totalAmount,
        platform_fee: platformFee,
        landlord_earnings: landlordEarnings,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (bookingError || !booking) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      totalAmount,
      'eur',
      landlord.stripe_connect_account_id,
      {
        booking_id: booking.id,
        dachbox_id,
        renter_id: user.id,
        landlord_id: landlord.id,
        rental_period: `${start_date} to ${end_date}`
      }
    )

    // Update booking with payment intent ID
    await supabase
      .from('bookings')
      .update({ 
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: 'processing'
      })
      .eq('id', booking.id)

    // Create payment record
    await supabase
      .from('payments')
      .insert({
        booking_id: booking.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: totalAmount,
        currency: 'eur',
        status: 'pending'
      })

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      booking_id: booking.id,
      total_amount: totalAmount,
      platform_fee: platformFee,
      landlord_earnings: landlordEarnings
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ 
      error: 'Failed to create payment intent' 
    }, { status: 500 })
  }
}
