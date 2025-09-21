'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams?.get('payment_intent');

  useEffect(() => {
    // Hier können Sie den Zahlungserfolg an Ihren Server melden
    if (paymentIntent) {
      // Beispiel: Logging oder API-Aufruf
      console.log('Zahlung erfolgreich mit Intent:', paymentIntent);
    }
  }, [paymentIntent]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Zahlungsmethode erfolgreich hinzugefügt!</h1>
        <p className="text-gray-600 mb-6">
          Vielen Dank! Ihre Zahlungsmethode wurde erfolgreich gespeichert und kann nun für zukünftige Zahlungen verwendet werden.
        </p>
        <div className="space-y-3">
          <Link
            href="/account"
            className="block w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Zurück zum Konto
          </Link>
          <Link
            href="/angebote"
            className="block w-full bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Zu den Angeboten
          </Link>
        </div>
      </div>
    </div>
  );
}
