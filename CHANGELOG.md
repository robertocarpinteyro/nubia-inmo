# CHANGELOG — NUBIA Inmobiliaria

Historial de cambios del proyecto. Formato: fecha · sesión · descripción.

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
