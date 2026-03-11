import { createClient } from '@/lib/supabase/server';
import Header from '@/components/public/Header';
import Hero from '@/components/public/Hero';
import Categories from '@/components/public/Categories';
import ProductCatalog from '@/components/public/ProductCatalog';
import Services from '@/components/public/Services';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import WhatsAppFloat from '@/components/public/WhatsAppFloat';
import CartDrawer from '@/components/public/CartDrawer';
import type { Configuracion, Categoria, Producto, Servicio } from '@/lib/types';

export const revalidate = 60;

async function obtenerDatos() {
  try {
    const supabase = await createClient();
    const [configRes, categoriasRes, productosRes, serviciosRes] = await Promise.all([
      supabase.from('configuracion').select('*').limit(1).single(),
      supabase.from('categorias').select('*').order('orden', { ascending: true }),
      supabase.from('productos').select('*, categorias(nombre)').eq('activo', true).order('created_at', { ascending: false }),
      supabase.from('servicios').select('*').eq('activo', true),
    ]);
    return {
      config: (configRes.data as Configuracion) || null,
      categorias: (categoriasRes.data as Categoria[]) || [],
      productos: (productosRes.data as Producto[]) || [],
      servicios: (serviciosRes.data as Servicio[]) || [],
    };
  } catch {
    return { config: null, categorias: [], productos: [], servicios: [] };
  }
}

export default async function Home() {
  const { config, categorias, productos, servicios } = await obtenerDatos();
  const whatsapp = config?.whatsapp_contacto || '';

  return (
    <main>
      <Header config={config} />
      <Hero config={config} />
      <Categories categorias={categorias} config={config} />
      <ProductCatalog productos={productos} categorias={categorias} whatsapp={whatsapp} config={config} servicios={servicios} />
      <Services servicios={servicios} whatsapp={whatsapp} config={config} />
      <Contact config={config} />
      <Footer config={config} />
      <WhatsAppFloat whatsapp={whatsapp} />
      <CartDrawer whatsapp={whatsapp} colorPrimario={config?.color_primario} colorAccento={config?.color_acento} />
    </main>
  );
}
