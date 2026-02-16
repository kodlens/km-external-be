import { PropsWithChildren, ReactNode } from 'react';

import { Layout } from 'antd';

import { User } from '@/types';
import SideBarLayout from './SideBarLayout';

export default function AuthenticatedLayout(
  { user, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {

  return (

    <>
      <Layout>
        {/* {user.role.toLowerCase() === 'admin' && (
          <AdminLayout user={user} children={children}></AdminLayout>
        )}

        {user.role.toLowerCase() === 'encoder' && (
          <EncoderLayout user={user} children={children}></EncoderLayout>
        )}
        {user.role.toLowerCase() === 'publisher' && (
          <PublisherLayout user={user} children={children}></PublisherLayout>
        )} */}
        <SideBarLayout user={user} children={children}></SideBarLayout>

      </Layout>
    </>


  );
}
