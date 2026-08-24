# 🌸 Sublilove | Plataforma E-commerce de Sublimación y Papelería

Plataforma web moderna y de alto rendimiento para catálogo y personalización de productos de sublimación y papelería fina, construida con **Next.js 16**, **TypeScript**, **React 19** y **Supabase** (PostgreSQL + Auth).

---

## 🚀 Características Principales

- **🛍️ Catálogo Interactivo:** Filtrado en vivo por categorías (*Sublimación*, *Papelería*, *Todos*), búsqueda instantánea y paginación 3x3 optimizada.
- **⚡ Rendimiento Ultrarrápido:** Navegación en menos de 1 ms gracias a caché inteligente en memoria, pre-carga de rutas (`prefetch`) y componentes del servidor (RSC).
- **🔒 Seguridad Robusta:** 
  - Protección de rutas y componentes del servidor (`/admin`) antes de renderizar.
  - Endpoints de API protegidos (`/api/admin/users`, `/api/admin/settings`) con verificación estricta de roles.
  - Políticas de seguridad a nivel de fila (**Row Level Security - RLS**) en PostgreSQL.
  - Sincronización y eliminación en cascada bidireccional mediante triggers de PostgreSQL.
- **📱 100% Adaptativo (Responsive):** Menú inteligente para dispositivos móviles y tablets hasta 1024px, diseño fluido y soporte completo para **Modo Claro** y **Modo Oscuro**.
- **💱 Conversión de Monedas Dinámica:** Soporte para **USD ($)** y **Bolívares (Bs.)** con actualización de la tasa oficial del BCV.
- **💬 Integración Directa con WhatsApp:** Enlaces inteligentes para realizar consultas y pedidos detallados por producto.
- **🔍 SEO Avanzado:** Metadatos dinámicos, Open Graph, Twitter Cards, Sitemap XML generado dinámicamente y datos estructurados JSON-LD Schema.org.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router + Turbopack)](https://nextjs.org/) |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) |
| **Librería UI** | [React 19](https://react.dev/) |
| **Estilos** | CSS Modules + Custom Design Tokens |
| **Base de Datos & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + GoTrue) |
| **Iconos** | [Lucide React](https://lucide.dev/) |
| **Gestor de Paquetes** | [pnpm](https://pnpm.io/) |

---

## 📁 Estructura del Proyecto (Atomic Design)

```
subli-v2-next/
├── public/                  # Archivos estáticos e imágenes optimizadas
├── src/
│   ├── app/                 # Rutas de Next.js App Router
│   │   ├── (auth)/          # Rutas de autenticación (login, registro, perfil)
│   │   ├── admin/           # Panel de administración protegido (SSR)
│   │   ├── api/             # Endpoints backend seguros (/api/admin, /api/settings)
│   │   ├── catalogo/        # Vista del catálogo con filtros
│   │   ├── producto/[id]/   # Ficha detallada de producto
│   │   ├── layout.tsx       # Layout raíz con providers globales
│   │   └── page.tsx         # Página de inicio
│   ├── components/          # Arquitectura Atomic Design
│   │   ├── atoms/           # Botones, inputs, badges, precios, avatares
│   │   ├── molecules/       # FormField, ProductCard, Toggles de moneda/tema
│   │   ├── organisms/       # Navbar, Footer, Tablas de gestión, Formularios
│   │   └── templates/       # AuthLayout, AdminLayout, MainLayout
│   ├── context/             # Contextos de React (Auth, Moneda, Tema, Toasts)
│   ├── data/                # Consultas y capa de caché de productos
│   ├── hooks/               # Custom hooks reutilizables (useAuth, useCurrency, etc.)
│   └── lib/                 # Clientes de Supabase, validadores y utilidades
└── supabase/
    └── schema.sql           # Esquema completo de PostgreSQL con RLS y Triggers
```

---

## ⚙️ Configuración e Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/subli-v2-next.git
cd subli-v2-next
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Variables de Entorno
Copia el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Configura tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
NEXT_PUBLIC_SITE_URL=https://sublimaci-n-seven.vercel.app
NEXT_PUBLIC_WHATSAPP_PHONE=584243695379
```

### 4. Configurar la Base de Datos
Ejecuta el script SQL ubicado en [`supabase/schema.sql`](supabase/schema.sql) dentro del **SQL Editor** del panel de Supabase. Esto creará:
- Tablas: `Users`, `Products`, `Settings`.
- Triggers automáticos de sincronización y eliminación en cascada.
- Políticas de seguridad Row Level Security (RLS).

---

## 💻 Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo con Turbopack
pnpm dev

# Construir para producción
pnpm build

# Iniciar servidor en modo producción
pnpm start

# Verificar tipado TypeScript
pnpm tsc --noEmit
```

---

## 📄 Licencia
Este proyecto es privado y propiedad de **Sublilove**. Todos los derechos reservados.
