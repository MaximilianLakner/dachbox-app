import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { checkAccountStatus } from '@/lib/stripe-server'

export async function GET(request: NextRequest) {
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

    // Get user's Stripe Connect account ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_connect_account_id, stripe_onboarding_completed')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!userData.stripe_connect_account_id) {
      return NextResponse.json({ 
        has_account: false,
        onboarding_completed: false 
      })
    }

    // Check account status with Stripe
    const accountStatus = await checkAccountStatus(userData.stripe_connect_account_id)

    // Update onboarding status if completed
    if (accountStatus.charges_enabled && accountStatus.payouts_enabled && !userData.stripe_onboarding_completed) {
      await supabase
        .from('users')
        .update({ stripe_onboarding_completed: true })
        .eq('id', user.id)
    }

    return NextResponse.json({
      has_account: true,
      account_id: userData.stripe_connect_account_id,
      onboarding_completed: accountStatus.charges_enabled && accountStatus.payouts_enabled,
      ...accountStatus
    })

  } catch (error) {
    console.error('Error checking Stripe Connect status:', error)
    return NextResponse.json({ 
      error: 'Failed to check account status' 
    }, { status: 500 })
  }
}
