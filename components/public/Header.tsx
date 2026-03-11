'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Configuracion } from '@/lib/types';
import { useCart } from './CartContext';

interface HeaderProps {
    config: Configuracion | null;
}

export default function Header({ config }: HeaderProps) {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [busquedaAbierta, setBusquedaAbierta] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { toggleCart, totalItems } = useCart();

    const nombreNegocio = config?.nombre_negocio || 'Catálogo de Productos';
    const logoUrl = config?.logo_url;
    const colorPrimario = config?.color_primario || '#1a365d';
    const colorAccento = config?.color_acento || '#e8a020';

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/catalogo', label: 'Catálogo' },
        { href: '/servicios', label: 'Servicios' },
        { href: '/contacto', label: 'Contacto' },
    ];

    useEffect(() => {
        if (busquedaAbierta && inputRef.current) {
            inputRef.current.focus();
        }
    }, [busquedaAbierta]);

    // Redirigir al catálogo con query de búsqueda
    const handleBuscar = (e: React.FormEvent) => {
        e.preventDefault();
        if (busqueda.trim()) {
            window.location.href = `/catalogo?buscar=${encodeURIComponent(busqueda.trim())}`;
            setBusquedaAbierta(false);
            setBusqueda('');
        }
    };

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
                    <div className="relative flex items-center justify-center h-20">

                        {/* Búsqueda - izquierda */}
                        <div className="absolute left-0 flex items-center gap-2">
                            <button
                                onClick={() => setBusquedaAbierta(!busquedaAbierta)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                aria-label="Buscar productos"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Logo centrado */}
                        <Link href="/" className="flex flex-col items-center gap-1 group">
                            {logoUrl ? (
                                <img src={logoUrl} alt={nombreNegocio} width={72} height={72} className="rounded-full bg-white p-0.5 object-cover" />
                            ) : (
                                <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white" style={{ backgroundColor: colorAccento }}>
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                                </div>
                            )}
                        </Link>

                        {/* Carrito + Menú - derecha */}
                        <div className="absolute right-0 flex items-center gap-1">
                            {/* Botón de Carrito */}
                            <button
                                onClick={toggleCart}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
                                aria-label="Ver carrito"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                </svg>
                                {totalItems > 0 && (
                                    <span
                                        className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white animate-cart-badge"
                                        style={{ backgroundColor: colorAccento }}
                                    >
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </span>
                                )}
                            </button>

                            {/* Nav links desktop */}
                            <nav className="hidden md:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <a key={link.href} href={link.href} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                                        {link.label}
                                    </a>
                                ))}
                            </nav>

                            {/* Hamburger mobile */}
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
                    </div>

                    {/* Barra de búsqueda expandible */}
                    <div className={`overflow-hidden transition-all duration-300 ease-out ${busquedaAbierta ? 'max-h-16 opacity-100 pb-3' : 'max-h-0 opacity-0'}`}>
                        <form onSubmit={handleBuscar} className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 backdrop-blur text-white placeholder-white/50 text-sm outline-none focus:bg-white/20 transition-colors border border-white/10 focus:border-white/30"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                                style={{ backgroundColor: colorAccento }}
                            >
                                Buscar
                            </button>
                        </form>
                    </div>

                    {/* Menú mobile */}
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
