import SideBarLayout from "@/Layouts/SideBarLayout";
import { Head } from "@inertiajs/react";
import { ReactNode } from "react";



export default function EncoderDashboard() {
  //const fullName = `${auth.user?.firstname } ${auth.user?.middlename ?? ''} ${auth.user?.lastname}`;
  return (
    <>
      <Head title="Dashboard" />

      Dashboard

    </>
  );
}


EncoderDashboard.layout = (page: ReactNode) => (
  <SideBarLayout user={(page as any).props.auth.user}>
    {page}
  </SideBarLayout>
);
