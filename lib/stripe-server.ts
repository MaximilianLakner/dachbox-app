import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-08-27.basil',
});

// Erstellt ein Stripe Connect Express-Konto für einen Anbieter
export async function createConnectAccount(email: string) {
  return await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      transfers: { requested: true },
    },
	});

// Erstellt einen PaymentIntent für eine Buchung mit Plattformgebühr und Auszahlung an Anbieter
export async function createPaymentIntent(
  amount: number,
  currency: string,
  landlordStripeAccountId: string,
  metadata: Record<string, any>
) {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['card'],
    application_fee_amount: Math.round(amount * 0.1), // 10% Plattformgebühr
    transfer_data: {
      destination: landlordStripeAccountId,
    },
    metadata,
  });
}

// Erstellt einen Stripe Customer
export async function createCustomer(email: string, name: string, phone?: string) {
  return await stripe.customers.create({
    email,
    name,
    phone,
  });
}

// Erstellt einen Onboarding-Link für das Stripe-Konto
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });
}
