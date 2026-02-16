
import { PageProps } from "@/types";
import SideBarLayout from "@/Layouts/SideBarLayout";
import { Head } from "@inertiajs/react";
import ChangePassword from "../Auth/ChangePassword";

export default function EncoderChangePassword({ auth }: PageProps) {

  return (

    <SideBarLayout user={auth.user}>
      <Head title="Change Password"></Head>
      <ChangePassword></ChangePassword>
    </SideBarLayout>
  )
}
