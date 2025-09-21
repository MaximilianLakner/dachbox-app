import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

export async function POST(request: Request) {
  try {
    const { 
      accountId, 
      priceId, 
      quantity = 1,
      successUrl,
      cancelUrl 
    } = await request.json();

    if (!accountId || !priceId) {
      return NextResponse.json(
        { error: 'accountId and priceId are required' },
        { status: 400 }
      );
    }

    // Get the price to calculate application fee (10% of the price)
    const price = await stripe.prices.retrieve(priceId, {
      stripeAccount: accountId,
    });

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity,
          },
        ],
        mode: 'payment',
        success_url: successUrl || `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${request.headers.get('origin')}/cancel`,
        payment_intent_data: {
          application_fee_amount: Math.round((price.unit_amount || 0) * 0.1), // 10% platform fee
        },
      },
      {
        stripeAccount: accountId,
      }
    );

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
