'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the CheckoutForm to avoid SSR issues with Stripe
const CheckoutForm = dynamic(
  () => import('./CheckoutForm'),
  { ssr: false }
);

// Initialize Stripe outside of the component to avoid recreating the object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentForm() {
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(100); // Default amount in cents

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount / 100 }), // Convert to euros
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
    loader: 'auto',
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Zahlungsmethode hinzufügen</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Betrag (in Euro)
        </label>
        <input
          type="number"
          value={amount / 100}
          onChange={(e) => setAmount(parseFloat(e.target.value) * 100)}
          step="0.01"
          min="0.01"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
