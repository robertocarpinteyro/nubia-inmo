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
         <HeaderTwo style_1={true} style_2={false} />
         <AboutUsNubia />
         <NubiaFooter />
      </Wrapper>
   )
}

export default AboutNubiaPage
