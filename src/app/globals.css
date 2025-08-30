// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sarah & James Wedding',
  description: 'Join us in celebrating our love on September 15th, 2024 at Vineyard Estate, Napa Valley',
  keywords: ['wedding', 'invitation', 'Sarah', 'James', 'Napa Valley', 'celebration'],
  authors: [{ name: 'Sarah & James' }],
  openGraph: {
    title: 'Sarah & James Wedding',
    description: 'Join us in celebrating our love on September 15th, 2024',
    type: 'website',
    url: 'https://your-wedding-site.vercel.app',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Sarah & James Wedding',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarah & James Wedding',
    description: 'Join us in celebrating our love on September 15th, 2024',
    images: ['/images/hero-bg.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#f43f5e" />
        
        {/* Prevent zoom on iOS */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-rose-50 via-white to-pink-50 min-h-screen">
        {/* Skip to main content for accessibility */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-rose-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
        
        <main id="main">
          {children}
        </main>
        
        {/* Analytics (add your tracking ID if needed) */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics or other analytics can go here */}
          </>
        )}
      </body>
    </html>
  );
}