"use client"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"
import AddPropertyBody from "./AddPropertyBody"

const DashboardAddProperty = () => {
   return (
      <DashboardLayout title="Agregar Propiedad" allowedRoles={["admin"]}>
         <AddPropertyBody />
      </DashboardLayout>
   )
}

export default DashboardAddProperty
