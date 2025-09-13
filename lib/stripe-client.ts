import { loadStripe } from '@stripe/stripe-js'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
}

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

// Helper function to format currency
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount / 100)
}

// Calculate platform fee
export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * 0.10) // 10% platform fee
}

// Calculate landlord earnings
export function calculateLandlordEarnings(amount: number): number {
  return amount - calculatePlatformFee(amount)
}
