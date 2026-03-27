# CHANGELOG — NUBIA Inmobiliaria

Historial de cambios del proyecto. Formato: fecha · sesión · descripción.

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
