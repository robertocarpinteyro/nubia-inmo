import HeaderTwo from "@/layouts/headers/HeaderTwo"
import NubiaFooter from "@/components/homes/home-two/NubiaFooter"
import ContactArea from "./ContactArea"

const Contact = () => {
   return (
      <div className="nubia-home">
         <HeaderTwo style_1={false} style_2={false} nubia={true} />
         <ContactArea />
         <NubiaFooter />
      </div>
   )
}

export default Contact
