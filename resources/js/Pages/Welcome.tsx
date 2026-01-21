import { Head } from "@inertiajs/react";
import Login from "./Auth/Login";

export default function Welcome() {

    return (
        <>
            <Head title="Login"></Head>
            <Login />
        </>
    );
}
