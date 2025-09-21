'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConnect } from '@/contexts/ConnectContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, CreditCard, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ConnectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    account, 
    loading, 
    error, 
    createAccount, 
    startOnboarding,
    refreshAccount 
  } = useConnect();
  const [isCreating, setIsCreating] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if we're returning from onboarding
  useEffect(() => {
    const accountId = searchParams.get('account_id');
    const onboardingSuccess = searchParams.get('success');

    if (onboardingSuccess && accountId) {
      setSuccess('Successfully connected your Stripe account!');
      // Refresh the account data
      refreshAccount();
      // Clean up the URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('success');
      newUrl.searchParams.delete('account_id');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, refreshAccount]);

  const handleCreateAccount = async () => {
    try {
      setIsCreating(true);
      await createAccount();
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartOnboarding = async () => {
    try {
      setIsOnboarding(true);
      await startOnboarding();
    } finally {
      setIsOnboarding(false);
    }
  };

  // Check if the account is fully onboarded
  const isAccountReady = account?.payouts_enabled && account?.charges_enabled;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Connect with Stripe</h1>
        <p className="text-muted-foreground mt-2">
          Set up payments to start receiving money for your Dachbox rentals
        </p>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Stripe Connect Account</CardTitle>
          <CardDescription>
            Connect your Stripe account to receive payments from your Dachbox rentals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : account ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Account Status</p>
                  <p className="text-sm text-muted-foreground">
                    {isAccountReady 
                      ? 'Your account is fully set up and ready to accept payments!'
                      : 'Your account needs additional information to start accepting payments.'}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${isAccountReady ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm font-medium">
                    {isAccountReady ? 'Active' : 'Setup Required'}
                  </span>
                </div>
              </div>

              {!isAccountReady && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle>Action Required</AlertTitle>
                  <AlertDescription>
                    Complete your account setup to start receiving payments.
                  </AlertDescription>
                </Alert>
              )}

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Account Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Account ID</p>
                    <p className="font-mono text-sm">{account.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payouts</p>
                    <p>{account.payouts_enabled ? 'Enabled' : 'Not Enabled'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Charges</p>
                    <p>{account.charges_enabled ? 'Enabled' : 'Not Enabled'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Country</p>
                    <p>{account.country?.toUpperCase() || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Stripe account connected</h3>
              <p className="text-muted-foreground mb-6">
                Connect your Stripe account to start receiving payments for your Dachbox rentals.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-3">
          {!account ? (
            <Button 
              onClick={handleCreateAccount} 
              disabled={isCreating || loading}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Connect with Stripe'
              )}
            </Button>
          ) : !isAccountReady ? (
            <Button 
              onClick={handleStartOnboarding}
              disabled={isOnboarding || loading}
            >
              {isOnboarding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Complete Account Setup'
              )}
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/dashboard/products">
                <Plus className="mr-2 h-4 w-4" />
                Add Products
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
