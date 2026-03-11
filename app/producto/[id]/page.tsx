import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import WhatsAppFloat from '@/components/public/WhatsAppFloat';
import CartDrawer from '@/components/public/CartDrawer';
import ProductCard from '@/components/public/ProductCard';
import AddToCartButton from './AddToCartButton';
import type { Configuracion, Producto, ProductoImagen } from '@/lib/types';
import { notFound } from 'next/navigation';
import ProductGallery from './ProductGallery';

export const revalidate = 60;

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductoDetalle({ params }: PageProps) {
    const { id } = await params;

    let producto: Producto | null = null;
    let config: Configuracion | null = null;
    let relacionados: Producto[] = [];
    let imagenes: ProductoImagen[] = [];

    try {
        const supabase = await createClient();

        const [productoRes, configRes] = await Promise.all([
            supabase.from('productos').select('*, categorias(nombre)').eq('id', id).single(),
            supabase.from('configuracion').select('*').limit(1).single(),
        ]);

        if (!productoRes.data) {
            notFound();
        }

        producto = productoRes.data as Producto;
        config = (configRes.data as Configuracion) || null;

        // Cargar imágenes de la galería
        const { data: imagenesData } = await supabase
            .from('producto_imagenes')
            .select('*')
            .eq('producto_id', id)
            .order('orden');
        imagenes = (imagenesData as ProductoImagen[]) || [];

        // Productos relacionados
        if (producto.categoria_id) {
            const relacionadosRes = await supabase
                .from('productos')
                .select('*, categorias(nombre)')
                .eq('activo', true)
                .eq('categoria_id', producto.categoria_id)
                .neq('id', producto.id)
                .limit(4);
            relacionados = (relacionadosRes.data as Producto[]) || [];
        }
    } catch {
        notFound();
    }

    if (!producto) notFound();

    // Construir lista de todas las imágenes (galería + imagen principal como fallback)
    const todasLasImagenes = imagenes.length > 0
        ? imagenes.map(img => img.imagen_url)
        : producto.imagen_url
            ? [producto.imagen_url]
            : [];

    const whatsapp = config?.whatsapp_contacto || '';
    const numero = whatsapp.replace(/\D/g, '');
    const enStock = producto.stock > 0;
    const mensajeWa = encodeURIComponent(`Hola, me interesa el producto: ${producto.nombre}`);

    return (
        <main>
            <Header config={config} />

            <section className="py-8 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                        <Link href="/" className="hover:text-amber-600 transition-colors">Inicio</Link>
                        <span>/</span>
                        <Link href="/#catalogo" className="hover:text-amber-600 transition-colors">Catálogo</Link>
                        <span>/</span>
                        <span className="text-[#1a365d] font-medium">{producto.nombre}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Galería de imágenes */}
                        {todasLasImagenes.length > 0 ? (
                            <ProductGallery imagenes={todasLasImagenes} nombre={producto.nombre} destacado={producto.destacado} enStock={enStock} />
                        ) : (
                            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Info del producto */}
                        <div className="flex flex-col">
                            {producto.categorias && (
                                <span className="inline-flex items-center gap-1.5 text-sm text-amber-600 font-medium mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    {(producto.categorias as unknown as { nombre: string }).nombre}
                                </span>
                            )}

                            <h1 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-4">
                                {producto.nombre}
                            </h1>

                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-bold text-amber-600">
                                    ${producto.precio.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-400">MXN</span>
                            </div>

                            <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-gray-50">
                                <span className={`w-2 h-2 rounded-full ${enStock ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-sm text-gray-600">
                                    {enStock ? `En Stock — ${producto.stock} unidades disponibles` : 'Producto agotado temporalmente'}
                                </span>
                            </div>

                            {producto.descripcion && (
                                <div className="mb-8">
                                    <h3 className="font-semibold text-[#1a365d] mb-2">Descripción</h3>
                                    <p className="text-gray-500 leading-relaxed">{producto.descripcion}</p>
                                </div>
                            )}

                            {enStock ? (
                                <div className="space-y-3">
                                    <AddToCartButton producto={producto} colorAccento={config?.color_acento} />
                                    <a
                                        href={`https://wa.me/${numero}?text=${mensajeWa}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                        </svg>
                                        Comprar directo por WhatsApp
                                    </a>
                                </div>
                            ) : (
                                <button disabled className="w-full py-4 px-6 rounded-xl bg-gray-200 text-gray-400 font-bold text-lg cursor-not-allowed">
                                    Producto no disponible
                                </button>
                            )}

                            <Link href="/#catalogo" className="mt-4 text-center text-sm text-gray-400 hover:text-amber-600 transition-colors">
                                ← Volver al catálogo
                            </Link>
                        </div>
                    </div>

                    {relacionados.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-[#1a365d] mb-6">Productos Relacionados</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {relacionados.map((prod) => (
                                    <ProductCard key={prod.id} producto={prod} whatsapp={whatsapp} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer config={config} />
            <WhatsAppFloat whatsapp={whatsapp} />
            <CartDrawer whatsapp={whatsapp} colorPrimario={config?.color_primario} colorAccento={config?.color_acento} />
        </main>
    );
}
