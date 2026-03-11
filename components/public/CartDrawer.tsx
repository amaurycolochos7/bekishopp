'use client';

import { useState } from 'react';
import { useCart } from './CartContext';

interface CartDrawerProps {
    whatsapp: string;
    colorPrimario?: string;
    colorAccento?: string;
}

export default function CartDrawer({ whatsapp, colorPrimario = '#1a365d', colorAccento = '#e8a020' }: CartDrawerProps) {
    const { state, removeItem, updateQuantity, clearCart, closeCart, totalItems, totalPrecio } = useCart();
    const [nombreCliente, setNombreCliente] = useState('');
    const [mostrarError, setMostrarError] = useState(false);

    const numero = whatsapp.replace(/\D/g, '');

    // Generar el mensaje de WhatsApp con todos los productos
    const generarMensajeWA = () => {
        if (state.items.length === 0) return '';

        let msg = `*Pedido desde Beky Store*\n`;
        msg += `*Cliente:* ${nombreCliente.trim()}\n\n`;
        state.items.forEach((item, idx) => {
            msg += `${idx + 1}. *${item.producto.nombre.trim()}*\n`;
            msg += `   Cantidad: ${item.cantidad}\n`;
            msg += `   Precio: $${item.producto.precio.toFixed(2)} c/u\n`;
            msg += `   Subtotal: $${(item.producto.precio * item.cantidad).toFixed(2)}\n\n`;
        });
        msg += `---------------\n`;
        msg += `*Total: $${totalPrecio.toFixed(2)}*\n\n`;
        msg += `Gracias!`;
        return encodeURIComponent(msg);
    };

    const handleComprar = () => {
        if (!nombreCliente.trim()) {
            setMostrarError(true);
            return;
        }
        setMostrarError(false);
        const msg = generarMensajeWA();
        if (msg && numero) {
            window.open(`https://wa.me/${numero}?text=${msg}`, '_blank');
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[998] transition-opacity duration-300 ${state.abierto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[999] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${state.abierto ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header del drawer */}
                <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: colorPrimario }}>
                    <div className="flex items-center gap-2 text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        <h2 className="text-lg font-bold">Mi Carrito ({totalItems})</h2>
                    </div>
                    <button onClick={closeCart} className="text-white/80 hover:text-white transition-colors p-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {state.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                            <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            <p className="text-sm">Tu carrito está vacío</p>
                            <p className="text-xs">¡Agrega productos para empezar!</p>
                        </div>
                    ) : (
                        state.items.map((item) => (
                            <div key={item.producto.id} className="flex gap-3 bg-gray-50 rounded-xl p-3 group hover:bg-gray-100 transition-colors">
                                {/* Imagen */}
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                    {item.producto.imagen_url ? (
                                        <img src={item.producto.imagen_url} alt={item.producto.nombre} className="w-full h-full object-cover" loading="lazy" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold truncate" style={{ color: colorPrimario }}>
                                        {item.producto.nombre}
                                    </h4>
                                    <p className="text-sm font-bold" style={{ color: colorAccento }}>
                                        ${item.producto.precio.toFixed(2)}
                                    </p>

                                    {/* Controles de cantidad */}
                                    <div className="flex items-center gap-2 mt-1">
                                        <button
                                            onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-gray-300 hover:bg-gray-200 transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="text-sm font-semibold w-6 text-center">{item.cantidad}</span>
                                        <button
                                            onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-gray-300 hover:bg-gray-200 transition-colors"
                                        >
                                            +
                                        </button>
                                        <span className="text-xs text-gray-400 ml-auto">
                                            ${(item.producto.precio * item.cantidad).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Eliminar */}
                                <button
                                    onClick={() => removeItem(item.producto.id)}
                                    className="self-start text-gray-300 hover:text-red-500 transition-colors p-0.5"
                                    title="Eliminar"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer del drawer */}
                {state.items.length > 0 && (
                    <div className="border-t p-4 space-y-3 bg-gray-50">
                        {/* Campo de nombre */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Tu nombre *</label>
                            <input
                                type="text"
                                placeholder="Escribe tu nombre completo"
                                value={nombreCliente}
                                onChange={(e) => {
                                    setNombreCliente(e.target.value);
                                    if (e.target.value.trim()) setMostrarError(false);
                                }}
                                className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                                    mostrarError
                                        ? 'border-red-400 bg-red-50 focus:border-red-500'
                                        : 'border-gray-200 bg-white focus:border-gray-400'
                                }`}
                            />
                            {mostrarError && (
                                <p className="text-xs text-red-500 mt-1">Por favor ingresa tu nombre para continuar</p>
                            )}
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 font-medium">Total</span>
                            <span className="text-2xl font-bold" style={{ color: colorPrimario }}>
                                ${totalPrecio.toFixed(2)}
                            </span>
                        </div>

                        {/* Botón Comprar por WhatsApp */}
                        <button
                            onClick={handleComprar}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-base shadow-lg shadow-green-500/30 transition-all hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            </svg>
                            Comprar por WhatsApp
                        </button>

                        {/* Vaciar carrito */}
                        <button
                            onClick={clearCart}
                            className="w-full text-center text-sm text-gray-400 hover:text-red-500 transition-colors py-1"
                        >
                            Vaciar carrito
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
