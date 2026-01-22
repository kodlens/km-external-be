import { PropsWithChildren, ReactNode } from 'react';

import { Layout } from 'antd';
import AdminLayout from './AdminLayout';
import PublisherLayout from './PublisherLayout';
import EncoderLayout from './EncoderLayout';
import { User } from '@/types';

export default function AuthenticatedLayout(
  { user, header, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {

  return (

    <>
      <Layout>
        {user.role.toLowerCase() === 'admin' && (
          <AdminLayout user={user} children={children}></AdminLayout>
        )}

        {user.role.toLowerCase() === 'encoder' && (
          <EncoderLayout user={user} children={children}></EncoderLayout>
        )}
        {user.role.toLowerCase() === 'publisher' && (
          <PublisherLayout user={user} children={children}></PublisherLayout>
        )}

      </Layout>
    </>


  );
}
