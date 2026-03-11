import { createClient } from '@/lib/supabase/server';
import Header from '@/components/public/Header';
import Services from '@/components/public/Services';
import Footer from '@/components/public/Footer';
import WhatsAppFloat from '@/components/public/WhatsAppFloat';
import CartDrawer from '@/components/public/CartDrawer';
import type { Configuracion, Servicio } from '@/lib/types';

export const revalidate = 60;

async function obtenerDatos() {
  try {
    const supabase = await createClient();
    const [configRes, serviciosRes] = await Promise.all([
      supabase.from('configuracion').select('*').limit(1).single(),
      supabase.from('servicios').select('*').eq('activo', true),
    ]);
    return {
      config: (configRes.data as Configuracion) || null,
      servicios: (serviciosRes.data as Servicio[]) || [],
    };
  } catch {
    return { config: null, servicios: [] };
  }
}

export default async function ServiciosPage() {
  const { config, servicios } = await obtenerDatos();
  const whatsapp = config?.whatsapp_contacto || '';

  return (
    <main>
      <Header config={config} />
      <Services servicios={servicios} whatsapp={whatsapp} config={config} />
      <Footer config={config} />
      <WhatsAppFloat whatsapp={whatsapp} />
      <CartDrawer whatsapp={whatsapp} colorPrimario={config?.color_primario} colorAccento={config?.color_acento} />
    </main>
  );
}

