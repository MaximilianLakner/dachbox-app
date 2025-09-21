import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }

    // Create a new connected account
    const account = await stripe.accounts.create({
      controller: {
        fees: {
          payer: 'account' as const,
        },
        losses: {
          payments: 'stripe' as const,
        },
        stripe_dashboard: {
          type: 'full' as const,
        },
      },
      // Add basic business information
      business_type: 'individual',
      business_profile: {
        mcc: '5734', // Computer Software Stores
        url: 'https://dachbox.app',
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    return NextResponse.json({ accountId: account.id });
  } catch (error) {
    console.error('Error creating connected account:', error);
    return NextResponse.json(
      { error: 'Failed to create connected account' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('accountId');

  if (!accountId) {
    return NextResponse.json(
      { error: 'accountId is required' },
      { status: 400 }
    );
  }

  try {
    const account = await stripe.accounts.retrieve(accountId);
    return NextResponse.json(account);
  } catch (error) {
    console.error('Error retrieving connected account:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve connected account' },
      { status: 500 }
    );
  }
}
