"use client"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"
import PropertyListBody from "./PropertyListBody"

const PropertyList = () => {
   return (
      <DashboardLayout title="Mis Propiedades">
         <PropertyListBody />
      </DashboardLayout>
   )
}

export default PropertyList
