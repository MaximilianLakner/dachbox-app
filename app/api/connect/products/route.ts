import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

// Create a new product for a connected account
export async function POST(request: Request) {
  try {
    const { 
      accountId, 
      name, 
      description, 
      price, 
      currency = 'eur' 
    } = await request.json();

    if (!accountId || !name || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await stripe.products.create(
      {
        name,
        description,
        default_price_data: {
          currency,
          unit_amount: Math.round(price * 100), // Convert to cents
          recurring: null, // One-time payment
        },
      },
      {
        stripeAccount: accountId,
      }
    );

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// List products for a connected account
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('accountId');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!accountId) {
    return NextResponse.json(
      { error: 'accountId is required' },
      { status: 400 }
    );
  }

  try {
    const products = await stripe.products.list(
      {
        limit,
        active: true,
        expand: ['data.default_price'],
      },
      {
        stripeAccount: accountId,
      }
    );

    return NextResponse.json({ products: products.data });
  } catch (error) {
    console.error('Error listing products:', error);
    return NextResponse.json(
      { error: 'Failed to list products' },
      { status: 500 }
    );
  }
}
