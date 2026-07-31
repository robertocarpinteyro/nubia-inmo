import AboutUsNubia from "@/components/inner-pages/about-us/about-us-nubia"
import HeaderTwo from "@/layouts/headers/HeaderTwo"
import NubiaFooter from "@/components/homes/home-two/NubiaFooter"
import Wrapper from "@/layouts/Wrapper"

export const metadata = {
   title: "Nosotros — NUBIA Inmobiliaria",
}

const AboutNubiaPage = () => {
   return (
      <Wrapper>
         <div className="nubia-home">
            <HeaderTwo style_1={false} style_2={false} nubia={true} />
            <AboutUsNubia />
            <NubiaFooter />
         </div>
      </Wrapper>
   )
}

export default AboutNubiaPage
