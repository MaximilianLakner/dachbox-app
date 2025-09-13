import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createConnectAccount, createAccountLink } from '@/lib/stripe-server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, email } = body
    
    // Validate input
    if (!user_id || !email) {
      return NextResponse.json({ error: 'Missing user_id or email' }, { status: 400 })
    }

    // Check if user already has a Connect account
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_connect_account_id')
      .eq('id', user_id)
      .single()

    if (userError) {
      console.error('Error fetching user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userData.stripe_connect_account_id) {
      // Create new account link for existing account
      const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account?setup=refresh`
      const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account?setup=complete`
      
      const accountLink = await createAccountLink(userData.stripe_connect_account_id, refreshUrl, returnUrl)
      
      return NextResponse.json({
        account_id: userData.stripe_connect_account_id,
        onboarding_url: accountLink.url
      })
    }

    // Create new Stripe Connect account
    const account = await createConnectAccount(email)

    // Save account ID to database
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        stripe_connect_account_id: account.id,
        stripe_onboarding_completed: false
      })
      .eq('id', user_id)

    if (updateError) {
      console.error('Error updating user with Stripe account:', updateError)
      return NextResponse.json({ error: 'Failed to save account' }, { status: 500 })
    }

    // Create account link for onboarding
    const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account?setup=refresh`
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account?setup=complete`
    
    const accountLink = await createAccountLink(account.id, refreshUrl, returnUrl)

    return NextResponse.json({
      account_id: account.id,
      onboarding_url: accountLink.url
    })

  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    return NextResponse.json({ 
      error: 'Failed to create Stripe Connect account' 
    }, { status: 500 })
  }
}
