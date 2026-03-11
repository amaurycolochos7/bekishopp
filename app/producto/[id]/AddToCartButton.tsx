'use client';

import { useState } from 'react';
import { useCart } from '@/components/public/CartContext';
import type { Producto } from '@/lib/types';

interface Props {
    producto: Producto;
    colorAccento?: string;
}

export default function AddToCartButton({ producto, colorAccento = '#e8a020' }: Props) {
    const { addItem, openCart } = useCart();
    const [agregado, setAgregado] = useState(false);

    const handleAgregar = () => {
        addItem(producto);
        setAgregado(true);
        openCart();
        setTimeout(() => setAgregado(false), 1500);
    };

    return (
        <button
            onClick={handleAgregar}
            className={`flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                agregado
                    ? 'bg-green-500 text-white shadow-green-500/30'
                    : 'text-white hover:opacity-90'
            }`}
            style={!agregado ? { backgroundColor: colorAccento, boxShadow: `0 10px 15px -3px ${colorAccento}40` } : {}}
        >
            {agregado ? (
                <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    ¡Agregado al Carrito!
                </>
            ) : (
                <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    Agregar al Carrito
                </>
            )}
        </button>
    );
}
