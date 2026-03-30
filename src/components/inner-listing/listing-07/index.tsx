import { Suspense } from "react"
import HeaderTwo from "@/layouts/headers/HeaderTwo"
import NubiaFooter from "@/components/homes/home-two/NubiaFooter"
import ListingSevenArea from "./ListingSevenArea"

const ListingSeven = () => {
   return (
      <div className="nubia-home">
         <HeaderTwo style_1={false} style_2={false} nubia={true} />
         <Suspense fallback={null}>
            <ListingSevenArea style={false} />
         </Suspense>
         <NubiaFooter />
      </div>
   )
}

export default ListingSeven
