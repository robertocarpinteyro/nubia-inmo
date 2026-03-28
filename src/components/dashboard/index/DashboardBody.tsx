"use client"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"
import AdminDashboard from "./AdminDashboard"
import VendorDashboard from "./VendorDashboard"
import UserDashboard from "./UserDashboard"

const DashboardBody = () => {
   const { user } = useAuth()

   const greeting = user?.name ? `Hola, ${user.name.split(" ")[0]}` : "Dashboard"

   return (
      <DashboardLayout title={greeting}>
         {user?.role === "admin" && <AdminDashboard />}
         {user?.role === "vendedor" && <VendorDashboard />}
         {(!user?.role || user.role === "usuario") && <UserDashboard />}
      </DashboardLayout>
   )
}

export default DashboardBody
