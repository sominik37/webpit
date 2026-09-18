import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://webpit.site'),
  title: {
    default: 'WebPit Blog',
    template: '%s',
  },
  description:
    'Learn about image optimization, web performance, and the latest news from the WebPit ecosystem.',
  icons: {
    icon: [{ url: '/fav.webp', type: 'image/webp' }],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WebPit',
  url: 'https://webpit.site/',
  logo: 'https://webpit.site/logo.webp',
  sameAs: [
    'https://x.com/sominik37',
    'https://www.linkedin.com/in/usmanhyder37/',
    'https://www.reddit.com/user/stark37/',
    'https://www.producthunt.com/products/webpit',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Header />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-86TZ4T7C8W"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-86TZ4T7C8W');
          `}
        </Script>
        <SpeedInsights />
      </body>
    </html>
  );
}
