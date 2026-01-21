import AdminLayout from '@/Layouts/AdminLayout'
import { PageProps } from '@/types'
import { Tabs, TabsProps } from 'antd'

import { Head } from '@inertiajs/react';
import { GalleryVertical, Youtube } from 'lucide-react';
import DostvYoutubeFeaturedTab from './DostvYoutubeFeaturedTab/DostvYoutubeFeaturedTab';
import DostvMainTab from './DostvMain/DostvMainTab';
import DostvVideosTab from './DostvVideos/DostvVideosTab';


const DostvIndex = ({ auth }: PageProps) => {

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: <div className='flex gap-2 items-center'>
        <GalleryVertical size={18} />
        <b>DOSTv MAIN</b>
      </div>,
      children: <DostvMainTab />,
    },
    {
      key: '2',
      label: <div className='flex gap-2 items-center'>
        <Youtube size={18} />
        <b>DOSTv VIDEOS</b>
      </div>,
      children: <DostvVideosTab />
    },
    {
      key: '3',
      label: <div className='flex gap-2 items-center'>
        <Youtube size={18} />
        <b>FEATURED DOSTv VIDEOS</b>
      </div>,
      children: <DostvYoutubeFeaturedTab />
    },
  ];

  return (
    <>
      <Head title="Featured Videos" />

      <div className='flex mt-10 justify-center items-center'>

        {/* card */}
        <div className='p-6 w-full overflow-auto mx-2 bg-white shadow-sm rounded-md
          md:max-w-[1200px]
          sm:max-w-[740px]'>
          <Tabs defaultActiveKey={'1'} items={items} />
        </div>
        {/* card */}
      </div>
    </>
  )
}


DostvIndex.layout = (page: any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default DostvIndex;