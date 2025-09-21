'use client';

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
  onSuccess?: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Zahlung erfolgreich!');
          break;
        case 'processing':
          setMessage('Ihre Zahlung wird verarbeitet.');
          break;
        case 'requires_payment_method':
          setMessage('Ihre Zahlung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.');
          break;
        default:
          setMessage('Etwas ist schiefgelaufen.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/account/payment/success`,
        },
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message || 'Ein Fehler ist aufgetreten');
        } else {
          setErrorMessage('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        }
      } else {
        // Call the success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        // Optionally redirect to success page
        router.push('/account/payment/success');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('Ein Fehler ist bei der Zahlungsabwicklung aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message ? (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <PaymentElement 
              options={{
                layout: 'tabs',
                fields: {
                  billingDetails: 'auto',
                },
              }}
            />
          </div>
          
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!stripe || isLoading}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                !stripe || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Wird verarbeitet...' : 'Zahlungsmethode speichern'}
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-4">
            <p>Ihre Zahlungsdaten werden sicher über Stripe verarbeitet und niemals auf unseren Servern gespeichert.</p>
          </div>
        </form>
      )}
    </div>
  );
}
