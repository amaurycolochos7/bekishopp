import type { Configuracion } from '@/lib/types';

interface HeroProps {
    config: Configuracion | null;
}

export default function Hero({ config }: HeroProps) {
    const titulo = config?.hero_titulo || 'Tu Selección de Calidad.';
    const subtitulo = config?.hero_subtitulo || 'Productos y Servicios de Origen Familiar.';
    const badge = config?.hero_badge || '● Catálogo disponible';
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

    return (
        <section
            id="inicio"
            className="relative overflow-hidden"
            style={{ backgroundColor: colorFondo }}
        >
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 lg:py-24">
                <div className={`grid grid-cols-1 ${heroImagen ? 'lg:grid-cols-2' : ''} gap-8 lg:gap-12 items-center`}>
                    {/* Columna de texto */}
                    <div className={heroImagen ? 'order-2 lg:order-1' : 'max-w-2xl mx-auto text-center'}>


                        {/* Título principal */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4" style={{ color: colorPrimario }}>
                            {titulo.split('.')[0]}
                            {titulo.includes('.') && (
                                <span style={{ color: colorAccento }}>.</span>
                            )}
                        </h1>

                        {/* Subtítulo */}
                        <p className={`text-base md:text-lg text-gray-500 mb-8 leading-relaxed ${heroImagen ? 'max-w-lg' : 'max-w-xl mx-auto'}`}>
                            {subtitulo}
                        </p>

                        {/* Botones */}
                        <div className={`flex flex-wrap items-center gap-3 mb-10 ${heroImagen ? '' : 'justify-center'}`}>
                            <a
                                href="#catalogo"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                                style={{ backgroundColor: colorAccento }}
                            >
                                {botonTexto}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                            <a
                                href="#contacto"
                                className="inline-flex items-center px-6 py-3.5 rounded-full font-semibold text-sm border-2 transition-all hover:-translate-y-0.5"
                                style={{ borderColor: colorPrimario, color: colorPrimario }}
                            >
                                {botonSecundario}
                            </a>
                        </div>

                        {/* Stats */}
                        <div className={`flex items-center gap-8 md:gap-10 ${heroImagen ? '' : 'justify-center'}`}>
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

                    {/* Columna de imagen - solo si hay imagen */}
                    {heroImagen && (
                        <div className="order-1 lg:order-2 flex justify-center">
                            <div className="relative">
                                <div
                                    className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
                                    style={{ backgroundColor: colorAccento }}
                                />
                                <img
                                    src={heroImagen}
                                    alt="Hero"
                                    className="relative w-full max-w-md lg:max-w-lg rounded-3xl object-cover shadow-2xl"
                                    style={{ aspectRatio: '4/5', objectPosition: heroPos }}
                                />
                            </div>
                        </div>
                    )}
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
