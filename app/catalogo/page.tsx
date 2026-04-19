import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import Header from '@/components/public/Header';
import ProductCatalog from '@/components/public/ProductCatalog';
import Footer from '@/components/public/Footer';
import WhatsAppFloat from '@/components/public/WhatsAppFloat';
import CartDrawer from '@/components/public/CartDrawer';
import type { Configuracion, Categoria, Servicio } from '@/lib/types';
import { normalizarProductos, PRODUCTO_CON_CATEGORIAS } from '@/lib/productos';

export const revalidate = 60;

async function obtenerDatos() {
  try {
    const supabase = await createClient();
    const [configRes, categoriasRes, productosRes, serviciosRes] = await Promise.all([
      supabase.from('configuracion').select('*').limit(1).single(),
      supabase.from('categorias').select('*').order('orden', { ascending: true }),
      supabase.from('productos').select(PRODUCTO_CON_CATEGORIAS).eq('activo', true).order('created_at', { ascending: false }),
      supabase.from('servicios').select('*').eq('activo', true),
    ]);
    return {
      config: (configRes.data as Configuracion) || null,
      categorias: (categoriasRes.data as Categoria[]) || [],
      productos: normalizarProductos(productosRes.data),
      servicios: (serviciosRes.data as Servicio[]) || [],
    };
  } catch {
    return { config: null, categorias: [], productos: [], servicios: [] };
  }
}

export default async function CatalogoPage() {
  const { config, categorias, productos, servicios } = await obtenerDatos();
  const whatsapp = config?.whatsapp_contacto || '';

  return (
    <main>
      <Header config={config} />
      <Suspense fallback={null}>
        <ProductCatalog productos={productos} categorias={categorias} whatsapp={whatsapp} config={config} servicios={servicios} />
      </Suspense>
      <Footer config={config} />
      <WhatsAppFloat whatsapp={whatsapp} />
      <CartDrawer whatsapp={whatsapp} colorPrimario={config?.color_primario} colorAccento={config?.color_acento} />
    </main>
  );
}
