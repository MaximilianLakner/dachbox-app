'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    // In a real app, you would verify the purchase with your backend
    // For this example, we'll just show a success message
    const timer = setTimeout(() => {
      setLoading(false);
      setOrder({
        id: `ORD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        date: new Date().toLocaleDateString(),
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Verifying your purchase...</p>
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
          <Button asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="mt-4">Thank you for your order!</CardTitle>
            <CardDescription>
              Your order has been received and is being processed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Order Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Order Number</div>
                  <div className="font-medium">{order?.id}</div>
                  <div className="text-muted-foreground">Date</div>
                  <div>{order?.date}</div>
                  <div className="text-muted-foreground">Payment Status</div>
                  <div className="text-green-600 font-medium">Paid</div>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800">What's next?</AlertTitle>
                <AlertDescription className="text-blue-700">
                  We've sent you a confirmation email with your order details. Our team will contact you shortly to arrange the pickup of your rental.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/store">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
