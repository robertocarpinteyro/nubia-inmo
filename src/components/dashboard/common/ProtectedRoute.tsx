"use client"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface Props {
   children: React.ReactNode
   allowedRoles?: ("admin" | "vendedor" | "usuario")[]
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
   const { isAuthenticated, isLoading, user } = useAuth()
   const router = useRouter()

   useEffect(() => {
      if (isLoading) return
      if (!isAuthenticated) {
         router.push("/")
         return
      }
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
         router.push("/dashboard/dashboard-index")
      }
   }, [isAuthenticated, isLoading, user, allowedRoles, router])

   if (isLoading) {
      return (
         <div className="nubia-loading" style={{ minHeight: "100vh", alignItems: "center" }}>
            <div className="spinner"></div>
         </div>
      )
   }

   if (!isAuthenticated) return null
   if (allowedRoles && user && !allowedRoles.includes(user.role)) return null

   return <>{children}</>
}

export default ProtectedRoute
