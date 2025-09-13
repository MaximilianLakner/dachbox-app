// Stripe-related TypeScript types

export interface StripeConnectAccount {
  id: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
  requirements?: {
    currently_due: string[]
    eventually_due: string[]
    past_due: string[]
    pending_verification: string[]
  }
}

export interface BookingData {
  id: string
  created_at: string
  updated_at: string
  dachbox_id: string
  renter_id: string
  landlord_id: string
  start_date: string
  end_date: string
  total_days: number
  price_per_day: number
  total_amount: number
  platform_fee: number
  landlord_earnings: number
  stripe_payment_intent_id?: string
  stripe_charge_id?: string
  payment_status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'canceled'
  contact_shared_at?: string
  review_reminder_sent: boolean
  metadata?: Record<string, any>
}

export interface PaymentData {
  id: string
  created_at: string
  booking_id: string
  stripe_payment_intent_id: string
  stripe_charge_id?: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  stripe_metadata?: Record<string, any>
}

export interface EmailLog {
  id: string
  created_at: string
  recipient_email: string
  email_type: 'booking_confirmation' | 'review_reminder' | 'payment_confirmation'
  booking_id?: string
  user_id: string
  sent_at?: string
  status: 'pending' | 'sent' | 'failed'
  subject?: string
  template_data?: Record<string, any>
}

export interface BookingRequest {
  dachbox_id: string
  start_date: string
  end_date: string
  total_days: number
  price_per_day: number
}

export interface PaymentIntentResponse {
  client_secret: string
  payment_intent_id: string
  total_amount: number
  platform_fee: number
  landlord_earnings: number
}
