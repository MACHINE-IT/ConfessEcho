import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers'
import { Navigation } from '@/components/Navigation'
import { Toaster } from '@/components/ui/sonner'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConfessEcho - Anonymous Confessions",
  description: "Share your thoughts anonymously and get support from the community",
  keywords: ['confession', 'anonymous', 'support', 'community', 'confessecho'],
  authors: [{ name: 'ConfessEcho Team' }],
  creator: 'ConfessEcho',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://confessly.vercel.app',
    title: 'Confessly - Anonymous Confessions',
    description: 'Share your thoughts anonymously and get support from the community',
    siteName: 'Confessly',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Confessly - Anonymous Confessions',
    description: 'Share your thoughts anonymously and get support from the community',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
