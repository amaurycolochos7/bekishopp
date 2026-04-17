import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/public/CartContext";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  let title = "Catálogo de Productos y Servicios";
  let description = "Explora nuestro catálogo de productos y servicios de calidad. Contacta directamente por WhatsApp para realizar tus compras.";
  let logoUrl: string | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('configuracion')
      .select('nombre_negocio, slogan, logo_url')
      .limit(1)
      .single();

    if (data) {
      title = data.nombre_negocio || title;
      description = data.slogan || description;
      logoUrl = data.logo_url;
    }
  } catch {
    // Usar valores por defecto si falla
  }

  const metadata: Metadata = {
    title,
    description,
    keywords: "catálogo, productos, servicios, WhatsApp, comprar",
    openGraph: {
      title,
      description,
      type: "website",
      siteName: title,
      ...(logoUrl && {
        images: [
          {
            url: logoUrl,
            width: 512,
            height: 512,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary",
      title,
      description,
      ...(logoUrl && {
        images: [logoUrl],
      }),
    },
    ...(logoUrl && {
      icons: {
        icon: `/api/favicon?url=${encodeURIComponent(logoUrl)}`,
        apple: `/api/favicon?url=${encodeURIComponent(logoUrl)}`,
      },
    }),
  };

  return metadata;
}

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
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  where: {
                    and: [
                      { href_matches: "/*" },
                      { not: { href_matches: "/logout" } },
                      { not: { selector_matches: "[rel~=nofollow]" } },
                      { not: { selector_matches: "[data-no-prerender]" } }
                    ]
                  },
                  eagerness: "moderate"
                }
              ]
            })
          }}
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
