"use client"
import { useState } from "react"
import NubiaSidebar from "@/layouts/headers/dashboard/NubiaSidebar"
import NubiaTopbar from "@/layouts/headers/dashboard/NubiaTopbar"
import ProtectedRoute from "./ProtectedRoute"

interface Props {
   title: string
   children: React.ReactNode
   allowedRoles?: ("admin" | "vendedor" | "usuario")[]
}

const DashboardLayout = ({ title, children, allowedRoles }: Props) => {
   const [sidebarOpen, setSidebarOpen] = useState(false)

   return (
      <ProtectedRoute allowedRoles={allowedRoles}>
         <div className="nubia-dash-wrap">
            <NubiaSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="nubia-dash-main">
               <NubiaTopbar title={title} onMenuToggle={() => setSidebarOpen(true)} />
               <main className="nubia-dash-content">
                  {children}
               </main>
            </div>
         </div>
      </ProtectedRoute>
   )
}

export default DashboardLayout
