import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function StripeConnectSetup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/create-connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id, email: user?.email }),
      });
      const data = await res.json();
      if (data.onboarding_url) {
        setOnboardingUrl(data.onboarding_url);
        window.location.href = data.onboarding_url;
      } else {
        setError('Fehler beim Erstellen des Stripe-Kontos.');
      }
    } catch (err) {
      setError('Fehler beim Verbinden mit Stripe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleConnect} disabled={loading} style={{padding: '10px 20px', background: '#635bff', color: 'white', borderRadius: 6, border: 'none', fontWeight: 600}}>
        {loading ? 'Weiterleitung...' : 'Stripe Onboarding starten'}
      </button>
      {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
    </div>
  );
}
