import type { Producto, Categoria } from './types';

type RawProducto = Producto & {
  producto_categorias?: { categorias: Categoria | null }[] | null;
};

// Convierte el resultado de .select('*, producto_categorias(categorias(...))')
// en un Producto con categorias[] planas y ordenadas.
export function normalizarProducto(raw: RawProducto): Producto {
  const { producto_categorias, ...resto } = raw;
  const categorias = (producto_categorias || [])
    .map((pc) => pc.categorias)
    .filter((c): c is Categoria => !!c)
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  return { ...resto, categorias };
}

export function normalizarProductos(rows: RawProducto[] | null | undefined): Producto[] {
  return (rows || []).map(normalizarProducto);
}

// Select string reutilizable para cargar productos con sus categorías del pivote.
export const PRODUCTO_CON_CATEGORIAS =
  '*, producto_categorias(categorias(id, nombre, descripcion, imagen_url, orden, created_at))';
