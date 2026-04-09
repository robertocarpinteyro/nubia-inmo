"use client"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"
import AddPropertyBody from "../add-property/AddPropertyBody"
import { useParams } from "next/navigation"

const DashboardEditProperty = () => {
   const params = useParams()
   const id = params?.id as string

   if (!id) return null

   return (
      <DashboardLayout title="Editar Propiedad" allowedRoles={["admin"]}>
         <AddPropertyBody propertyId={id} />
      </DashboardLayout>
   )
}

export default DashboardEditProperty
