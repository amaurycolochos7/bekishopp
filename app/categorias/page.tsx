import { createClient } from '@/lib/supabase/server';
import Header from '@/components/public/Header';
import Categories from '@/components/public/Categories';
import Footer from '@/components/public/Footer';
import WhatsAppFloat from '@/components/public/WhatsAppFloat';
import CartDrawer from '@/components/public/CartDrawer';
import type { Configuracion, Categoria } from '@/lib/types';

export const revalidate = 60;

async function obtenerDatos() {
  try {
    const supabase = await createClient();
    const [configRes, categoriasRes] = await Promise.all([
      supabase.from('configuracion').select('*').limit(1).single(),
      supabase.from('categorias').select('*').order('orden', { ascending: true }),
    ]);
    return {
      config: (configRes.data as Configuracion) || null,
      categorias: (categoriasRes.data as Categoria[]) || [],
    };
  } catch {
    return { config: null, categorias: [] };
  }
}

export default async function CategoriasPage() {
  const { config, categorias } = await obtenerDatos();
  const whatsapp = config?.whatsapp_contacto || '';

  return (
    <main>
      <Header config={config} />
      <Categories categorias={categorias} config={config} />
      <Footer config={config} />
      <WhatsAppFloat whatsapp={whatsapp} />
      <CartDrawer whatsapp={whatsapp} colorPrimario={config?.color_primario} colorAccento={config?.color_acento} />
    </main>
  );
}

