import DashboardEditProperty from "@/components/dashboard/edit-property";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Editar Propiedad HOZN - Real Estate React Next js",
};

const EditPropertyPage = () => {
   return (
      <Wrapper>
         <DashboardEditProperty />
      </Wrapper>
   )
}

export default EditPropertyPage
