'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import type { Producto, Categoria, Configuracion, Servicio } from '@/lib/types';

interface Props {
    productos: Producto[];
    categorias: Categoria[];
    whatsapp: string;
    config: Configuracion | null;
    servicios?: Servicio[];
}

export default function ProductCatalog({ productos, categorias, whatsapp, config, servicios = [] }: Props) {
    const [filtro, setFiltro] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const searchParams = useSearchParams();

    const titulo = config?.texto_catalogo_titulo || 'Nuestro Catálogo Destacado';
    const subtitulo = config?.texto_catalogo_subtitulo || 'Los mejores productos para ti';
    const colorPrimario = config?.color_primario || '#1a365d';
    const colorAccento = config?.color_acento || '#e8a020';
    const numero = whatsapp.replace(/\D/g, '');

    // Cargar búsqueda y categoría desde query params al montar
    useEffect(() => {
        const q = searchParams.get('buscar');
        if (q) {
            setBusqueda(q);
        }
        const cat = searchParams.get('categoria');
        if (cat) {
            setFiltro(cat);
        }
    }, [searchParams]);

    // Filtrar por categoría (pivote muchos-a-muchos) y búsqueda.
    // Un producto aparece en la categoría si es su categoría principal o
    // está presente en producto.categorias[] (tabla pivote).
    const productosFiltrados = productos
        .filter((p) => {
            if (filtro === 'todos') return true;
            if (p.categoria_id === filtro) return true;
            return (p.categorias || []).some((c) => c.id === filtro);
        })
        .filter((p) => {
            if (!busqueda.trim()) return true;
            const term = busqueda.toLowerCase();
            return (
                p.nombre.toLowerCase().includes(term) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(term))
            );
        });

    // Filtrar servicios por búsqueda
    const serviciosFiltrados = busqueda.trim()
        ? servicios.filter((s) => {
            const term = busqueda.toLowerCase();
            return (
                s.nombre.toLowerCase().includes(term) ||
                (s.descripcion && s.descripcion.toLowerCase().includes(term))
            );
        })
        : [];

    const hayResultados = productosFiltrados.length > 0 || serviciosFiltrados.length > 0;

    return (
        <section id="catalogo" className="py-14 md:py-20" style={{ backgroundColor: `${config?.color_fondo || '#faf5eb'}50` }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: colorPrimario }}>
                        {titulo}
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto">{subtitulo}</p>
                </div>

                {/* Barra de búsqueda en catálogo */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="relative">
                        <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar productos y servicios..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm outline-none focus:border-gray-300 focus:shadow-md transition-all"
                            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                        />
                        {busqueda && (
                            <button
                                onClick={() => setBusqueda('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filtros por categoría */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    <button
                        onClick={() => setFiltro('todos')}
                        className="px-5 py-2 rounded-full text-sm font-medium transition-all"
                        style={filtro === 'todos'
                            ? { backgroundColor: colorPrimario, color: '#fff' }
                            : { backgroundColor: 'transparent', color: '#6b7280', border: '1px solid #e5e7eb' }
                        }
                    >
                        Todos
                    </button>
                    {categorias.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFiltro(cat.id)}
                            className="px-5 py-2 rounded-full text-sm font-medium transition-all"
                            style={filtro === cat.id
                                ? { backgroundColor: colorPrimario, color: '#fff' }
                                : { backgroundColor: 'transparent', color: '#6b7280', border: '1px solid #e5e7eb' }
                            }
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>

                {/* Grid de productos */}
                {productosFiltrados.length > 0 && (
                    <>
                        {busqueda.trim() && serviciosFiltrados.length > 0 && (
                            <h3 className="text-lg font-bold mb-4" style={{ color: colorPrimario }}>Productos</h3>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                            {productosFiltrados.map((producto) => (
                                <ProductCard key={producto.id} producto={producto} whatsapp={whatsapp} config={config} />
                            ))}
                        </div>
                    </>
                )}

                {/* Servicios encontrados en la búsqueda */}
                {serviciosFiltrados.length > 0 && (
                    <div className={productosFiltrados.length > 0 ? 'mt-12' : ''}>
                        <h3 className="text-lg font-bold mb-4" style={{ color: colorPrimario }}>Servicios</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {serviciosFiltrados.map((serv) => (
                                <div
                                    key={serv.id}
                                    className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100 flex flex-col"
                                >
                                    {serv.imagen_url && (
                                        <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                                            <img src={serv.imagen_url} alt={serv.nombre} className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                    )}
                                    <h4 className="font-bold text-lg mb-2" style={{ color: colorPrimario }}>
                                        {serv.nombre}
                                    </h4>
                                    {serv.descripcion && (
                                        <p className="text-gray-400 text-sm mb-4 flex-1">{serv.descripcion}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                        <span className="text-xl font-bold" style={{ color: colorAccento }}>
                                            {serv.precio > 0 ? `$${serv.precio.toFixed(2)}` : 'Gratis'}
                                        </span>
                                        {numero && (
                                            <a
                                                href={`https://wa.me/${numero}?text=${encodeURIComponent(`Hola, me interesa el servicio: ${serv.nombre.trim()}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                                </svg>
                                                Solicitar
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!hayResultados && (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-gray-400 text-lg">
                            {busqueda ? `No se encontraron resultados para "${busqueda}"` : 'No hay productos en esta categoría'}
                        </p>
                        {busqueda && (
                            <button
                                onClick={() => setBusqueda('')}
                                className="mt-3 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                                style={{ color: colorAccento }}
                            >
                                Limpiar búsqueda
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
