/**
 * Convierte cualquier URL/texto de Google Maps a formato embed para iframe.
 * Acepta:
 * - URLs de embed (google.com/maps/embed) → se usan tal cual
 * - URLs completas de Google Maps con coordenadas (@lat,lng) → extrae coords
 * - Links cortos (maps.app.goo.gl/...) → usa como query de búsqueda
 * - Direcciones/texto libre → usa como query de búsqueda
 */
export function getMapEmbedUrl(input: string): string {
    if (!input?.trim()) return '';

    const trimmed = input.trim();

    // Ya es una URL de embed — usar tal cual
    if (trimmed.includes('/maps/embed') || trimmed.includes('output=embed')) {
        return trimmed;
    }

    // Es una URL que contiene coordenadas (@lat,lng)
    if (trimmed.startsWith('http')) {
        const coordMatch = trimmed.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (coordMatch) {
            return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed&z=16`;
        }
        // URL sin coordenadas (short link u otra) — intentar como búsqueda
        return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
    }

    // Texto libre (dirección o nombre de lugar) — búsqueda directa
    return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
}
