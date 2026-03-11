import { createClient } from '@/lib/supabase/server';
import Header from '@/components/public/Header';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import WhatsAppFloat from '@/components/public/WhatsAppFloat';
import CartDrawer from '@/components/public/CartDrawer';
import type { Configuracion } from '@/lib/types';

export const revalidate = 60;

async function obtenerDatos() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('configuracion').select('*').limit(1).single();
    return { config: (data as Configuracion) || null };
  } catch {
    return { config: null };
  }
}

export default async function ContactoPage() {
  const { config } = await obtenerDatos();
  const whatsapp = config?.whatsapp_contacto || '';

  return (
    <main>
      <Header config={config} />
      <Contact config={config} />
      <Footer config={config} />
      <WhatsAppFloat whatsapp={whatsapp} />
      <CartDrawer whatsapp={whatsapp} colorPrimario={config?.color_primario} colorAccento={config?.color_acento} />
    </main>
  );
}
