https://maps.app.goo.gl/WiaedsnQaLLcWNRv5-- Migración: Agregar campo mapa_url a configuracion
-- Ejecutar en: SQL Editor de Supabase

ALTER TABLE configuracion ADD COLUMN IF NOT EXISTS mapa_url TEXT DEFAULT '';
