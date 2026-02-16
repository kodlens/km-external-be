
import SideBarLayout from "@/Layouts/SideBarLayout";

import { Head } from "@inertiajs/react";
import { ReactNode } from "react";


export default function PublisherDashboard() {

  return (
    <>
      <Head title="Dashboard" />

      <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        Dashboard Publisher

      </div>
    </>
  );
}

PublisherDashboard.layout = (page: ReactNode) => (
  <SideBarLayout user={(page as any).props.auth.user}>
    {page}
  </SideBarLayout>
);
