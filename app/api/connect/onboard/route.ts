import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

export async function POST(request: Request) {
  const { accountId } = await request.json();

  if (!accountId) {
    return NextResponse.json(
      { error: 'accountId is required' },
      { status: 400 }
    );
  }

  try {
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/dashboard/connect?account_id=${accountId}`,
      return_url: `${origin}/dashboard/connect/success?account_id=${accountId}`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Error creating account link:', error);
    return NextResponse.json(
      { error: 'Failed to create onboarding link' },
      { status: 500 }
    );
  }
}
