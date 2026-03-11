import type { Servicio, Configuracion } from '@/lib/types';

interface Props {
    servicios: Servicio[];
    whatsapp: string;
    config: Configuracion | null;
}

export default function Services({ servicios, whatsapp, config }: Props) {
    if (servicios.length === 0) return null;

    const titulo = config?.texto_servicios_titulo || 'Nuestros Servicios';
    const subtitulo = config?.texto_servicios_subtitulo || 'Servicios profesionales a tu alcance';
    const colorPrimario = config?.color_primario || '#1a365d';
    const colorAccento = config?.color_acento || '#e8a020';
    const numero = whatsapp.replace(/\D/g, '');

    return (
        <section id="servicios" className="py-14 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: colorPrimario }}>
                        {titulo}
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto">{subtitulo}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {servicios.map((serv) => (
                        <div
                            key={serv.id}
                            className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-transparent hover:border-gray-100 flex flex-col"
                        >
                            {serv.imagen_url && (
                                <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                                    <img src={serv.imagen_url} alt={serv.nombre} className="w-full h-full object-cover" loading="lazy" />
                                </div>
                            )}
                            <h3 className="font-bold text-lg mb-2" style={{ color: colorPrimario }}>
                                {serv.nombre}
                            </h3>
                            {serv.descripcion && (
                                <p className="text-gray-400 text-sm mb-4 flex-1">{serv.descripcion}</p>
                            )}
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/50">
                                <span className="text-xl font-bold" style={{ color: colorAccento }}>
                                    {serv.precio > 0 ? `$${serv.precio.toFixed(2)}` : 'Gratis'}
                                </span>
                                {numero && (
                                    <a
                                        href={`https://wa.me/${numero}?text=${encodeURIComponent(`Hola, me interesa el servicio: ${serv.nombre}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                        </svg>
                                        Consultar
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
