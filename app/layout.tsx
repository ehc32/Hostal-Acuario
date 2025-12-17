import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "@/components/theme-provider";


export const metadata: Metadata = {
  metadataBase: new URL('https://hostal-acuario.vercel.app'),
  title: {
    default: 'Hostal Acuario - Reserva las Mejores Habitaciones',
    template: '%s | Hostal Acuario'
  },
  description: 'Reserva las mejores habitaciones para tu estadía en Hostal Acuario. Comodidad, ubicación privilegiada y excelente servicio al mejor precio.',
  keywords: ['hostal', 'hotel', 'reservas', 'habitaciones', 'hospedaje', 'alojamiento', 'Acuario'],
  authors: [{ name: 'Hostal Acuario' }],
  creator: 'Hostal Acuario',
  publisher: 'Hostal Acuario',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: 'google6e23b8dbf6f732cf',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://hostal-acuario.vercel.app',
    title: 'Hostal Acuario - Reserva las Mejores Habitaciones',
    description: 'Reserva las mejores habitaciones para tu estadía en Hostal Acuario. Comodidad, ubicación privilegiada y excelente servicio.',
    siteName: 'Hostal Acuario',
    images: [
      {
        url: '/og-image.jpg', // Asegúrate de tener esta imagen en /public
        width: 1200,
        height: 630,
        alt: 'Hostal Acuario',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hostal Acuario - Reserva las Mejores Habitaciones',
    description: 'Reserva las mejores habitaciones para tu estadía en Hostal Acuario.',
    images: ['/og-image.jpg'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className="antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // O "system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <FavoritesProvider>
              {children}
            </FavoritesProvider>
          </AuthProvider>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
