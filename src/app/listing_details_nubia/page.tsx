import { Suspense } from "react"
import NubiaPropertyDetail from "@/components/ListingDetails/listing-details-nubia"
import Wrapper from "@/layouts/Wrapper"

export const metadata = {
   title: "Propiedad — NUBIA Inmobiliaria",
}

const Page = () => {
   return (
      <Wrapper>
         <Suspense fallback={null}>
            <NubiaPropertyDetail />
         </Suspense>
      </Wrapper>
   )
}

export default Page
