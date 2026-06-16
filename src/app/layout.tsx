import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"]
});

// Lato es excelente para la legibilidad en todas las edades
const lato = Lato({ 
  subsets: ["latin"], 
  variable: "--font-lato",
  weight: ["300", "400", "700"]
});

export const metadata: Metadata = {
  title: "Johanna Grandón | Liberación Energética",
  description: "Acompañamiento holístico y sanación energética para todas las edades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${lato.variable}`}>
      <body className="antialiased bg-background text-foreground font-sans selection:bg-gold/20 selection:text-foreground">
        {children}
      </body>
    </html>
  );
}