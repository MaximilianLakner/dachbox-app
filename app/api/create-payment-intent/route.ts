import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

export async function POST(request: Request) {
  try {
    const { amount, currency = 'eur', userId, dachboxId } = await request.json();

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Dachbox Miete',
              description: 'Miete für Dachbox',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      client_reference_id: userId,
      metadata: {
        dachboxId,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
