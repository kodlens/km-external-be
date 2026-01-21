import ApplicationLogo from '@/Components/ApplicationLogo';
import MenuBtn from '@/Components/MenuBtn';
import { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Guest({ children  }: 

    PropsWithChildren ) 
        
    {
        //get the user on page props
        const  categories:any = usePage().props?.categories;
        
    return (

        <div className="bg-primary-1 h-full">
            {/* page container */}
            <div className='relative w-full
                xl:max-w-screen-xl xl:mx-auto
                '>

                <div className="flex items-center justify-between z-10 bg-primary-1
                    w-full px-4
                    fixed top-0 h-[100px]  
                    sm:px-0 sm:mx-auto
                    xl:max-w-screen-xl">
                    <ApplicationLogo />
                    
                    <div className="relative">
                        <MenuBtn  />
                    </div>
                </div>
                
                <div className="custom-nav">
                    <Link href="/" className="">HOME</Link>
                    <Link href="/freedom-wall">FREEDOM WALL</Link>

                    <Link href="/freedom-wall"></Link>
                </div>

                {children}

            </div>
        </div>
    );
}
