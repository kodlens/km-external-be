
import { PageProps } from "@/types";
import AuthorLayout from "@/Layouts/SideBarLayout";
import { Head } from "@inertiajs/react";
import MyAccount from "../Auth/MyAccount";

export default function EncoderMyAccount( {auth } : PageProps ) {

    return (

        <AuthorLayout user={auth.user}>
            <Head title="My Account"></Head>
            <MyAccount auth={auth}></MyAccount>
        </AuthorLayout>
    )
}
