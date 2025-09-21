'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setError('Keine Sitzungs-ID gefunden');
        return;
      }

      try {
        // Hier würden Sie die Zahlung mit Ihrem Backend verifizieren
        // Zum Beispiel durch einen API-Aufruf, der die Session bei Stripe verifiziert
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Zahlungsverifizierung fehlgeschlagen');
        }

        const data = await response.json();
        
        if (data.status === 'paid') {
          setStatus('success');
          // Hier könnten Sie weitere Aktionen durchführen, z.B. eine Buchung bestätigen
        } else {
          setStatus('error');
          setError('Zahlung konnte nicht bestätigt werden');
        }
      } catch (err) {
        console.error('Fehler bei der Zahlungsverifizierung:', err);
        setStatus('error');
        setError('Ein Fehler ist aufgetreten. Bitte überprüfen Sie Ihre E-Mails oder kontaktieren Sie den Support.');
      }
    };

    verifyPayment();
  }, [sessionId]);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Überprüfe Zahlung...</h2>
          <p className="text-gray-600">Bitte warten Sie, während wir Ihre Zahlung überprüfen.</p>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Zahlung fehlgeschlagen</h2>
          <p className="text-gray-600 mb-6">{error || 'Es gab ein Problem mit Ihrer Zahlung.'}</p>
          <div className="space-y-3">
            <Link
              href="/account"
              className="block w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Zum Konto
            </Link>
            <Link
              href="/support"
              className="block w-full bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              Support kontaktieren
            </Link>
          </div>
        </div>
      );
    }

    // Success state
    return (
      <>
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Zahlung erfolgreich!</h1>
        <p className="text-gray-600 mb-6">
          Vielen Dank für Ihre Zahlung. Ihre Buchung wurde bestätigt und Sie erhalten in Kürze eine Bestätigungs-E-Mail.
        </p>
        <div className="space-y-3">
          <Link
            href="/account/bookings"
            className="block w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Meine Buchungen anzeigen
          </Link>
          <Link
            href="/angebote"
            className="block w-full bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Weitere Angebote entdecken
          </Link>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
}
