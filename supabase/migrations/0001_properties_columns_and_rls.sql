-- ════════════════════════════════════════════════════════════════════════
-- Migración PENDIENTE de aplicar en la Base A (nubiainmobiliaria / fafjujnwwcgijzvouwgb)
-- Cómo aplicarla: Supabase → SQL Editor → pega este archivo → Run.
--
-- Qué hace:
--   1. Agrega a public.properties las columnas que el dashboard necesita y que
--      no existían (published, images[], floorPlans[], amenities[], development,
--      virtualTour). Son aditivas y con defaults → no rompen el backend Express
--      (su sync usa alter con drop:false) ni otras integraciones.
--   2. Ajusta la política RLS de lectura: los visitantes anónimos solo ven
--      propiedades publicadas; el staff autenticado ve todas.
--   3. Endurece el search_path de la función del search_vector (advisor WARN).
--
-- Requiere que ya estén aplicadas las migraciones de auth/roles
-- (funciones public.is_staff() / public.is_admin()), que ya se corrieron.
-- ════════════════════════════════════════════════════════════════════════

alter table public.properties
  add column if not exists "published"    boolean not null default true,
  add column if not exists "images"       text[]  not null default '{}',
  add column if not exists "floorPlans"   text[]  not null default '{}',
  add column if not exists "amenities"    text[]  not null default '{}',
  add column if not exists "development"  varchar,
  add column if not exists "virtualTour"  varchar;

drop policy if exists properties_public_read on public.properties;
create policy properties_public_read on public.properties
  for select to anon
  using ("published" = true);

drop policy if exists properties_auth_read on public.properties;
create policy properties_auth_read on public.properties
  for select to authenticated
  using ("published" = true or public.is_staff());

alter function public.update_properties_search_vector()
  set search_path = public, pg_catalog;

-- 4. Buckets de Storage que usa la subida de imágenes/documentos del dashboard.
--    Públicos: las fotos y fichas se muestran en el sitio. La subida se hace
--    con service_role (bypassa las políticas); la lectura pública queda
--    habilitada por ser buckets públicos.
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('property-docs', 'property-docs', true)
on conflict (id) do nothing;
