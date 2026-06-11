import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  metadataBase: new URL('https://karmacloset.in'),
  title: 'KarmaCloset — Buy, Sell & Swap Sustainably in India',
  description: 'India\'s first AI-powered sustainable closet. Buy, sell or swap pre-owned, upcycled, and eco-friendly items. Earn Karma points and give your wardrobe a second life.',
  keywords: 'sustainable fashion india, buy sell swap india, pre-owned clothes india, karma closet, eco friendly marketplace',
  openGraph: {
    title: 'KarmaCloset — Sustainable Marketplace for India',
    description: 'Buy, sell or swap pre-owned and eco-friendly items from your closet. Earn Karma with every exchange.',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-16 pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
