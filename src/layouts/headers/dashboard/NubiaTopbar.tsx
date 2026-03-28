"use client"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

interface Props {
   title: string
   onMenuToggle: () => void
}

const NubiaTopbar = ({ title, onMenuToggle }: Props) => {
   const { user, logout } = useAuth()
   const [menuOpen, setMenuOpen] = useState(false)

   const initials = user?.name
      ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
      : "N"

   return (
      <header className="nubia-topbar">
         <button className="menu-toggle" onClick={onMenuToggle} aria-label="Abrir menú">
            <i className="bi bi-list"></i>
         </button>

         <span className="page-title">{title}</span>

         <div className="topbar-right">
            <Link href="/" className="topbar-btn" title="Ver sitio" aria-label="Ver sitio">
               <i className="bi bi-house"></i>
            </Link>

            <div className="position-relative">
               <button
                  className="topbar-avatar"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Menú de usuario"
               >
                  {initials}
               </button>

               {menuOpen && (
                  <>
                     <div
                        style={{ position: "fixed", inset: 0, zIndex: 499 }}
                        onClick={() => setMenuOpen(false)}
                     />
                     <div className="topbar-user-menu">
                        <div className="menu-user-info">
                           <div className="menu-name">{user?.name}</div>
                           <div className="menu-email">{user?.email}</div>
                        </div>
                        <Link href="/dashboard/profile" onClick={() => setMenuOpen(false)}>
                           <i className="bi bi-person"></i> Perfil
                        </Link>
                        <Link href="/dashboard/account-settings" onClick={() => setMenuOpen(false)}>
                           <i className="bi bi-gear"></i> Configuración
                        </Link>
                        <button className="danger" onClick={logout}>
                           <i className="bi bi-box-arrow-left"></i> Cerrar Sesión
                        </button>
                     </div>
                  </>
               )}
            </div>
         </div>
      </header>
   )
}

export default NubiaTopbar
