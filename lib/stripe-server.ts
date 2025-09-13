import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Platform fee percentage (10%)
export const PLATFORM_FEE_PERCENTAGE = 0.10

// Create Stripe Connect account for landlords
export async function createConnectAccount(email: string, country: string = 'DE') {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    })
    
    return account
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    throw error
  }
}

// Create account link for onboarding
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })
    
    return accountLink
  } catch (error) {
    console.error('Error creating account link:', error)
    throw error
  }
}

// Check if account is fully onboarded
export async function checkAccountStatus(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId)
    
    return {
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      requirements: account.requirements,
    }
  } catch (error) {
    console.error('Error checking account status:', error)
    throw error
  }
}

// Create payment intent with platform fee
export async function createPaymentIntent(
  amount: number, // in cents
  currency: string = 'eur',
  connectedAccountId: string,
  metadata: Record<string, string> = {}
) {
  try {
    const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE)
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: connectedAccountId,
      },
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })
    
    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

// Create customer for recurring payments
export async function createCustomer(email: string, name?: string, phone?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      phone,
    })
    
    return customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}
