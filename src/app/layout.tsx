import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { ToastProvider } from '@/context/ToastContext';
import MainLayout from '@/components/templates/MainLayout/MainLayout';
import ToastContainer from '@/components/organisms/ToastContainer/ToastContainer';

export const metadata: Metadata = {
  title: 'Sublilove',
  description:
    'Sublimación y Papelería personalizada. Tazas, camisetas, cuadernos, agendas y más con tus diseños favoritos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          <CurrencyProvider>
            <ToastProvider>
              <MainLayout>{children}</MainLayout>
              <ToastContainer />
            </ToastProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
