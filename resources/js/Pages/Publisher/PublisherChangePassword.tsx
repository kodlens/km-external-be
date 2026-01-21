import { PageProps } from "@/types";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import ChangePassword from "../Auth/ChangePassword";

export default function PublisherChangePassword( {auth} : PageProps ) {

    return (

        <>
            <Head title="Change Password"></Head>
            <Head title="My Account"></Head>
            <ChangePassword></ChangePassword>
        </>
    )
}

PublisherChangePassword.layout = (page:any) => <Authenticated user={page.props.auth.user}>{page}</Authenticated>
