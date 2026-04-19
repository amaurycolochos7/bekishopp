import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

// Convención de archivo de Next.js: este archivo genera la imagen Open Graph
// servida automáticamente en /opengraph-image. Next.js inyecta el meta tag
// <meta property="og:image"> apuntando a una URL limpia (sin query params)
// con un hash de versión — formato que scrapers como WhatsApp/Facebook/iMessage
// procesan de manera más confiable que un endpoint custom.

export const runtime = 'edge';
export const revalidate = 3600;
export const alt = 'Catálogo';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    let titulo = 'Catálogo';
    let subtitulo = '';
    let logoUrl: string | null = null;
    let colorPrimario = '#1a365d';
    let colorSecundario = '#c9a84c';
    let colorFondo = '#faf5eb';

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { auth: { persistSession: false } }
        );
        const { data } = await supabase
            .from('configuracion')
            .select('nombre_negocio, slogan, logo_url, color_primario, color_secundario, color_fondo')
            .limit(1)
            .single();
        if (data) {
            titulo = data.nombre_negocio || titulo;
            subtitulo = data.slogan || subtitulo;
            logoUrl = data.logo_url;
            colorPrimario = data.color_primario || colorPrimario;
            colorSecundario = data.color_secundario || colorSecundario;
            colorFondo = data.color_fondo || colorFondo;
        }
    } catch {
        // Usar valores por defecto
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colorFondo,
                    backgroundImage: `radial-gradient(circle at 20% 20%, ${colorSecundario}33 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${colorPrimario}22 0%, transparent 50%)`,
                    padding: 60,
                    fontFamily: 'sans-serif',
                }}
            >
                {logoUrl && (
                    <div
                        style={{
                            display: 'flex',
                            width: 280,
                            height: 280,
                            borderRadius: 140,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            marginBottom: 40,
                            overflow: 'hidden',
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={logoUrl}
                            alt={titulo}
                            width={240}
                            height={240}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                )}
                <div
                    style={{
                        fontSize: 76,
                        fontWeight: 800,
                        color: colorPrimario,
                        textAlign: 'center',
                        lineHeight: 1.1,
                        letterSpacing: -1,
                    }}
                >
                    {titulo}
                </div>
                {subtitulo && (
                    <div
                        style={{
                            fontSize: 32,
                            color: colorPrimario,
                            opacity: 0.7,
                            textAlign: 'center',
                            marginTop: 24,
                            maxWidth: 900,
                        }}
                    >
                        {subtitulo}
                    </div>
                )}
            </div>
        ),
        { ...size }
    );
}
