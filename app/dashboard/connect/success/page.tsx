'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConnect } from '@/contexts/ConnectContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshAccount } = useConnect();
  const accountId = searchParams.get('account_id');

  useEffect(() => {
    if (accountId) {
      // Refresh the account data to get the latest status
      refreshAccount();
    } else {
      // If no account ID is provided, redirect to the connect page
      router.push('/dashboard/connect');
    }
  }, [accountId, refreshAccount, router]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="bg-green-50 border border-green-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Account Connected Successfully!</h1>
      
      <p className="text-muted-foreground mb-8">
        Your Stripe account has been successfully connected. You can now start receiving payments for your Dachbox rentals.
      </p>

      <div className="space-y-4 max-w-md mx-auto">
        <Alert className="text-left">
          <AlertTitle className="font-medium">What's next?</AlertTitle>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>Add your products or services</li>
            <li>Set up your payout schedule</li>
            <li>Start accepting payments</li>
          </ul>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button onClick={() => router.push('/dashboard/products')}>
            Add Your First Product
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
