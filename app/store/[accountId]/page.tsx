'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  default_price: {
    id: string;
    unit_amount: number;
    currency: string;
  } | null;
}

export default function StorePage() {
  const { accountId } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!accountId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/connect/products?accountId=${accountId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. The store might be unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [accountId]);

  const handlePurchase = async (product: Product) => {
    if (!product.default_price) {
      setError('This product is not available for purchase');
      return;
    }

    try {
      setPurchasing(prev => ({ ...prev, [product.id]: true }));
      
      const response = await fetch('/api/connect/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          priceId: product.default_price.id,
          successUrl: `${window.location.origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate checkout');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      const { error: stripeError } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (err: any) {
      console.error('Error during checkout:', err);
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setPurchasing(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading store...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Products Available</h1>
        <p className="text-muted-foreground mb-6">This store doesn't have any products listed yet.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Available Rentals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              {product.description && (
                <CardDescription>{product.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">No image</div>
                )}
              </div>
              
              {product.default_price && (
                <div className="text-2xl font-bold mt-4">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: product.default_price.currency || 'USD',
                  }).format((product.default_price.unit_amount || 0) / 100)}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    per day
                  </span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePurchase(product)}
                disabled={purchasing[product.id] || !product.default_price}
              >
                {purchasing[product.id] ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.default_price ? 'Rent Now' : 'Not Available'}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Load Stripe.js asynchronously
let stripePromise: any;
const loadStripe = async () => {
  if (!stripePromise) {
    stripePromise = (await import('@stripe/stripe-js')).loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};
