import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import MainLayout from '@/components/templates/MainLayout/MainLayout';
import ToastContainer from '@/components/organisms/ToastContainer/ToastContainer';
import JsonLd from '@/components/atoms/JsonLd/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sublilove.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#a97382',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sublilove | Sublimación y Papelería Personalizada',
    template: '%s | Sublilove',
  },
  description:
    'Tienda online de productos personalizados en sublimación y papelería creativa. Tazas, franelas, termos, libretas, agendas 2025, planners, stickers y empaques con tus diseños favoritos.',
  keywords: [
    'sublimación personalizada',
    'papelería creativa',
    'tazas personalizadas',
    'franelas sublimadas',
    'termos personalizados',
    'agendas personalizadas',
    'cuadernos personalizados',
    'stickers personalizados',
    'regalos personalizados',
    'Venezuela sublimación',
    'Sublilove',
  ],
  authors: [{ name: 'Sublilove' }],
  creator: 'Sublilove',
  publisher: 'Sublilove',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: SITE_URL,
    siteName: 'Sublilove',
    title: 'Sublilove | Sublimación y Papelería Personalizada',
    description:
      'Transformamos tus ideas en productos únicos. Sublimación de alta calidad y papelería personalizada para hacer cada momento especial.',
    images: [
      {
        url: '/img/logo.png',
        width: 800,
        height: 800,
        alt: 'Sublilove - Sublimación y Papelería Personalizada',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sublilove | Sublimación y Papelería Personalizada',
    description:
      'Transformamos tus ideas en productos únicos. Sublimación de alta calidad y papelería personalizada.',
    images: ['/img/logo.png'],
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
  icons: {
    icon: [
      { url: '/img/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/img/logo.png',
    apple: '/img/logo.png',
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Sublilove',
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo.png`,
  image: `${SITE_URL}/img/logo.png`,
  description:
    'Sublimación y papelería personalizada de alta calidad. Tazas, camisetas, libretas, agendas y más.',
  telephone: '+584243695379',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'VE',
  },
  sameAs: [
    'https://instagram.com',
    'https://facebook.com',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/img/logo.png" />
        <link rel="shortcut icon" type="image/png" href="/img/logo.png" />
        <link rel="apple-touch-icon" href="/img/logo.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <JsonLd data={organizationSchema} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <CurrencyProvider>
              <ToastProvider>
                <MainLayout>{children}</MainLayout>
                <ToastContainer />
              </ToastProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
