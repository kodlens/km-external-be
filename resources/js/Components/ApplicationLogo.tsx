import { Link, Head } from '@inertiajs/react';

export default function ApplicationLogo({className=''}) {
    return (
        <>
            <div className="flex gap-2 `${className}">
                <div className="">
                    <Link href="/">
                        <img src="/img/app-logo-black-update.png" alt="dost-stii logo" />
                    </Link>
                </div>
            </div>

        </>
    );
}
