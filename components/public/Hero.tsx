import type { Configuracion } from '@/lib/types';

interface HeroProps {
    config: Configuracion | null;
}

export default function Hero({ config }: HeroProps) {
    const titulo = config?.hero_titulo || 'Tu Selección de Calidad.';
    const subtitulo = config?.hero_subtitulo || 'Productos y Servicios de Origen Familiar.';
    const botonTexto = config?.hero_boton_texto || 'Explorar Catálogo';
    const botonSecundario = config?.hero_boton_secundario_texto || 'Contáctanos';
    const heroImagen = config?.hero_imagen_url;
    const stats = config?.stats || [
        { valor: '100+', etiqueta: 'Productos' },
        { valor: '500+', etiqueta: 'Clientes felices' },
        { valor: '24/7', etiqueta: 'WhatsApp' },
    ];
    const colorPrimario = config?.color_primario || '#1a365d';
    const colorAccento = config?.color_acento || '#e8a020';
    const colorFondo = config?.color_fondo || '#faf5eb';
    const heroPos = config?.hero_imagen_posicion || 'center center';

    // Si hay imagen, usar como background con overlay
    if (heroImagen) {
        return (
            <section
                id="inicio"
                className="relative overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center"
            >
                {/* Imagen de fondo */}
                <div
                    className="absolute inset-0 bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: `url(${heroImagen})`,
                        backgroundPosition: heroPos,
                    }}
                />
                {/* Overlay oscuro para legibilidad */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Contenido centrado sobre la imagen */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 w-full">
                    <div className="max-w-2xl mx-auto text-center">
                        {/* Título principal */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-white drop-shadow-lg">
                            {titulo.split('.')[0]}
                            {titulo.includes('.') && (
                                <span style={{ color: colorAccento }}>.</span>
                            )}
                        </h1>

                        {/* Subtítulo */}
                        <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed max-w-xl mx-auto drop-shadow">
                            {subtitulo}
                        </p>

                        {/* Botones */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                            <a
                                href="/catalogo"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                                style={{ backgroundColor: colorAccento }}
                            >
                                {botonTexto}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                            <a
                                href="/contacto"
                                className="inline-flex items-center px-6 py-3.5 rounded-full font-semibold text-sm border-2 transition-all hover:-translate-y-0.5 text-white border-white/60 hover:bg-white/10"
                            >
                                {botonSecundario}
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-8 md:gap-10">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-2xl md:text-3xl font-extrabold text-white drop-shadow">
                                        {stat.valor}
                                    </p>
                                    <p className="text-xs text-white/60 italic">{stat.etiqueta}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Sin imagen: diseño original con color de fondo
    return (
        <section
            id="inicio"
            className="relative overflow-hidden"
            style={{ backgroundColor: colorFondo }}
        >
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 lg:py-24">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Título principal */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4" style={{ color: colorPrimario }}>
                        {titulo.split('.')[0]}
                        {titulo.includes('.') && (
                            <span style={{ color: colorAccento }}>.</span>
                        )}
                    </h1>

                    {/* Subtítulo */}
                    <p className="text-base md:text-lg text-gray-500 mb-8 leading-relaxed max-w-xl mx-auto">
                        {subtitulo}
                    </p>

                    {/* Botones */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                        <a
                            href="/catalogo"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                            style={{ backgroundColor: colorAccento }}
                        >
                            {botonTexto}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                        <a
                            href="/contacto"
                            className="inline-flex items-center px-6 py-3.5 rounded-full font-semibold text-sm border-2 transition-all hover:-translate-y-0.5"
                            style={{ borderColor: colorPrimario, color: colorPrimario }}
                        >
                            {botonSecundario}
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-8 md:gap-10">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-2xl md:text-3xl font-extrabold" style={{ color: colorPrimario }}>
                                    {stat.valor}
                                </p>
                                <p className="text-xs text-gray-400 italic">{stat.etiqueta}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decoración sutil en el fondo */}
            <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2"
                style={{ backgroundColor: colorAccento }}
            />
        </section>
    );
}
