'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import dynamic from 'next/dynamic';

// Dynamically import the PaymentForm to avoid SSR issues with Stripe
const PaymentForm = dynamic(
  () => import('@/components/PaymentForm'),
  { ssr: false }
);

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 10 }), // 10€ as default amount
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Zahlungsmethode hinzufügen</h1>
        
        <div className="mb-6">
          <p className="mb-4">
            Fügen Sie eine Zahlungsmethode hinzu, um Zahlungen zu empfangen oder zu tätigen. 
            Ihre Zahlungsdaten werden sicher über Stripe verarbeitet.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">
              <strong>Testkarte:</strong> 4242 4242 4242 4242
              <br />
              <strong>Bel. zuk. Datum</strong> / <strong>Bel. CVC</strong> / <strong>Bel. Postleitzahl</strong>
            </p>
          </div>
        </div>

        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#2563eb',
                  colorBackground: '#ffffff',
                  colorText: '#1f2937',
                },
              },
            }}
          >
            <PaymentForm />
          </Elements>
        )}
      </div>
    </div>
  );
}
