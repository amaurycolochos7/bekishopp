import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// Genera la imagen Open Graph (1200x630 PNG) usada en previews de
// WhatsApp / Facebook / Twitter / iMessage, etc.
// Acepta ?logo=<url> como override; si no, lee la configuración de Supabase.
export async function GET(request: NextRequest) {
    const logoParam = request.nextUrl.searchParams.get('logo');

    let logoUrl: string | null = logoParam;
    let titulo = 'Catálogo';
    let subtitulo = '';
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
            if (!logoUrl) logoUrl = data.logo_url;
            colorPrimario = data.color_primario || colorPrimario;
            colorSecundario = data.color_secundario || colorSecundario;
            colorFondo = data.color_fondo || colorFondo;
        }
    } catch {
        // Seguir con valores por defecto
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
                            width: 260,
                            height: 260,
                            borderRadius: 130,
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
                            width={220}
                            height={220}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                )}
                <div
                    style={{
                        fontSize: 72,
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
                            marginTop: 20,
                            maxWidth: 900,
                        }}
                    >
                        {subtitulo}
                    </div>
                )}
            </div>
        ),
        {
            width: 1200,
            height: 630,
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            },
        }
    );
}
