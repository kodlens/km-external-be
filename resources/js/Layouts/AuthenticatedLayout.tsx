import {  PropsWithChildren, ReactNode } from 'react';

import {  Layout } from 'antd';
import AdminLayout from './AdminLayout';
import PublisherLayout from './PublisherLayout';
import AuthorLayout from './EncoderLayout';

export default function AuthenticatedLayout(
    { user, header, children }: PropsWithChildren<{ user: any, header?: ReactNode}>) {

    return (

        <>
            <Layout>
                {user.role.toLowerCase() === 'admin' && (
                    <AdminLayout user={user} children={children}></AdminLayout>
                )}

                {user.role.toLowerCase() === 'author' && (
                    <AuthorLayout user={user} children={children}></AuthorLayout>
                )}
                {user.role.toLowerCase() === 'publisher' && (
                    <PublisherLayout user={user} children={children}></PublisherLayout>
                )}

            </Layout>
        </>


    );
}
