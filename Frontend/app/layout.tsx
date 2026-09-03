// src/app/layout.tsx
import './globals.css';
import Providers from './providers'; // Importación local directa al archivo de al lado
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Sistema de Gestión de Leasing Vehicular',
  description: 'Aplicación de gestión y control unificado de expedientes de leasing',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-slate-100 min-h-screen w-full text-slate-900 antialiased font-sans m-0 p-0">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}