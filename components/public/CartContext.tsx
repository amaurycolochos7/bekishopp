'use client';

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Producto } from '@/lib/types';

// ====== Tipos ======
export interface CartItem {
    producto: Producto;
    cantidad: number;
}

interface CartState {
    items: CartItem[];
    abierto: boolean; // drawer abierto/cerrado
}

type CartAction =
    | { type: 'ADD_ITEM'; producto: Producto }
    | { type: 'REMOVE_ITEM'; productoId: string }
    | { type: 'UPDATE_QUANTITY'; productoId: string; cantidad: number }
    | { type: 'CLEAR_CART' }
    | { type: 'TOGGLE_CART' }
    | { type: 'OPEN_CART' }
    | { type: 'CLOSE_CART' }
    | { type: 'LOAD_CART'; items: CartItem[] };

interface CartContextType {
    state: CartState;
    addItem: (producto: Producto) => void;
    removeItem: (productoId: string) => void;
    updateQuantity: (productoId: string, cantidad: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    totalItems: number;
    totalPrecio: number;
}

// ====== Reducer ======
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existing = state.items.find(i => i.producto.id === action.producto.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map(i =>
                        i.producto.id === action.producto.id
                            ? { ...i, cantidad: i.cantidad + 1 }
                            : i
                    ),
                };
            }
            return {
                ...state,
                items: [...state.items, { producto: action.producto, cantidad: 1 }],
            };
        }
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(i => i.producto.id !== action.productoId),
            };
        case 'UPDATE_QUANTITY':
            if (action.cantidad <= 0) {
                return {
                    ...state,
                    items: state.items.filter(i => i.producto.id !== action.productoId),
                };
            }
            return {
                ...state,
                items: state.items.map(i =>
                    i.producto.id === action.productoId
                        ? { ...i, cantidad: action.cantidad }
                        : i
                ),
            };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        case 'TOGGLE_CART':
            return { ...state, abierto: !state.abierto };
        case 'OPEN_CART':
            return { ...state, abierto: true };
        case 'CLOSE_CART':
            return { ...state, abierto: false };
        case 'LOAD_CART':
            return { ...state, items: action.items };
        default:
            return state;
    }
}

// ====== Context ======
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [], abierto: false });

    // Cargar del localStorage al montar
    useEffect(() => {
        try {
            const saved = localStorage.getItem('beky-cart');
            if (saved) {
                const parsed = JSON.parse(saved) as CartItem[];
                if (Array.isArray(parsed) && parsed.length > 0) {
                    dispatch({ type: 'LOAD_CART', items: parsed });
                }
            }
        } catch { /* ignore */ }
    }, []);

    // Guardar en localStorage cada vez que cambian los items
    useEffect(() => {
        try {
            localStorage.setItem('beky-cart', JSON.stringify(state.items));
        } catch { /* ignore */ }
    }, [state.items]);

    const totalItems = state.items.reduce((acc, i) => acc + i.cantidad, 0);
    const totalPrecio = state.items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0);

    const value: CartContextType = {
        state,
        addItem: (producto) => {
            dispatch({ type: 'ADD_ITEM', producto });
        },
        removeItem: (productoId) => dispatch({ type: 'REMOVE_ITEM', productoId }),
        updateQuantity: (productoId, cantidad) => dispatch({ type: 'UPDATE_QUANTITY', productoId, cantidad }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        openCart: () => dispatch({ type: 'OPEN_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
        totalItems,
        totalPrecio,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
    return ctx;
}
