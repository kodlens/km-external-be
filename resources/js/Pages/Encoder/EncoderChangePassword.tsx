
import { PageProps } from "@/types";
import AuthorLayout from "@/Layouts/EncoderLayout";
import { Head } from "@inertiajs/react";
import ChangePassword from "../Auth/ChangePassword";

export default function AuthorMyAccount( {auth } : PageProps ) {

    return (

        <AuthorLayout user={auth.user}>
            <Head title="Change Password"></Head>
            <ChangePassword></ChangePassword>
        </AuthorLayout>
    )
}
