import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"]
});

const lato = Lato({ 
  subsets: ["latin"], 
  variable: "--font-lato",
  weight: ["300", "400", "700"]
});

export const metadata: Metadata = {
  title: "Johanna Grandón | Liberación Energética",
  description: "Terapias Holísticas, Radiestesia y Biodecodificación Emocional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${lato.variable}`}>
      <body className="antialiased bg-background text-foreground font-sans selection:bg-lavender selection:text-foreground">
        {children}
      </body>
    </html>
  );
}