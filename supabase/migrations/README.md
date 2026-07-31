# Migraciones Supabase — Base A (producción: nubiainmobiliaria / `fafjujnwwcgijzvouwgb`)

Registro de los cambios de esquema de la consolidación en Supabase.

## Ya aplicadas (corridas contra la Base A)

Estas se ejecutaron durante la reparación de auth/seguridad y **ya están en la base**:

1. **auth_consolidation_step1** — migró los usuarios reales a Supabase Auth
   conservando su hash bcrypt; agregó `public.users.auth_id`; trigger
   `handle_new_user` (crea perfil con rol `usuario` en cada alta); funciones
   `current_app_role() / is_staff() / is_admin()`.
2. **auth_consolidation_step2** — activó RLS en las 11 tablas de negocio, con
   lectura pública solo donde el sitio la necesita.
3. **auth_consolidation_step3** — revocó `EXECUTE` público a las funciones de rol.

## Pendiente de aplicar

- **`0001_properties_columns_and_rls.sql`** — agrega a `properties` las columnas
  del dashboard (published, images[], floorPlans[], amenities[], development,
  virtualTour) y afina la RLS de lectura. **Corre este archivo antes de probar
  el alta/edición de propiedades con el frontend nuevo.**

### Cómo aplicar

Supabase → **SQL Editor** → pega el contenido del `.sql` → **Run**.
