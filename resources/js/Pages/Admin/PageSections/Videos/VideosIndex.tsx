import AdminLayout from '@/Layouts/AdminLayout'
import {  PageProps } from '@/types'
import { Tabs, TabsProps } from 'antd'

import { Head } from '@inertiajs/react';
import TableFeaturedVideosList from './TableFeaturedVideosList';
import TableVideosList from './TableVideosList';
import { Film, MonitorPlay } from 'lucide-react';


const FeaturedVideosIndex = ( {auth}: PageProps ) => {
    
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <div className='flex gap-2 items-center'>
                <MonitorPlay size={18} />
                <b>VIDEOS</b>
            </div>,
            children: <TableVideosList />,
        },
        {
            key: '2',
            label: <div className='flex gap-2 items-center'>
                <Film size={18} />
                <b>FEATURED VIDEOS</b>
            </div>,
            children:<TableFeaturedVideosList />
        },
       
    ];

    return (
        <>

            <Head title="Featured Videos" />

            <div className='flex mt-10 justify-center items-center'>

                {/* card */}
                <div className='p-6 w-full overflow-auto mx-2 bg-white shadow-sm rounded-md
                    md:w-[900px]
                    sm:w-[740px]'>
                    
                    <Tabs defaultActiveKey="1" items={items} />

                </div>
                {/* card */}
            </div>


           
        </>
    )
}


FeaturedVideosIndex.layout =  (page:any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default FeaturedVideosIndex;