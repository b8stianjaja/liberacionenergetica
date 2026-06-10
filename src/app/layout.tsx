import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="es">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}