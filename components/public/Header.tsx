'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Configuracion } from '@/lib/types';

interface HeaderProps {
    config: Configuracion | null;
}

export default function Header({ config }: HeaderProps) {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const nombreNegocio = config?.nombre_negocio || 'Catálogo de Productos';
    const logoUrl = config?.logo_url;
    const colorPrimario = config?.color_primario || '#1a365d';
    const colorAccento = config?.color_acento || '#e8a020';

    const navLinks = [
        { href: '#inicio', label: 'Inicio' },
        { href: '#catalogo', label: 'Catálogo' },
        { href: '#servicios', label: 'Servicios' },
        { href: '#contacto', label: 'Contacto' },
    ];

    return (
        <>
            {/* Barra superior */}
            <div style={{ backgroundColor: colorAccento }} className="text-white text-sm py-1.5">
                <p className="text-center font-medium">
                    Bienvenido a {nombreNegocio}
                </p>
            </div>

            {/* Header principal */}
            <header style={{ backgroundColor: colorPrimario }} className="text-white sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3 group">
                            {logoUrl ? (
                                <Image src={logoUrl} alt={nombreNegocio} width={40} height={40} className="rounded-full bg-white p-0.5" />
                            ) : (
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: colorAccento }}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                                </div>
                            )}
                            <div className="hidden sm:block">
                                <span className="font-bold text-lg group-hover:text-amber-300 transition-colors">{nombreNegocio}</span>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a key={link.href} href={link.href} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <button
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                            aria-label="Abrir menú"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {menuAbierto
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>

                    {menuAbierto && (
                        <nav className="md:hidden pb-4 border-t border-white/10 pt-3 space-y-1">
                            {navLinks.map((link) => (
                                <a key={link.href} href={link.href} onClick={() => setMenuAbierto(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    )}
                </div>
            </header>
        </>
    );
}
