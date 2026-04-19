-- ============================================
-- MIGRACIÓN: Categorías muchos-a-muchos
-- Un producto puede pertenecer a varias categorías.
--
-- Se mantiene productos.categoria_id como "categoría principal"
-- (para breadcrumb / URL canónica / SEO) y se añade la tabla
-- pivote producto_categorias como fuente de verdad de TODAS las
-- categorías asociadas al producto (incluida la principal).
--
-- Seguro de ejecutar varias veces (idempotente).
-- Ejecutar en: SQL Editor de Supabase
-- ============================================

-- 1. TABLA PIVOTE
-- ============================================
CREATE TABLE IF NOT EXISTS producto_categorias (
  producto_id  UUID NOT NULL REFERENCES productos(id)  ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (producto_id, categoria_id)
);

-- Índices para acelerar los filtros por categoría y por producto
CREATE INDEX IF NOT EXISTS idx_prod_cat_producto   ON producto_categorias(producto_id);
CREATE INDEX IF NOT EXISTS idx_prod_cat_categoria  ON producto_categorias(categoria_id);


-- 2. MIGRAR DATOS EXISTENTES
-- Copia la categoría única actual a la tabla pivote.
-- ============================================
INSERT INTO producto_categorias (producto_id, categoria_id)
SELECT id, categoria_id
FROM productos
WHERE categoria_id IS NOT NULL
ON CONFLICT (producto_id, categoria_id) DO NOTHING;


-- 3. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE producto_categorias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública producto_categorias"   ON producto_categorias;
DROP POLICY IF EXISTS "Admin insertar producto_categorias"    ON producto_categorias;
DROP POLICY IF EXISTS "Admin actualizar producto_categorias"  ON producto_categorias;
DROP POLICY IF EXISTS "Admin eliminar producto_categorias"    ON producto_categorias;

CREATE POLICY "Lectura pública producto_categorias"
  ON producto_categorias FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin insertar producto_categorias"
  ON producto_categorias FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin actualizar producto_categorias"
  ON producto_categorias FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin eliminar producto_categorias"
  ON producto_categorias FOR DELETE TO authenticated USING (true);


-- 4. VERIFICACIÓN (opcional — muestra la mezcla)
-- ============================================
-- SELECT p.nombre, STRING_AGG(c.nombre, ', ') AS categorias
-- FROM productos p
-- LEFT JOIN producto_categorias pc ON pc.producto_id = p.id
-- LEFT JOIN categorias c           ON c.id          = pc.categoria_id
-- GROUP BY p.id, p.nombre
-- ORDER BY p.nombre;
