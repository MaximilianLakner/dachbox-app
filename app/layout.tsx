import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConnectProvider } from '@/contexts/ConnectContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DachBox - Vermiete deine Dachbox oder finde eine passende',
  description: 'Vermiete deine Dachbox und verdiene Geld oder finde die perfekte Dachbox für deinen nächsten Urlaub. Einfach, sicher und günstig.',
  keywords: 'Dachbox, Vermietung, Miete, Dachträger, Urlaub, Reise',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <AuthProvider>
          <ConnectProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" />
          </ConnectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
