import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID fehlt' },
      { status: 400 }
    );
  }

  try {
    // Session von Stripe abrufen
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items'],
    });

    // Hier könnten Sie die Zahlungsdetails in Ihrer Datenbank speichern
    // und die Buchung als bezahlt markieren
    // z.B. mit session.metadata.dachboxId

    return NextResponse.json({
      status: session.payment_status,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      payment_intent: session.payment_intent,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Fehler bei der Zahlungsverifizierung:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Zahlungsverifizierung' },
      { status: 500 }
    );
  }
}
