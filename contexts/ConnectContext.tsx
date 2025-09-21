'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface ConnectContextType {
  account: any;
  loading: boolean;
  error: string | null;
  createAccount: () => Promise<void>;
  startOnboarding: () => Promise<void>;
  refreshAccount: () => Promise<void>;
}

const ConnectContext = createContext<ConnectContextType | undefined>(undefined);

export function ConnectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // In a real app, you would fetch the connected account ID from your database
      // For this example, we'll use localStorage
      const accountId = localStorage.getItem(`stripe_account_${user.id}`);
      
      if (accountId) {
        const response = await fetch(`/api/connect/accounts?accountId=${accountId}`);
        if (response.ok) {
          const data = await response.json();
          setAccount(data);
        } else {
          // If the account doesn't exist or there's an error, clear the stored ID
          localStorage.removeItem(`stripe_account_${user.id}`);
          setAccount(null);
        }
      }
    } catch (err) {
      console.error('Error fetching account:', err);
      setError('Failed to load account information');
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/connect/accounts', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to create account');
      }
      
      const { accountId } = await response.json();
      
      // Store the account ID for this user
      if (user?.id) {
        localStorage.setItem(`stripe_account_${user.id}`, accountId);
      }
      
      // Refresh the account data
      await fetchAccount();
      
      // Start the onboarding process
      await startOnboarding();
      
    } catch (err) {
      console.error('Error creating account:', err);
      setError('Failed to create Stripe account');
      setLoading(false);
    }
  };

  const startOnboarding = async () => {
    if (!account?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/connect/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: account.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start onboarding');
      }
      
      const { url } = await response.json();
      
      // Redirect to Stripe onboarding
      window.location.href = url;
      
    } catch (err) {
      console.error('Error starting onboarding:', err);
      setError('Failed to start onboarding process');
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAccount();
  }, [user?.id]);

  return (
    <ConnectContext.Provider
      value={{
        account,
        loading,
        error,
        createAccount,
        startOnboarding,
        refreshAccount: fetchAccount,
      }}
    >
      {children}
    </ConnectContext.Provider>
  );
}

export function useConnect() {
  const context = useContext(ConnectContext);
  if (context === undefined) {
    throw new Error('useConnect must be used within a ConnectProvider');
  }
  return context;
}
