'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getMapEmbedUrl } from '@/lib/maps';

type Tab = 'general' | 'hero' | 'colores' | 'textos' | 'redes' | 'horario';

interface ConfigData {
    id?: string;
    nombre_negocio: string;
    slogan: string;
    whatsapp_contacto: string;
    telefono: string;
    logo_url: string;
    direccion: string;
    mapa_url: string;
    hero_titulo: string;
    hero_subtitulo: string;
    hero_imagen_url: string;
    hero_imagen_posicion: string;
    hero_badge: string;
    hero_boton_texto: string;
    hero_boton_secundario_texto: string;
    stats: { valor: string; etiqueta: string }[];
    color_primario: string;
    color_secundario: string;
    color_acento: string;
    color_fondo: string;
    color_texto: string;
    texto_categorias_titulo: string;
    texto_categorias_subtitulo: string;
    texto_catalogo_titulo: string;
    texto_catalogo_subtitulo: string;
    texto_servicios_titulo: string;
    texto_servicios_subtitulo: string;
    texto_contacto_titulo: string;
    texto_contacto_subtitulo: string;
    texto_footer: string;
    redes_sociales: { facebook: string; instagram: string; tiktok: string };
    horario: Record<string, string>;
}

const configDefaults: ConfigData = {
    nombre_negocio: 'Mi Negocio',
    slogan: '',
    whatsapp_contacto: '',
    telefono: '',
    logo_url: '',
    direccion: '',
    mapa_url: '',
    hero_titulo: 'Tu Selección de Calidad.',
    hero_subtitulo: 'Productos y Servicios de Origen Familiar.',
    hero_imagen_url: '',
    hero_imagen_posicion: 'center center',
    hero_badge: 'Catálogo disponible',
    hero_boton_texto: 'Explorar Catálogo',
    hero_boton_secundario_texto: 'Contáctanos',
    stats: [
        { valor: '100+', etiqueta: 'Productos' },
        { valor: '500+', etiqueta: 'Clientes felices' },
        { valor: '24/7', etiqueta: 'WhatsApp' },
    ],
    color_primario: '#1a365d',
    color_secundario: '#c9a84c',
    color_acento: '#e8a020',
    color_fondo: '#faf5eb',
    color_texto: '#1a202c',
    texto_categorias_titulo: 'Explora Nuestras Categorías',
    texto_categorias_subtitulo: 'Encuentra lo que necesitas',
    texto_catalogo_titulo: 'Nuestro Catálogo Destacado',
    texto_catalogo_subtitulo: 'Los mejores productos para ti',
    texto_servicios_titulo: 'Nuestros Servicios',
    texto_servicios_subtitulo: 'Servicios profesionales a tu alcance',
    texto_contacto_titulo: 'Visítanos y Contáctanos',
    texto_contacto_subtitulo: 'Estamos aquí para atenderte',
    texto_footer: 'Tu selección de calidad en productos y servicios.',
    redes_sociales: { facebook: '', instagram: '', tiktok: '' },
    horario: {
        lunes: '9:00 am - 6:00 pm', martes: '9:00 am - 6:00 pm',
        miercoles: '9:00 am - 6:00 pm', jueves: '9:00 am - 6:00 pm',
        viernes: '9:00 am - 6:00 pm', sabado: '9:00 am - 2:00 pm',
        domingo: 'Cerrado',
    },
};

function getVal(cfg: ConfigData, key: string): string {
    return String((cfg as unknown as Record<string, unknown>)[key] ?? '');
}

// ============================
// PREVIEW MOBILE EN VIVO
// ============================
function MobilePreview({ config }: { config: ConfigData }) {
    const c = config;
    return (
        <div className="w-full h-full overflow-y-auto text-[10px] leading-tight" style={{ fontFamily: 'system-ui, sans-serif' }}>
            {/* Barra superior - igual que Header.tsx */}
            <div className="py-0.5 text-center text-white font-medium" style={{ backgroundColor: c.color_acento, fontSize: '6px' }}>
                Bienvenido a {c.nombre_negocio}
            </div>

            {/* Header - mobile: logo + hamburger, sin links */}
            <div className="flex items-center justify-between px-2.5 py-1.5 text-white" style={{ backgroundColor: c.color_primario }}>
                <div className="flex items-center gap-1.5">
                    {c.logo_url ? (
                        <img src={c.logo_url} alt="" className="w-4 h-4 rounded-full object-cover bg-white p-[1px]" />
                    ) : (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: c.color_acento }}>
                            <svg className="w-2 h-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                        </div>
                    )}
                </div>
                {/* Hamburger icon */}
                <div className="flex flex-col gap-[2px]">
                    <div className="w-3 h-[1.5px] bg-white rounded-full" />
                    <div className="w-3 h-[1.5px] bg-white rounded-full" />
                    <div className="w-3 h-[1.5px] bg-white rounded-full" />
                </div>
            </div>

            {/* Hero section - matching Hero.tsx mobile layout */}
            <div className="px-3 py-4" style={{ backgroundColor: c.color_fondo }}>
                {/* Imagen primero en mobile (order-1) */}
                {c.hero_imagen_url && (
                    <div className="flex justify-center mb-3">
                        <div className="relative w-full">
                            <img
                                src={c.hero_imagen_url}
                                alt=""
                                className="w-full rounded-2xl object-cover shadow-lg"
                                style={{ aspectRatio: '4/5', maxHeight: '120px', objectPosition: c.hero_imagen_posicion }}
                            />
                        </div>
                    </div>
                )}

                {/* Badge */}
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/70 border border-gray-200/50 mb-2">
                    <span className="text-green-500" style={{ fontSize: '5px' }}>●</span>
                    <span className="text-gray-600" style={{ fontSize: '6px' }}>{c.hero_badge.replace('● ', '')}</span>
                </div>

                {/* Título */}
                <h2 className="font-extrabold leading-tight mb-1" style={{ color: c.color_primario, fontSize: '14px' }}>
                    {c.hero_titulo.split('.')[0]}
                    {c.hero_titulo.includes('.') && <span style={{ color: c.color_acento }}>.</span>}
                </h2>

                {/* Subtítulo */}
                <p className="text-gray-500 mb-3 leading-relaxed" style={{ fontSize: '7px' }}>{c.hero_subtitulo}</p>

                {/* Botones */}
                <div className="flex flex-wrap gap-1 mb-3">
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-white font-semibold shadow-sm" style={{ backgroundColor: c.color_acento, fontSize: '6px' }}>
                        {c.hero_boton_texto}
                        <svg className="w-1.5 h-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                    <span className="px-2.5 py-1 rounded-full font-semibold border" style={{ borderColor: c.color_primario, color: c.color_primario, fontSize: '6px', borderWidth: '1.5px' }}>
                        {c.hero_boton_secundario_texto}
                    </span>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                    {c.stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="font-extrabold" style={{ color: c.color_primario, fontSize: '10px' }}>{s.valor}</p>
                            <p className="text-gray-400 italic" style={{ fontSize: '5px' }}>{s.etiqueta}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección Categorías */}
            <div className="px-3 py-3 bg-white">
                <h3 className="font-bold text-[9px] text-center mb-1" style={{ color: c.color_primario }}>
                    {c.texto_categorias_titulo}
                </h3>
                <p className="text-center text-gray-400 mb-2" style={{ fontSize: '5px' }}>{c.texto_categorias_subtitulo}</p>
                <div className="grid grid-cols-3 gap-1">
                    {['Cat. 1', 'Cat. 2', 'Cat. 3'].map((cat, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-1.5 text-center">
                            <div className="w-5 h-5 mx-auto rounded-lg text-white flex items-center justify-center font-bold mb-0.5" style={{ backgroundColor: c.color_acento, fontSize: '6px' }}>
                                {cat.charAt(0)}
                            </div>
                            <span style={{ fontSize: '5px' }} className="text-gray-600">{cat}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección Catálogo */}
            <div className="px-3 py-3" style={{ backgroundColor: c.color_fondo }}>
                <h3 className="font-bold text-[9px] text-center mb-1" style={{ color: c.color_primario }}>
                    {c.texto_catalogo_titulo}
                </h3>
                <p className="text-center text-gray-400 mb-2" style={{ fontSize: '5px' }}>{c.texto_catalogo_subtitulo}</p>
                <div className="grid grid-cols-2 gap-1">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                            <div className="aspect-square bg-gray-100" />
                            <div className="p-1">
                                <p className="font-semibold text-gray-700" style={{ fontSize: '5px' }}>Producto {i}</p>
                                <p className="font-bold" style={{ color: c.color_acento, fontSize: '7px' }}>$99.00</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección Servicios */}
            <div className="px-3 py-3 bg-white">
                <h3 className="font-bold text-[9px] text-center mb-1" style={{ color: c.color_primario }}>
                    {c.texto_servicios_titulo}
                </h3>
                <p className="text-center text-gray-400 mb-1.5" style={{ fontSize: '5px' }}>{c.texto_servicios_subtitulo}</p>
                <div className="bg-gray-50 rounded-lg p-1.5">
                    <p className="font-bold" style={{ color: c.color_primario, fontSize: '6px' }}>Servicio ejemplo</p>
                    <p className="text-gray-400" style={{ fontSize: '5px' }}>Descripcion del servicio</p>
                </div>
            </div>

            {/* Sección Contacto */}
            <div className="px-3 py-3" style={{ backgroundColor: c.color_fondo }}>
                <h3 className="font-bold text-[9px] text-center mb-1" style={{ color: c.color_primario }}>
                    {c.texto_contacto_titulo}
                </h3>
                <p className="text-center text-gray-400 mb-1.5" style={{ fontSize: '5px' }}>{c.texto_contacto_subtitulo}</p>
                {c.direccion && (
                    <div className="bg-white rounded-lg p-1.5 mb-1">
                        <p className="font-semibold" style={{ color: c.color_primario, fontSize: '6px' }}>Direccion</p>
                        <p className="text-gray-400" style={{ fontSize: '5px' }}>{c.direccion}</p>
                    </div>
                )}
                {c.telefono && (
                    <div className="bg-white rounded-lg p-1.5">
                        <p className="font-semibold" style={{ color: c.color_primario, fontSize: '6px' }}>Telefono</p>
                        <p className="text-gray-400" style={{ fontSize: '5px' }}>{c.telefono}</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-3 py-3 text-white" style={{ backgroundColor: c.color_primario }}>
                <p className="font-bold text-[8px] mb-0.5" style={{ color: c.color_acento }}>{c.nombre_negocio}</p>
                <p className="text-white/60 mb-1" style={{ fontSize: '5px' }}>{c.texto_footer}</p>
                <div className="flex gap-1">
                    {c.redes_sociales.facebook && <div className="w-3 h-3 rounded-full bg-white/20" />}
                    {c.redes_sociales.instagram && <div className="w-3 h-3 rounded-full bg-white/20" />}
                    {c.redes_sociales.tiktok && <div className="w-3 h-3 rounded-full bg-white/20" />}
                </div>
                <p className="text-white/30 mt-1" style={{ fontSize: '4px' }}>© {new Date().getFullYear()} {c.nombre_negocio}</p>
            </div>
        </div>
    );
}

// ============================
// PÁGINA PRINCIPAL
// ============================
export default function ConfiguracionPage() {
    const [tab, setTab] = useState<Tab>('general');
    const [config, setConfig] = useState<ConfigData>(configDefaults);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [subiendoLogo, setSubiendoLogo] = useState(false);
    const [subiendoHero, setSubiendoHero] = useState(false);

    const supabase = createClient();

    useEffect(() => { cargarConfiguracion(); }, []);

    async function cargarConfiguracion() {
        try {
            const { data } = await supabase.from('configuracion').select('*').limit(1).single();
            if (data) {
                setConfig({
                    ...configDefaults, ...data,
                    stats: data.stats || configDefaults.stats,
                    redes_sociales: data.redes_sociales || configDefaults.redes_sociales,
                    horario: data.horario || configDefaults.horario,
                });
            }
        } catch { /* sin datos */ }
        setCargando(false);
    }

    async function guardar() {
        setGuardando(true);
        setMensaje('');
        try {
            const dataToSave = { ...config };
            if (config.id) {
                const { error } = await supabase.from('configuracion').update(dataToSave).eq('id', config.id);
                if (error) throw error;
            } else {
                const { error, data } = await supabase.from('configuracion').insert(dataToSave).select().single();
                if (error) throw error;
                if (data) setConfig(prev => ({ ...prev, id: data.id }));
            }
            setMensaje('Cambios guardados correctamente');
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
            setMensaje(`Error: ${errorMsg}`);
        }
        setGuardando(false);
        setTimeout(() => setMensaje(''), 4000);
    }

    async function subirImagen(file: File, tipo: 'logo' | 'hero') {
        const setSubiendo = tipo === 'logo' ? setSubiendoLogo : setSubiendoHero;
        setSubiendo(true);
        const ext = file.name.split('.').pop();
        const nombre = `${tipo}_${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('configuracion').upload(nombre, file, { upsert: true });
        if (error) {
            setMensaje(`Error subiendo imagen: ${error.message}`);
            setSubiendo(false);
            return;
        }
        const { data: urlData } = supabase.storage.from('configuracion').getPublicUrl(nombre);
        if (tipo === 'logo') {
            setConfig(prev => ({ ...prev, logo_url: urlData.publicUrl }));
        } else {
            setConfig(prev => ({ ...prev, hero_imagen_url: urlData.publicUrl }));
        }
        setSubiendo(false);
    }

    const tabs: { id: Tab; label: string }[] = [
        { id: 'general', label: 'General' },
        { id: 'hero', label: 'Hero / Inicio' },
        { id: 'colores', label: 'Colores' },
        { id: 'textos', label: 'Textos' },
        { id: 'redes', label: 'Redes Sociales' },
        { id: 'horario', label: 'Horario' },
    ];

    if (cargando) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="flex gap-6 items-start">
            {/* COLUMNA IZQUIERDA: Controles */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Personalización del Sitio</h1>
                        <p className="text-gray-400 text-xs mt-0.5">Los cambios se previsualizan en tiempo real</p>
                    </div>
                    <button
                        onClick={guardar}
                        disabled={guardando}
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 flex items-center gap-2 self-start"
                    >
                        {guardando ? (
                            <>
                                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                Guardando...
                            </>
                        ) : 'Guardar Cambios'}
                    </button>
                </div>

                {mensaje && (
                    <div className={`mb-3 p-2.5 rounded-xl text-sm font-medium ${mensaje.startsWith('Cambios') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {mensaje}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex flex-wrap gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ====== Tab: General ====== */}
                {tab === 'general' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-2">Información del Negocio</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Nombre del negocio" value={config.nombre_negocio} onChange={v => setConfig(p => ({ ...p, nombre_negocio: v }))} />
                            <InputField label="Slogan" value={config.slogan} onChange={v => setConfig(p => ({ ...p, slogan: v }))} />
                            <InputField label="WhatsApp (con código de país)" value={config.whatsapp_contacto} onChange={v => setConfig(p => ({ ...p, whatsapp_contacto: v }))} placeholder="5219998887777" />
                            <InputField label="Teléfono" value={config.telefono} onChange={v => setConfig(p => ({ ...p, telefono: v }))} />
                            <div className="md:col-span-2">
                                <InputField label="Dirección" value={config.direccion} onChange={v => setConfig(p => ({ ...p, direccion: v }))} />
                            </div>
                            <div className="md:col-span-2">
                                <InputField label="Ubicación en Google Maps" value={config.mapa_url} onChange={v => setConfig(p => ({ ...p, mapa_url: v }))} placeholder="Pega aquí el link de Google Maps o escribe la dirección" />
                                <p className="text-[10px] text-gray-400 mt-1">Abre Google Maps → Busca tu negocio → Compartir → Copia el enlace y pégalo aquí</p>
                                {config.mapa_url && (
                                    <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
                                        <iframe src={getMapEmbedUrl(config.mapa_url)} width="100%" height="150" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Logo del negocio</label>
                            <div className="flex items-center gap-3">
                                {config.logo_url ? (
                                    <img src={config.logo_url} alt="Logo" className="w-14 h-14 rounded-xl object-cover border" />
                                ) : (
                                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                )}
                                <label className="cursor-pointer px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors">
                                    {subiendoLogo ? 'Subiendo...' : 'Subir logo'}
                                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && subirImagen(e.target.files[0], 'logo')} />
                                </label>
                                {config.logo_url && <button onClick={() => setConfig(p => ({ ...p, logo_url: '' }))} className="text-red-400 hover:text-red-600 text-xs">Quitar</button>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Texto del Footer</label>
                            <textarea value={config.texto_footer} onChange={e => setConfig(p => ({ ...p, texto_footer: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm" />
                        </div>
                    </div>
                )}

                {/* ====== Tab: Hero ====== */}
                {tab === 'hero' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-2">Sección Hero / Inicio</h2>
                        <InputField label="Título principal" value={config.hero_titulo} onChange={v => setConfig(p => ({ ...p, hero_titulo: v }))} />
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Subtítulo</label>
                            <textarea value={config.hero_subtitulo} onChange={e => setConfig(p => ({ ...p, hero_subtitulo: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm" />
                        </div>
                        <InputField label="Badge (etiqueta superior)" value={config.hero_badge} onChange={v => setConfig(p => ({ ...p, hero_badge: v }))} />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Botón principal" value={config.hero_boton_texto} onChange={v => setConfig(p => ({ ...p, hero_boton_texto: v }))} />
                            <InputField label="Botón secundario" value={config.hero_boton_secundario_texto} onChange={v => setConfig(p => ({ ...p, hero_boton_secundario_texto: v }))} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Imagen del Hero</label>
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col gap-2">
                                    {config.hero_imagen_url ? (
                                        <div className="relative w-32 h-40 rounded-xl overflow-hidden border border-gray-200">
                                            <img src={config.hero_imagen_url} alt="Hero" className="w-full h-full object-cover" style={{ objectPosition: config.hero_imagen_posicion }} />
                                        </div>
                                    ) : (
                                        <div className="w-32 h-40 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                    <div className="flex gap-1.5">
                                        <label className="cursor-pointer px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors">
                                            {subiendoHero ? 'Subiendo...' : 'Subir imagen'}
                                            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && subirImagen(e.target.files[0], 'hero')} />
                                        </label>
                                        {config.hero_imagen_url && <button onClick={() => setConfig(p => ({ ...p, hero_imagen_url: '' }))} className="text-red-400 hover:text-red-600 text-xs">Quitar</button>}
                                    </div>
                                </div>
                                {config.hero_imagen_url && (
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ajustar enfoque de la imagen</label>
                                        <p className="text-[10px] text-gray-400 mb-2">Arrastra sobre la imagen para elegir el punto de enfoque</p>
                                        {/* Draggable image positioner */}
                                        <div
                                            className="relative w-full max-w-[280px] h-40 rounded-xl overflow-hidden border-2 border-amber-400 cursor-crosshair select-none bg-gray-100"
                                            onMouseDown={e => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const updatePos = (clientX: number, clientY: number) => {
                                                    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
                                                    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
                                                    setConfig(p => ({ ...p, hero_imagen_posicion: `${Math.round(x)}% ${Math.round(y)}%` }));
                                                };
                                                updatePos(e.clientX, e.clientY);
                                                const onMove = (ev: MouseEvent) => updatePos(ev.clientX, ev.clientY);
                                                const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
                                                document.addEventListener('mousemove', onMove);
                                                document.addEventListener('mouseup', onUp);
                                            }}
                                            onTouchStart={e => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const updatePos = (clientX: number, clientY: number) => {
                                                    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
                                                    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
                                                    setConfig(p => ({ ...p, hero_imagen_posicion: `${Math.round(x)}% ${Math.round(y)}%` }));
                                                };
                                                const touch = e.touches[0];
                                                updatePos(touch.clientX, touch.clientY);
                                                const onMove = (ev: TouchEvent) => { ev.preventDefault(); updatePos(ev.touches[0].clientX, ev.touches[0].clientY); };
                                                const onEnd = () => { document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onEnd); };
                                                document.addEventListener('touchmove', onMove, { passive: false });
                                                document.addEventListener('touchend', onEnd);
                                            }}
                                        >
                                            <img src={config.hero_imagen_url} alt="" className="w-full h-full object-cover pointer-events-none" style={{ objectPosition: config.hero_imagen_posicion }} />
                                            {/* Crosshair indicator */}
                                            {(() => {
                                                const parts = config.hero_imagen_posicion.match(/(\d+)%\s+(\d+)%/);
                                                const px = parts ? parseInt(parts[1]) : 50;
                                                const py = parts ? parseInt(parts[2]) : 50;
                                                return (
                                                    <div className="absolute pointer-events-none" style={{ left: `${px}%`, top: `${py}%`, transform: 'translate(-50%, -50%)' }}>
                                                        <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg shadow-black/30" />
                                                        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <button onClick={() => setConfig(p => ({ ...p, hero_imagen_posicion: '50% 50%' }))} className="text-amber-600 hover:text-amber-700 text-[10px] font-medium mt-2">Centrar</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estadísticas</label>
                            <div className="space-y-2">
                                {config.stats.map((stat, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <input type="text" value={stat.valor} onChange={e => { const s = [...config.stats]; s[i] = { ...s[i], valor: e.target.value }; setConfig(p => ({ ...p, stats: s })); }} placeholder="100+" className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center font-bold" />
                                        <input type="text" value={stat.etiqueta} onChange={e => { const s = [...config.stats]; s[i] = { ...s[i], etiqueta: e.target.value }; setConfig(p => ({ ...p, stats: s })); }} placeholder="Productos" className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs" />
                                        <button onClick={() => setConfig(p => ({ ...p, stats: p.stats.filter((_, idx) => idx !== i) }))} className="text-red-400 hover:text-red-600 text-xs px-1">x</button>
                                    </div>
                                ))}
                                <button onClick={() => setConfig(p => ({ ...p, stats: [...p.stats, { valor: '', etiqueta: '' }] }))} className="text-amber-600 hover:text-amber-700 text-xs font-medium">+ Agregar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ====== Tab: Colores ====== */}
                {tab === 'colores' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-2">Paleta de Colores</h2>
                        <p className="text-xs text-gray-400">Se aplican en todo el sitio. Ve los cambios en la vista previa.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { key: 'color_primario', label: 'Primario', desc: 'Header, títulos' },
                                { key: 'color_secundario', label: 'Secundario', desc: 'Acentos secundarios' },
                                { key: 'color_acento', label: 'Acento', desc: 'Botones, precios, barra' },
                                { key: 'color_fondo', label: 'Fondo', desc: 'Hero, secciones alternas' },
                                { key: 'color_texto', label: 'Texto', desc: 'Texto general' },
                            ].map(c => (
                                <div key={c.key} className="bg-gray-50 rounded-xl p-3">
                                    <label className="block text-xs font-semibold text-gray-700 mb-0.5">{c.label}</label>
                                    <p className="text-[10px] text-gray-400 mb-2">{c.desc}</p>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={getVal(config, c.key)} onChange={e => setConfig(p => ({ ...p, [c.key]: e.target.value }))} className="w-9 h-8 rounded-lg border border-gray-200 cursor-pointer" />
                                        <input type="text" value={getVal(config, c.key)} onChange={e => setConfig(p => ({ ...p, [c.key]: e.target.value }))} className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-mono" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ====== Tab: Textos ====== */}
                {tab === 'textos' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-2">Textos de las Secciones</h2>
                        {[
                            { titulo: 'texto_categorias_titulo', subtitulo: 'texto_categorias_subtitulo', seccion: 'Categorías' },
                            { titulo: 'texto_catalogo_titulo', subtitulo: 'texto_catalogo_subtitulo', seccion: 'Catálogo' },
                            { titulo: 'texto_servicios_titulo', subtitulo: 'texto_servicios_subtitulo', seccion: 'Servicios' },
                            { titulo: 'texto_contacto_titulo', subtitulo: 'texto_contacto_subtitulo', seccion: 'Contacto' },
                        ].map(s => (
                            <div key={s.titulo} className="bg-gray-50 rounded-xl p-3 space-y-2">
                                <h3 className="text-xs font-bold text-gray-600">{s.seccion}</h3>
                                <InputField label="Título" value={getVal(config, s.titulo)} onChange={v => setConfig(p => ({ ...p, [s.titulo]: v }))} />
                                <InputField label="Subtítulo" value={getVal(config, s.subtitulo)} onChange={v => setConfig(p => ({ ...p, [s.subtitulo]: v }))} />
                            </div>
                        ))}
                    </div>
                )}

                {/* ====== Tab: Redes ====== */}
                {tab === 'redes' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-2">Redes Sociales</h2>
                        {[
                            { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/tu-pagina' },
                            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/tu-cuenta' },
                            { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@tu-usuario' },
                        ].map(r => (
                            <InputField
                                key={r.key}
                                label={r.label}
                                placeholder={r.placeholder}
                                value={config.redes_sociales[r.key as keyof typeof config.redes_sociales]}
                                onChange={v => setConfig(p => ({ ...p, redes_sociales: { ...p.redes_sociales, [r.key]: v } }))}
                            />
                        ))}
                    </div>
                )}

                {/* ====== Tab: Horario ====== */}
                {tab === 'horario' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-2">Horario de Atención</h2>
                        {[
                            { key: 'lunes', label: 'Lunes' }, { key: 'martes', label: 'Martes' },
                            { key: 'miercoles', label: 'Miércoles' }, { key: 'jueves', label: 'Jueves' },
                            { key: 'viernes', label: 'Viernes' }, { key: 'sabado', label: 'Sábado' },
                            { key: 'domingo', label: 'Domingo' },
                        ].map(dia => (
                            <div key={dia.key} className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-700 w-20">{dia.label}</span>
                                <input type="text" value={config.horario[dia.key] || ''} onChange={e => setConfig(p => ({ ...p, horario: { ...p.horario, [dia.key]: e.target.value } }))} placeholder="9:00 am - 6:00 pm" className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* COLUMNA DERECHA: Preview Mobile */}
            <div className="hidden lg:block sticky top-20 flex-shrink-0">
                <p className="text-xs font-semibold text-gray-500 text-center mb-2">Vista previa móvil</p>
                {/* Phone frame */}
                <div className="relative">
                    {/* Phone bezel */}
                    <div className="w-[220px] h-[440px] bg-gray-900 rounded-[2rem] p-[6px] shadow-2xl shadow-black/20">
                        {/* Notch */}
                        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-16 h-[14px] bg-gray-900 rounded-b-xl z-20" />
                        {/* Screen */}
                        <div className="w-full h-full bg-white rounded-[1.6rem] overflow-hidden relative">
                            {/* Status bar mockup */}
                            <div className="h-5 bg-gray-900 flex items-center justify-between px-5 text-white" style={{ fontSize: '6px' }}>
                                <span>9:41</span>
                                <div className="flex gap-0.5 items-center">
                                    <div className="w-2.5 h-1.5 border border-white/60 rounded-sm"><div className="w-1.5 h-full bg-white rounded-sm" /></div>
                                </div>
                            </div>
                            {/* Content */}
                            <div className="h-[calc(100%-20px)] overflow-hidden">
                                <MobilePreview config={config} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================
// COMPONENTE INPUT REUTILIZABLE
// ============================
function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
            />
        </div>
    );
}
