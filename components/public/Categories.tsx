import type { Categoria, Configuracion } from '@/lib/types';

interface Props {
    categorias: Categoria[];
    config: Configuracion | null;
}

export default function Categories({ categorias, config }: Props) {
    if (categorias.length === 0) return null;

    const titulo = config?.texto_categorias_titulo || 'Explora Nuestras Categorías';
    const subtitulo = config?.texto_categorias_subtitulo || 'Encuentra lo que necesitas';
    const colorPrimario = config?.color_primario || '#1a365d';
    const colorAccento = config?.color_acento || '#e8a020';



    return (
        <section id="categorias" className="py-14 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: colorPrimario }}>
                        {titulo}
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto">{subtitulo}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {categorias.map((cat, i) => (
                        <a
                            key={cat.id}
                            href="#catalogo"
                            className="group bg-gray-50 hover:bg-white rounded-2xl p-5 text-center transition-all hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-gray-100"
                        >
                            {cat.imagen_url ? (
                                <div className="w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden">
                                    <img src={cat.imagen_url} alt={cat.nombre} className="w-full h-full object-cover" loading="lazy" />
                                </div>
                            ) : (
                                <div
                                    className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                                    style={{ backgroundColor: colorAccento }}
                                >
                                    {cat.nombre.charAt(0)}
                                </div>
                            )}
                            <h3 className="font-semibold text-sm" style={{ color: colorPrimario }}>
                                {cat.nombre}
                            </h3>
                            {cat.descripcion && (
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.descripcion}</p>
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
