"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

interface NavItem {
   href: string
   icon: string
   label: string
}

const adminNav: NavItem[] = [
   { href: "/dashboard/dashboard-index", icon: "bi-grid-1x2", label: "Dashboard" },
   { href: "/dashboard/properties-list", icon: "bi-building", label: "Propiedades" },
   { href: "/dashboard/add-property", icon: "bi-plus-circle", label: "Añadir Propiedad" },
   { href: "/dashboard/vendors", icon: "bi-people", label: "Vendedores" },
   { href: "/dashboard/users", icon: "bi-person-lines-fill", label: "Usuarios" },
   { href: "/dashboard/economy", icon: "bi-bar-chart-line", label: "Economía" },
]

const vendorNav: NavItem[] = [
   { href: "/dashboard/dashboard-index", icon: "bi-grid-1x2", label: "Dashboard" },
   { href: "/dashboard/properties-list", icon: "bi-building", label: "Mis Propiedades" },
   { href: "/dashboard/available-properties", icon: "bi-search", label: "Explorar" },
   { href: "/dashboard/leads", icon: "bi-funnel", label: "Leads" },
   { href: "/dashboard/sales", icon: "bi-cash-stack", label: "Ventas" },
   { href: "/dashboard/ai-chat", icon: "bi-stars", label: "Chat AI" },
]

const userNav: NavItem[] = [
   { href: "/dashboard/dashboard-index", icon: "bi-grid-1x2", label: "Dashboard" },
   { href: "/dashboard/favourites", icon: "bi-heart", label: "Favoritos" },
   { href: "/dashboard/visits", icon: "bi-calendar-check", label: "Mis Visitas" },
   { href: "/dashboard/review", icon: "bi-star", label: "Mis Reseñas" },
   { href: "/dashboard/profile", icon: "bi-person", label: "Perfil" },
   { href: "/dashboard/account-settings", icon: "bi-gear", label: "Configuración" },
]

interface Props {
   isOpen: boolean
   onClose: () => void
}

const NubiaSidebar = ({ isOpen, onClose }: Props) => {
   const pathname = usePathname()
   const { user, logout } = useAuth()

   const navItems =
      user?.role === "admin"
         ? adminNav
         : user?.role === "vendedor"
         ? vendorNav
         : userNav

   const roleLabel =
      user?.role === "admin"
         ? "Administrador"
         : user?.role === "vendedor"
         ? "Vendedor"
         : "Usuario"

   const initials = user?.name
      ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
      : "N"

   return (
      <>
         {/* Overlay mobile */}
         {isOpen && (
            <div
               style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199 }}
               onClick={onClose}
            />
         )}

         <aside className={`nubia-sidebar ${isOpen ? "sidebar-open" : ""}`}>
            {/* Logo */}
            <div className="sidebar-logo">
               <Link href="/">NUBIA</Link>
               <button className="close-sidebar" onClick={onClose} aria-label="Cerrar menú">
                  <i className="bi bi-x-lg"></i>
               </button>
            </div>

            {/* User info */}
            <div className="sidebar-user">
               <div className="avatar">{initials}</div>
               <div className="user-info">
                  <div className="name">{user?.name || "Usuario"}</div>
                  <div className="role-badge">{roleLabel}</div>
               </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, paddingTop: "8px" }}>
               <ul>
                  {navItems.map((item) => (
                     <li key={item.href}>
                        <Link
                           href={item.href}
                           className={pathname === item.href ? "active" : ""}
                           onClick={onClose}
                        >
                           <i className={`bi ${item.icon}`}></i>
                           <span>{item.label}</span>
                        </Link>
                     </li>
                  ))}
               </ul>
            </nav>

            {/* Bottom: logout */}
            <div className="sidebar-bottom">
               <button className="logout-btn" onClick={logout}>
                  <i className="bi bi-box-arrow-left"></i>
                  Cerrar Sesión
               </button>
            </div>
         </aside>
      </>
   )
}

export default NubiaSidebar
