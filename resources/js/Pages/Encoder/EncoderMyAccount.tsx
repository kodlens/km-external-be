
import { PageProps } from "@/types";
import SideBarLayout from "@/Layouts/SideBarLayout";
import { Head } from "@inertiajs/react";
import MyAccount from "../Auth/MyAccount";

export default function EncoderMyAccount({ auth }: PageProps) {

  return (

    <SideBarLayout user={auth.user}>
      <Head title="My Account"></Head>
      <MyAccount auth={auth}></MyAccount>
    </SideBarLayout>
  )
}
