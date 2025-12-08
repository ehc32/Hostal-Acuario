import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "@/components/theme-provider";


export const metadata: Metadata = {
  title: "Hotel Acuario",
  description: "Reserva las mejores habitaciones para tu estadía",
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
