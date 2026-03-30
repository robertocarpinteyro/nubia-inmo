# CHANGELOG — NUBIA Inmobiliaria

Historial de cambios del proyecto. Formato: fecha · sesión · descripción.

---

## [0.8.0] — 2026-03-29 · Sesión 8 (Redesign Navbar + Offcanvas + Listing_07 + Acceso back)

### 🎨 Redesign NUBIA — Navbar y Catálogo
- **`HeaderTwo.tsx`** — Rediseño completo: `NubiaLogo` con fallback a texto, auth buttons con avatar (iniciales, fondo morado), nombre del usuario con `color: rgba(255,255,255,0.85)` explícito, botón SVG logout, language switcher ES/EN
- **`Offcanvas.tsx`** — Panel dark sliding: `background:#0C0C0C`, `right` transition, auth section con avatar+rol+dashboard+logout, featured properties cards, footer con redes sociales y blur backdrop
- **`NavMenu.tsx`** — `MobileLogo` con fallback, link Dashboard solo para admin/vendedor
- **`listing_07/ListingSevenArea.tsx`** — Redesign editorial completo: hero banner giant title, sticky filter bar con pills Venta/Renta, `PropertyCard` con hover lift + purple glow + dot nav + specs SVG, `SkeletonCard` shimmer, paginación dark
- **`listing_07/index.tsx`** — Reemplazado HeaderFour/FooterFour con `HeaderTwo(nubia)` + `NubiaFooter`, wrapper `nubia-home`
- **`listing-details-nubia/index.tsx`** — Nueva página de detalle: galería + specs + sidebar contacto, wrapper `nubia-home`

### 🔧 Fixes
- Rutas de logos corregidas: `/logotipos/` → `/assets/images/logo/` (Nubia_Logotipo.png / Nubia_isotipo.png)
- Links de PropertyCard en listing_07 corregidos: `/listing_details_06` → `/listing_details_nubia`
- Backend puerto actualizado: 5000 → 5001 (AirPlay Receiver ocupa 5000 en macOS)
- `ReviewBody.tsx:67` — Comillas sin escapar → `&ldquo;` y `&rdquo;`

### 🛠️ Acceso al backend habilitado para el agente
- **Claude Code ahora puede leer y editar `real-estate-backend/`** directamente en todas las sesiones futuras. No es necesario pedirlo de nuevo.

### Arquitectura backend resumida
- **Entry point**: `real-estate-backend/src/server.ts` (puerto 5001 vía `.env PORT=5001`)
- **ORM**: Sequelize-TypeScript conectado a Supabase `db.fafjujnwwcgijzvouwgb.supabase.co:5432`, SSL
- **Modelos**: User, Property, PropertyMedia, VendorProperty, Favorite, Review, Visit, Lead, Sale, Permission, AiChatMessage
- **Auth**: JWT (`JWT_SECRET` en .env), middleware `authenticateUser` + `requireRole(...roles)`
- **Rutas montadas**: `/api/auth`, `/api/properties`, `/api/vendor`, `/api/favorites`, `/api/admin`, `/api/reviews`, `/api/visits`, `/api/leads`, `/api/sales`
- **DB sync**: `sequelize.sync({ alter: true })` — aplica cambios de modelo automáticamente al reiniciar

---

## [0.7.0] — 2026-03-29 · Sesión 7 (Catálogo, Detalle y Homepage conectados al DB)

### 🏠 Homepage — Nuevos Listados dinámicos
- **`NubiaProperties.tsx`** — Eliminados datos hardcodeados del template. Ahora fetchea `GET /api/properties?limit=3&featured=true` (fallback a los 3 más recientes). Imágenes, precio formateado, ubicación y título vienen de la DB. Cards linkan a `/listing_details_06?id=X`. Soporta ES/EN.
- **`StatsBar`** — Ocultada del homepage (sección 500+ / 15 años / 98% / 2B MXN eliminada).
- **Navbar "Inicio"** — `link: "/"` correcto, `has_dropdown: false`.
- **Navbar "Propiedades"** — Sin dropdown, link directo a `/listing_07`.

### 📋 Catálogo de Propiedades — `/listing_07` y `/listing_05`
- **`ListingSevenArea.tsx`** y **`ListingFiveArea.tsx`** — Reescritos completamente. Eliminado hook `UseShortedProperty` con datos estáticos. Ahora fetchean `GET /api/properties` con:
  - Filtros: texto libre, tipo de inmueble, operación (venta/renta), recámaras mínimas, rango de precio
  - Paginación server-side real
  - Ordenamiento: más recientes, precio ↑/↓
  - Empty state cuando no hay resultados
  - Cards con imagen real, precio formateado, ubicación, link a `/listing_details_06?id=X`
  - Texto en ES/EN según idioma activo
- `listing_07`: filtros en barra superior, grid de 9 por página
- `listing_05`: filtros en sidebar lateral, grid de 6 por página

### 🔍 Detalle de Propiedad — `/listing_details_06?id=X`
- **`ListingDetailsSixArea.tsx`** — Reescrito. Lee `?id=` via `useSearchParams`, fetchea `GET /api/properties/:id`. Muestra: título, precio, tipo/operación/estado, galería real, descripción, tabla de detalles (rec/baños/m²/año), mapa si hay coordenadas, sidebar con CTA "Agendar Visita" y agente.
- **`MediaGallery.tsx`** — Reescrito para recibir `media[]` como prop en lugar de imágenes estáticas. Carousel Bootstrap con thumbnails. Fancybox para ver todas las fotos.
- **`page.tsx`** — Envuelto en `<Suspense>` para compatibilidad con `useSearchParams` en Next.js App Router.
- **Offcanvas (hamburguesa)** — Links de propiedades actualizados a `/listing_details_06?id=${p.id}`.

---

## [0.6.0] — 2026-03-29 · Sesión 6 (Sistema de Traducción ES/EN + Navbar Inteligente)

### 🌐 Sistema de traducción ES ↔ EN
- **`src/context/LanguageContext.tsx`** — Nuevo: Context `LanguageProvider` + hook `useLanguage()`. Provee `lang` (es|en), `toggleLang()` y `t(key)` con lookup por dot-notation. Persiste preferencia en `localStorage` (`nubia_lang`).
- **`src/translations/es.ts`** / **`src/translations/en.ts`** — Archivos de traducciones para `nav`, `header` y `addProperty`. Base para expandir a todo el sitio.
- **`src/app/layout.tsx`** — Envuelto con `<LanguageProvider>` + `lang="es"` en el tag `<html>`.

### 🔐 Navbar con lógica de autenticación
- **`src/layouts/headers/HeaderTwo.tsx`** — Refactorizado completo:
  - Botón **Dashboard** oculto (controlado desde `NavMenu`).
  - Botón CTA contextual: admins/vendedores ven **"Publicar Propiedad"**, usuarios normales y visitantes ven **"Agendar Visita"** (link a `/contact`).
  - Estado autenticado: muestra nombre del usuario + botón "Cerrar Sesión" en lugar del link de login.
  - Botón **switcher de idioma** (ES/EN) siempre visible en la barra superior.
- **`src/layouts/headers/Menu/NavMenu.tsx`** — Link **"Dashboard"** visible solo para `role === "admin"` o `role === "vendedor"`. Menú usa `t()` para mostrar texto según idioma activo.
- **`src/data/home-data/MenuData.ts`** — Menú en español por defecto; se agrega campo `key` a cada item y sub-item para lookup en translations.

### 🏠 Campos bilingüe en propiedades
- **`real-estate-backend/src/models/Property.ts`** — Nuevos campos: `titleEn` (STRING, nullable) y `descriptionEn` (TEXT, nullable). Se crean automáticamente en Supabase con el siguiente reinicio del servidor (Sequelize `alter: true`).
- **`src/components/dashboard/add-property/AddPropertyBody.tsx`** — Formulario ahora incluye campos para título y descripción en inglés, organizados en par lado a lado con el campo español. Todos los labels pasan por `t()`.

---

## [0.5.0] — 2026-03-29 · Sesión 5 (Integración de Datos Reales Frontend & Backend)

### 🔗 Conexión del Catálogo Público y Dashboards al Backend

- **Homepage Dinámico (`Property.tsx`):** Se removió el payload estático del template original. El slider de "Nuevas Propiedades" ahora consulta dinámicamente `GET /api/properties?limit=6` al backend, renderizando solo propiedades reales de la base de datos de Supabase.
- **Catálogo de Propiedades (`ListingOneArea.tsx`):** La vista listado (`/listing_01`) ahora está conectada bidireccionalmente al backend con soporte de **paginación real** y metadatos calculados desde la base de datos de manera dinámica.
- **Vistas Empty States:** Se añadieron vistas de "estado vacío" (Empty States) amigables para el Homepage, los Dashboards y el Catálogo en caso de no haber propiedades disponibles en el sistema.
- **Correcciones de Estructura de Datos:** Se resolvió el error de lectura de propiedades en el dashboard de admin (`PropertyListBody.tsx`), catálogo y Home, alineando el frontend para que lea el objeto `data.properties` (que contiene las filas `rows` de PostgreSQL) y la meta paginación directamente tal como los emite el `PropertyController` en el backend.

---

## [0.4.0] — 2026-03-28 · Sesión 4 (Supabase Backend & Repositorio Git)

### 🛠️ Configuración y Desarrollo del Backend (Nubia Real Estate)
- **Migración a Supabase:** Se configuró y conectó exitosamente la base de datos a Supabase, resolviendo problemas de conexión y red iniciales.
- **Autenticación Basada en Roles:** Se implementó un sistema de autenticación seguro con soporte para múltiples roles de usuario (`admin`, `vendor`, y `user`).
- **Modelos de Base de Datos:** Se crearon los modelos esenciales para la plataforma: Propiedades (Properties), Multimedia (Media), Asignaciones de Vendedores (Vendor assignments) y Favoritos (Favorites).
- **Controladores y Rutas:** Se configuraron todos los controladores y rutas asociados para manejar el CRUD y la lógica de negocio de los modelos.

### 🚀 Control de Versiones y Despliegue (GitHub)
- **Inicialización de Git:** Se inicializó el repositorio local para el proyecto Fullstack.
- **Configuración de Seguridad:** Se actualizó el archivo `.gitignore` para asegurar que dependencias y variables de entorno del backend no se suban al repo.
- **Commit Inicial:** Se creó el primer commit ("Initial commit: Nubia Real Estate Fullstack Platform").
- **Subida a Remoto:** Se vinculó el proyecto al repositorio remoto y se hizo el push del código a la rama `main` en `https://github.com/robertocarpinteyro/nubia-inmo.git`.

---

## [0.3.0] — 2026-03-27 · Sesión 3 (PC — Backend & Lógica)

### Sistema completo de roles y permisos + Auth frontend conectado

Se implementó toda la arquitectura de roles (Admin, Vendedor, Usuario) con permisos extensibles, sistema de comisiones, leads, visitas, reseñas, ventas y un placeholder de chat AI. El frontend ahora está conectado al backend: login/signup guardan el token JWT en localStorage y redirigen al dashboard.

#### Base de datos — 6 tablas nuevas + 3 tablas modificadas

| Tabla nueva | Propósito |
|-------------|-----------|
| `reviews` | Reseñas de usuarios en propiedades (rating 1-5, visibilidad admin) |
| `visits` | Agenda de visitas con *priority scoring* (más visitas = más valor para admin) |
| `leads` | Sistema de leads (website / manual / referral) con asignación a vendedores |
| `sales` | Registro de ventas con cálculo automático de comisión |
| `permissions` | Permisos extensibles por rol (sin tocar código) |
| `ai_chat_messages` | Placeholder para chat AI futuro del vendedor |

| Tabla modificada | Columnas nuevas |
|------------------|-----------------|
| `users` | `isActive`, `hasPurchased` |
| `properties` | `landingPageUrl`, `videoUrls`, `mediaFolderUrl`, `technicalSheet` |
| `vendor_properties` | `isExclusive`, `vendorCommission` (4% base), `propertiesSold` |

#### Backend — Archivos nuevos (`real-estate-backend/src/`)

**Models:**
- `models/Review.ts` · `models/Visit.ts` · `models/Lead.ts`
- `models/Sale.ts` · `models/Permission.ts` · `models/AiChatMessage.ts`

**Controllers:**
- `controllers/AdminController.ts` — 10 funciones: CRUD vendedores, lista usuarios (filtrar por agendaron/compraron), lista vendedores con stats, ajustar comisión, dashboard economía
- `controllers/ReviewController.ts` — CRUD reseñas + toggle visibilidad admin
- `controllers/VisitController.ts` — Agendar visita + priority scoring + admin CRUD
- `controllers/LeadController.ts` — CRUD leads + asignación vendedor
- `controllers/SaleController.ts` — Registrar venta (auto-calcula comisión, marca propiedad como vendida, marca comprador)

**Routes:**
- `routes/adminRoutes.ts` · `routes/reviewRoutes.ts` · `routes/visitRoutes.ts`
- `routes/leadRoutes.ts` · `routes/saleRoutes.ts`

#### Backend — Archivos modificados

- `models/User.ts` — +`isActive`, `hasPurchased`, relaciones a Review/Visit/Lead/Sale
- `models/Property.ts` — +`landingPageUrl`, `videoUrls`, `mediaFolderUrl`, `technicalSheet`
- `models/VendorProperty.ts` — +`isExclusive`, `vendorCommission`, `propertiesSold`
- `controllers/VendorController.ts` — +propiedades disponibles con conteo de vendedores, detalle completo (mapa/ficha/media/landing), solicitar exclusividad (+1%), chat AI placeholder
- `routes/vendorRoutes.ts` — +7 endpoints nuevos
- `middleware/roleMiddleware.ts` — +`checkPermission()` middleware extensible
- `config/database.ts` — +6 modelos registrados
- `server.ts` — +5 rutas montadas, versión → 2.0.0

#### Frontend — Auth conectado al backend

- **`src/context/AuthContext.tsx`** — **Nuevo**: React Context con persistencia en localStorage. Provee: `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `getAuthHeaders()`
- `src/app/layout.tsx` — Envuelto con `<AuthProvider>` dentro del Redux Provider
- `src/components/forms/LoginForm.tsx` — Ahora guarda token+usuario al hacer login, redirige al dashboard
- `src/components/forms/RegisterForm.tsx` — Ahora guarda token+usuario al registrarse, redirige al dashboard

#### Cuentas de prueba en la base de datos

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin_test@nubia.com` | `admin123` |
| Vendedor | `vendor_test@nubia.com` | `vendor123` |
| Usuario | `user_test@nubia.com` | `user123` |

#### API Base URL

```
http://localhost:5000/api
```

#### Tabla completa de endpoints REST

**Auth (público):**
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/signup` | Registro (default role: usuario) |
| POST | `/api/auth/login` | Login → devuelve JWT + user |
| GET | `/api/auth/me` | Obtener usuario autenticado |

**Admin (`/api/admin/`) — requiere role=admin:**
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/admin/vendors` | Crear vendedor |
| PUT | `/api/admin/users/:id/deactivate` | Desactivar usuario |
| PUT | `/api/admin/users/:id/reactivate` | Reactivar usuario |
| GET | `/api/admin/users` | Listar usuarios (?filter=agendaron\|compraron&search=) |
| PUT | `/api/admin/users/:id/purchased` | Marcar como comprador |
| GET | `/api/admin/vendors` | Listar vendedores con stats |
| PUT | `/api/admin/vendors/:vId/properties/:pId/commission` | Ajustar comisión |
| POST | `/api/admin/vendors/:vId/properties/:pId` | Asignar propiedad a vendedor |
| DELETE | `/api/admin/vendors/:vId/properties/:pId` | Quitar propiedad de vendedor |
| GET | `/api/admin/economy` | Dashboard económico |

**Vendedor (`/api/vendor/`) — requiere role=vendedor:**
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/vendor/available-properties` | Propiedades disponibles + comisión + vendedores |
| GET | `/api/vendor/properties` | Mis propiedades asignadas |
| POST | `/api/vendor/properties/:id` | Ofertar propiedad |
| GET | `/api/vendor/properties/:id/detail` | Detalle completo (mapa, ficha, media, landing) |
| PUT | `/api/vendor/properties/:id/exclusivity` | Solicitar exclusividad (+1% comisión) |
| GET | `/api/vendor/commission/:id` | Ver comisión de una propiedad |
| PUT | `/api/vendor/properties/:id` | Actualizar estado |
| DELETE | `/api/vendor/properties/:id` | Dejar propiedad |
| POST | `/api/vendor/ai-chat` | Chat AI (placeholder) |
| GET | `/api/vendor/ai-chat` | Historial chat AI |

**Propiedades (`/api/properties/`) — público GET, admin POST/PUT/DELETE:**
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/properties` | Listar con filtros y paginación |
| GET | `/api/properties/:id` | Detalle público |
| POST | `/api/properties` | Crear (admin) |
| PUT | `/api/properties/:id` | Editar (admin) |
| DELETE | `/api/properties/:id` | Eliminar (admin) |

**Favoritos, Reseñas, Visitas, Leads, Ventas:**
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST/DELETE | `/api/favorites/` | Favoritos del usuario |
| GET | `/api/reviews/property/:id` | Reseñas de una propiedad (público) |
| POST | `/api/reviews/` | Crear reseña (autenticado) |
| GET | `/api/reviews/me` | Mis reseñas |
| POST | `/api/visits/` | Agendar visita (usuario) |
| GET | `/api/visits/me` | Mis visitas |
| POST | `/api/leads/` | Crear lead (vendedor/admin) |
| GET | `/api/leads/me` | Mis leads (vendedor) |
| POST | `/api/sales/` | Registrar venta (admin) |
| GET | `/api/sales/vendor` | Mis ventas (vendedor) |

---

### 🖥️ INSTRUCCIONES PARA EL AGENTE DE LA MACBOOK (Frontend / UI / UX)

El backend está completo y funcionando. Todo el flujo de autenticación ya está conectado: login/signup guardan JWT en `localStorage` y redirigen al dashboard. Tu trabajo es darle vida visual a los dashboards de cada rol.

#### Cómo arrancar el proyecto

```bash
# Terminal 1 — Backend (puerto 5000)
cd real-estate-backend
npx ts-node src/server.ts

# Terminal 2 — Frontend (puerto 3000)
npm run dev
```

#### AuthContext disponible — Cómo usarlo

```tsx
import { useAuth, API_BASE_URL } from "@/context/AuthContext";

const MiComponente = () => {
  const { user, token, isAuthenticated, logout, getAuthHeaders } = useAuth();

  // user.role → "admin" | "vendedor" | "usuario"
  // user.id, user.name, user.email

  // Para llamar endpoints protegidos:
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
};
```

#### Tareas pendientes del frontend

**1. Dashboard por rol (PRIORIDAD ALTA)**
El dashboard actual (`/dashboard/dashboard-index`) muestra datos estáticos del template (1.7k propiedades, etc). Necesita mostrar datos reales del backend según el rol:

- **Admin**: usar `GET /api/admin/economy` para las cards superiores (total propiedades, ventas, comisiones, vendedores activos). Usar `GET /api/admin/users` y `GET /api/admin/vendors` para las listas.
- **Vendedor**: usar `GET /api/vendor/properties` para "mis propiedades", `GET /api/vendor/available-properties` para explorar, `GET /api/leads/me` para leads.
- **Usuario**: usar `GET /api/favorites/` para favoritos, `GET /api/visits/me` para visitas, `GET /api/reviews/me` para reseñas.

**2. Sidebar / navegación por rol**
El sidebar actual tiene links genéricos. Ajustar según rol:
- Admin: Dashboard, Propiedades, Añadir Propiedad, Vendedores, Usuarios, Economía
- Vendedor: Dashboard, Mis Propiedades, Explorar Propiedades, Leads, Ventas, Chat AI
- Usuario: Dashboard, Favoritos, Mis Visitas, Mis Reseñas, Perfil

**3. Protección de rutas**
Agregar un componente `ProtectedRoute` o verificar `isAuthenticated` al entrar a `/dashboard/*`. Si no hay sesión, redirigir a login.

**4. Formularios de admin**
- Crear vendedor: formulario que haga `POST /api/admin/vendors`
- Crear propiedad: formulario existente (`/dashboard/add-property`) conectar a `POST /api/properties`
- Registrar venta: formulario que haga `POST /api/sales`

**5. Vista de vendedor**
- Cards de propiedades disponibles con botón "Ofertar" (`POST /api/vendor/properties/:id`)
- Botón "Solicitar Exclusividad" (`PUT /api/vendor/properties/:id/exclusivity`)
- Detalle de propiedad con mapa, ficha técnica, media, landing (`GET /api/vendor/properties/:id/detail`)

**6. Componentes que NO borrar (deshabilitados pero útiles)**
Los componentes del template en `/dashboard/` (message, membership, saved-search, review) están deshabilitados pero NO se deben borrar — se pueden reutilizar en el futuro.

---


## [0.2.0] — 2026-03-27 · Sesión 2

### Rediseño visual completo del homepage (Exaggerated Minimalism)

Inspirado en la referencia `referencias/1.webp` (estilo "Foundation" proptech).
Paleta: negro `#0C0C0C` · morado `#7B4FFF` · sage `#D2DDD0` · off-white `#F5F5F2`.
Tipografía editorial: Gordita 900, font-size clamp(3.5rem → 130px), uppercase.

#### SCSS / Estilos
- `public/assets/scss/_variables.scss` — +12 variables de marca NUBIA (`$nubia-dark`, `$nubia-purple`, `$nubia-sage`, etc.)
- `public/assets/scss/_nubia.scss` — **Nuevo** archivo de sistema de diseño NUBIA (~500 líneas): hero, stats bar, property cards, feature blocks, marquee, process, testimonial, CTA banner, footer, responsive breakpoints
- `public/assets/scss/style.scss` — Import de `_nubia` al final del pipeline

#### Componentes — Homepage (`src/components/homes/home-two/`)
- `HeroBanner.tsx` — Reescrito: hero oscuro fullscreen, texto gigante "ABRIENDO / NUEVAS / PUERTAS", badge animado, buscador de propiedades integrado, ilustración 3D posicionada absolutamente, scroll indicator
- `StatsBar.tsx` — **Nuevo**: barra de 4 estadísticas animadas (500+ propiedades · 15 años · 98% satisfacción · $2B MXN)
- `NubiaProperties.tsx` — **Nuevo**: 3 property cards dark con precio, título, ubicación, recámaras/baños/m²
- `NubiaFeatures.tsx` — **Nuevo**: bloque Crédito Hipotecario (fondo sage) + bloque Inversión (fondo oscuro) + marquee strip morado con tipos de propiedad
- `NubiaProcess.tsx` — **Nuevo**: 4 pasos del proceso de compra + card CTA morado "Agendar Consulta"
- `NubiaTestimonial.tsx` — **Nuevo**: blockquote + 3 contadores animados (propiedades vendidas, familias, años)
- `NubiaCtaBanner.tsx` — **Nuevo**: texto gigante "¿Tienes alguna consulta?" + formulario de email
- `NubiaFooter.tsx` — **Nuevo**: footer dark completo (brand, Propiedades, Empresa, Servicios, Contacto), redes sociales, legal
- `index.tsx` — Composición actualizada con wrapper `.nubia-home` para aislamiento de estilos

#### Layout / Header
- `src/layouts/headers/HeaderTwo.tsx` — Prop `nubia={true}` → renderiza logo texto "NUBIA" en lugar de imagen SVG; estilos dark del menú sticky controlados por CSS

#### App
- `src/app/page.tsx` — Metadata actualizada: título y descripción NUBIA
- `tsconfig.json` — Excluye `real-estate-backend/` del compilador TS (evita error pre-existente de tipos)

#### Bugfix preexistente
- `src/components/inner-pages/about-us/about-us-one/index.tsx` — Removido prop inválido `style` en `<Feedback />` (error de tipos TS del template original)

---

## [0.1.0] — 2026-03-27 · Sesión 1

### Commit inicial del proyecto

- Setup fullstack: Next.js 14 (App Router) + Express backend
- Template base HOZN Real Estate adaptado para NUBIA
- Estructura de rutas: home, listings (17 variantes), listing details (6), dashboard, blog, agentes, agencias, servicios, proyectos, FAQ, pricing, contact
- Backend: Sequelize + PostgreSQL, autenticación JWT
- Dependencias principales: Bootstrap 5, Redux Toolkit, React Hook Form, Axios, React Slick, Chart.js
