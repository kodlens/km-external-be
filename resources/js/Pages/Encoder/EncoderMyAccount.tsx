
import { PageProps } from "@/types";
import AuthorLayout from "@/Layouts/EncoderLayout";
import { Head } from "@inertiajs/react";
import MyAccount from "../Auth/MyAccount";

export default function AuthorMyAccount( {auth } : PageProps ) {

    return (

        <AuthorLayout user={auth.user}>
            <Head title="My Account"></Head>
            <MyAccount auth={auth} categories={[]} permissions={[]} statuses={[]}></MyAccount>
        </AuthorLayout>
    )
}
