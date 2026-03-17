// Tipos de datos para la aplicación

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  orden: number;
  created_at: string;
}

export interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  categoria_id: string | null;
  imagen_url: string | null;
  destacado: boolean;
  activo: boolean;
  precio_descuento: number | null;
  created_at: string;
  categorias?: Categoria;
  imagenes?: ProductoImagen[];
}

export interface ProductoImagen {
  id: string;
  producto_id: string;
  imagen_url: string;
  orden: number;
  created_at: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  activo: boolean;
  created_at: string;
  imagenes?: ServicioImagen[];
}

export interface ServicioImagen {
  id: string;
  servicio_id: string;
  imagen_url: string;
  orden: number;
  created_at: string;
}

export interface Configuracion {
  id: string;
  nombre_negocio: string;
  slogan: string;
  whatsapp_contacto: string;
  telefono: string;
  logo_url: string | null;
  direccion: string;
  mapa_url: string | null;
  horario: Record<string, string>;
  barra_bienvenida: string;

  // Hero
  hero_titulo: string;
  hero_subtitulo: string;
  hero_imagen_url: string | null;
  hero_imagen_posicion: string;
  hero_carrusel_imagenes: string[];
  hero_badge: string;
  hero_boton_texto: string;
  hero_boton_link: string;
  hero_boton_secundario_texto: string;
  hero_boton_secundario_link: string;

  // Estadísticas Hero
  stats: { valor: string; etiqueta: string }[];

  // Colores personalizables
  color_primario: string;
  color_secundario: string;
  color_acento: string;
  color_fondo: string;
  color_texto: string;

  // Textos de secciones
  texto_categorias_titulo: string;
  texto_categorias_subtitulo: string;
  texto_catalogo_titulo: string;
  texto_catalogo_subtitulo: string;
  texto_servicios_titulo: string;
  texto_servicios_subtitulo: string;
  texto_contacto_titulo: string;
  texto_contacto_subtitulo: string;

  // Footer
  texto_footer: string;

  // Redes sociales
  redes_sociales: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };

  created_at: string;
}
