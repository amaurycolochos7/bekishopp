import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
        // Devolver un favicon vacío si no hay URL
        return new NextResponse(null, { status: 404 });
    }

    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 }, // Cache por 1 hora
        });

        if (!response.ok) {
            return new NextResponse(null, { status: 404 });
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/png';

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch {
        return new NextResponse(null, { status: 404 });
    }
}
