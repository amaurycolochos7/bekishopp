'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Categoria, Configuracion } from '@/lib/types';

interface Props {
    categorias: Categoria[];
    config: Configuracion | null;
}

const INICIAL = 4;

export default function Categories({ categorias, config }: Props) {
    const [mostrarTodas, setMostrarTodas] = useState(false);

    if (categorias.length === 0) return null;

    const titulo = config?.texto_categorias_titulo || 'Explora Nuestras Categorías';
    const subtitulo = config?.texto_categorias_subtitulo || 'Encuentra lo que necesitas';
    const colorPrimario = config?.color_primario || '#1a365d';
    const colorAccento = config?.color_acento || '#e8a020';

    const hayMas = categorias.length > INICIAL;
    const categoriasVisibles = mostrarTodas ? categorias : categorias.slice(0, INICIAL);

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
                    {categoriasVisibles.map((cat) => (
                        <a
                            key={cat.id}
                            href={`/catalogo?categoria=${cat.id}`}
                            className="group bg-gray-50 hover:bg-white rounded-2xl p-5 text-center transition-all hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-gray-100"
                        >
                            {cat.imagen_url ? (
                                <div className="relative w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden">
                                    <Image src={cat.imagen_url} alt={cat.nombre} fill sizes="64px" quality={60} priority className="object-cover" />
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

                {hayMas && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setMostrarTodas((v) => !v)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border transition-all hover:shadow-md"
                            style={{
                                color: colorPrimario,
                                borderColor: `${colorPrimario}33`,
                                backgroundColor: 'white',
                            }}
                        >
                            {mostrarTodas ? 'Ver menos' : `Ver todas (${categorias.length})`}
                            <svg
                                className={`w-4 h-4 transition-transform ${mostrarTodas ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
