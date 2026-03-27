import HeaderTwo from "@/layouts/headers/HeaderTwo"
import HeroBanner from "./HeroBanner"
import StatsBar from "./StatsBar"
import NubiaProperties from "./NubiaProperties"
import NubiaFeatures from "./NubiaFeatures"
import NubiaProcess from "./NubiaProcess"
import NubiaTestimonial from "./NubiaTestimonial"
import NubiaCtaBanner from "./NubiaCtaBanner"
import NubiaFooter from "./NubiaFooter"

const HomeTwo = () => {
  return (
    <div className="nubia-home">
      <HeaderTwo style_1={false} style_2={false} nubia={true} />
      <HeroBanner />
      <StatsBar />
      <NubiaProperties />
      <NubiaFeatures />
      <NubiaProcess />
      <NubiaTestimonial />
      <NubiaCtaBanner />
      <NubiaFooter />
    </div>
  )
}

export default HomeTwo
