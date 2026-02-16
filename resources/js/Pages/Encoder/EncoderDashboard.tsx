import ArticleByQuarterCard from "@/Components/Reports/ArticleByQuarterCard";
import ArticlesByStatusChart from "@/Components/Reports/ArticleByStatusChart";
import PublicationTimelinessTable from "@/Components/Reports/PublicationTimelinessTable";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import EncoderLayout from "@/Layouts/SideBarLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";



export default function EncoderDashboard({ auth }: PageProps) {
  //const fullName = `${auth.user?.firstname } ${auth.user?.middlename ?? ''} ${auth.user?.lastname}`;
  return (
    <>
      <Head title="Dashboard" />

      {/* <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Author Dashboard</h1>
          <p className="text-gray-600">Welcome, {auth.user.lastname}</p>
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

      </div> */}
    </>
  );
}


EncoderDashboard.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as any).props.auth.user}>
    {page}
  </EncoderLayout>
);
