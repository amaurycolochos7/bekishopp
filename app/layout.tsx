import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/public/CartContext";

export const metadata: Metadata = {
  title: "Catálogo de Productos y Servicios",
  description: "Explora nuestro catálogo de productos y servicios de calidad. Contacta directamente por WhatsApp para realizar tus compras.",
  keywords: "catálogo, productos, servicios, WhatsApp, comprar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-white text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
