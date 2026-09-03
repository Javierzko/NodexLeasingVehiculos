import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers';

export const metadata: Metadata = {
  title: 'Sistema de Gestión de Leasing Vehicular',
  description: 'Aplicación de gestión y control unificado de expedientes de leasing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-slate-100 min-h-screen text-slate-900 antialiased font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}