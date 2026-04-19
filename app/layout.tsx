import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/public/CartContext";
import { createClient } from "@/lib/supabase/server";

// URL canónica del sitio. Es CRÍTICO que sea la URL de producción del dominio
// personalizado y NO la URL efímera del deployment de Vercel (ej. *.vercel.app),
// porque WhatsApp/Facebook cachean el preview por og:url.
// - NEXT_PUBLIC_SITE_URL: override manual (recomendado en Vercel)
// - VERCEL_PROJECT_PRODUCTION_URL: dominio de producción del proyecto
//   (distinto a VERCEL_URL que siempre es el deployment específico)
// - Fallback: dominio conocido del negocio
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://www.bekystore.shop');

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

  // NOTA: og:image y twitter:image los maneja Next.js automáticamente vía
  // la convención de archivo app/opengraph-image.tsx (URL limpia, versionada,
  // mejor compatibilidad con scrapers de WhatsApp/Facebook/iMessage).

  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: "catálogo, productos, servicios, WhatsApp, comprar",
    openGraph: {
      title,
      description,
      type: "website",
      siteName: title,
      url: SITE_URL,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
