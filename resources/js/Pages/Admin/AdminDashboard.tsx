import ArticleByQuarterCard from '@/Components/Reports/ArticleByQuarterCard';
import ArticlesByStatusChart from '@/Components/Reports/ArticleByStatusChart';
import PublicationTimelinessTable from '@/Components/Reports/PublicationTimelinessTable';
import AdminLayout from '@/Layouts/AdminLayout'
import { PageProps } from '@/types'
import { Head } from '@inertiajs/react'
import React, { PropsWithChildren, ReactNode } from 'react'



const AdminDashboard = ({ auth }: PageProps)  =>{
   // const fullName = `${auth.user.fname} ${auth.user.mname ?? ''} ${auth.user.lname}`.trim();
    return (
        <>

            <Head title="Dashboard"/>
            <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Publisher Dashboard</h1>
                    <p className="text-gray-600">Welcome, { auth.user?.lname }, { auth.user?.fname }</p>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Quarterly Publication Report</h2>
                    <ArticleByQuarterCard />
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <ArticlesByStatusChart />
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <PublicationTimelinessTable />
                </div>

            </div>

        </>
    )
}

AdminDashboard.layout = (page:any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>

export default AdminDashboard;
