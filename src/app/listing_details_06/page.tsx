import { Suspense } from "react"
import ListingDetailsSix from "@/components/ListingDetails/listing-details-6";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Propiedad — NUBIA Inmobiliaria",
};

const index = () => {
   return (
      <Wrapper>
         <Suspense fallback={<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4 }}>Cargando...</div>}>
            <ListingDetailsSix />
         </Suspense>
      </Wrapper>
   )
}

export default index
