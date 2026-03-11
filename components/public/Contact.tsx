import type { Configuracion } from '@/lib/types';
import { getMapEmbedUrl } from '@/lib/maps';

interface Props {
    config: Configuracion | null;
}

export default function Contact({ config }: Props) {
    const titulo = config?.texto_contacto_titulo || 'Visítanos y Contáctanos';
    const subtitulo = config?.texto_contacto_subtitulo || 'Estamos aquí para atenderte';
    const colorPrimario = config?.color_primario || '#1a365d';
    const colorAccento = config?.color_acento || '#e8a020';
    const direccion = config?.direccion || '';
    const telefono = config?.telefono || '';
    const whatsapp = config?.whatsapp_contacto || '';
    const numero = whatsapp.replace(/\D/g, '');
    const horario = config?.horario || {};
    const mapaEmbedUrl = getMapEmbedUrl(config?.mapa_url || '');

    const dias = [
        { key: 'lunes', label: 'Lunes' },
        { key: 'martes', label: 'Martes' },
        { key: 'miercoles', label: 'Miércoles' },
        { key: 'jueves', label: 'Jueves' },
        { key: 'viernes', label: 'Viernes' },
        { key: 'sabado', label: 'Sábado' },
        { key: 'domingo', label: 'Domingo' },
    ];

    return (
        <section id="contacto" className="py-14 md:py-20" style={{ backgroundColor: `${config?.color_fondo || '#faf5eb'}50` }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: colorPrimario }}>
                        {titulo}
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto">{subtitulo}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Info de contacto */}
                    <div className="space-y-6">
                        {direccion && (
                            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colorAccento}15` }}>
                                    <svg className="w-5 h-5" style={{ color: colorAccento }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm" style={{ color: colorPrimario }}>Dirección</h4>
                                    <p className="text-gray-400 text-sm mt-0.5">{direccion}</p>
                                </div>
                            </div>
                        )}

                        {/* Horario */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100">
                            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colorPrimario }}>
                                <svg className="w-5 h-5" style={{ color: colorAccento }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Horario de apertura
                            </h4>
                            <div className="space-y-2">
                                {dias.map((dia) => (
                                    <div key={dia.key} className="flex justify-between text-sm">
                                        <span className="text-gray-500">{dia.label}</span>
                                        <span className="font-medium text-gray-700">{horario[dia.key] || 'Cerrado'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botones de contacto + Mapa */}
                    <div className="space-y-4">
                        {numero && (
                            <a
                                href={`https://wa.me/${numero}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl p-5 transition-all hover:-translate-y-0.5 shadow-lg shadow-green-500/20"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold">Contáctanos por WhatsApp</p>
                                    <p className="text-sm text-white/70">Respuesta inmediata</p>
                                </div>
                            </a>
                        )}

                        {telefono && (
                            <a
                                href={`tel:${telefono}`}
                                className="flex items-center gap-4 bg-white hover:bg-gray-50 rounded-2xl p-5 border border-gray-100 transition-all hover:-translate-y-0.5"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colorPrimario}15` }}>
                                    <svg className="w-6 h-6" style={{ color: colorPrimario }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold" style={{ color: colorPrimario }}>Llámanos</p>
                                    <p className="text-sm text-gray-400">{telefono}</p>
                                </div>
                            </a>
                        )}

                        {/* Mapa de Google Maps */}
                        {mapaEmbedUrl && (
                            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                <iframe
                                    src={mapaEmbedUrl}
                                    width="100%"
                                    height="250"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Ubicación del negocio"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
