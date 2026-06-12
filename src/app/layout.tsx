import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"], 
  style: ["normal", "italic"], 
  display: "swap",
  variable: "--font-cormorant", 
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600"], 
  display: "swap",
  variable: "--font-montserrat", 
});

export const metadata: Metadata = {
  title: "Liberación Energética | Catálogo",
  description: "Terapias y herramientas para restaurar tu armonía interior.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${montserrat.variable}`}>
      {/* Aplicamos la fuente base (Montserrat) directamente al body */}
      <body className="antialiased bg-[#FAFAFB] text-zinc-900 font-sans">
        {children}
      </body>
    </html>
  );
}