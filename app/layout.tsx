import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Altibbe | Hedamo - Product Transparency Platform',
  description: 'Discover the truth about your products. Get detailed transparency reports through intelligent questioning and make ethical, health-first decisions.',
  keywords: ['product transparency', 'health', 'sustainability', 'ethics', 'consumer awareness'],
  authors: [{ name: 'Altibbe Hedamo Team' }],
  creator: 'Altibbe Hedamo',
  publisher: 'Altibbe Hedamo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://altibbe-hedamo.com',
    title: 'Altibbe | Hedamo - Product Transparency Platform',
    description: 'Discover the truth about your products through intelligent transparency reports.',
    siteName: 'Altibbe Hedamo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Altibbe | Hedamo - Product Transparency Platform',
    description: 'Discover the truth about your products through intelligent transparency reports.',
    creator: '@altibbehe damo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}