import SideBarLayout from "@/Layouts/SideBarLayout";
import { Head } from "@inertiajs/react";
import { ClockCircleOutlined, EditOutlined, FileAddOutlined, FileDoneOutlined, InboxOutlined, WarningOutlined } from "@ant-design/icons";
import { ReactNode } from "react";
import { PageProps } from "@/types";



type QueueItem = {
  title: string;
  status: "DRAFT" | "FOR REVIEW" | "RETURNED";
  agency: string;
  publishDate: string;
  updatedAt: string;
};

const queueItems: QueueItem[] = [
  {
    title: "Climate Adaptation Program Updates",
    status: "DRAFT",
    agency: "DOST",
    publishDate: "2026-02-20",
    updatedAt: "2026-02-18 08:42",
  },
  {
    title: "Regional Innovation Grants",
    status: "FOR REVIEW",
    agency: "NEDA",
    publishDate: "2026-02-19",
    updatedAt: "2026-02-17 16:05",
  },
  {
    title: "Marine Biodiversity Initiative",
    status: "RETURNED",
    agency: "DENR",
    publishDate: "2026-02-21",
    updatedAt: "2026-02-18 09:11",
  },
];

const alerts: string[] = [
  "3 draft records are missing Subject Headings.",
  "2 items have no Agency selected.",
  "1 item has possible duplicate title.",
];

export default function EncoderDashboard({ auth }: PageProps) {
  const fullName = `${auth.user.fname} ${auth.user.mname ?? ""} ${auth.user.lname}`.trim();

  return (
    <>
      <Head title="Dashboard" />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Encoder Dashboard</h1>
          <p className="text-gray-600">Welcome, {fullName}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <InboxOutlined />
              Assigned Today
            </div>
            <p className="text-3xl font-semibold text-gray-800">12</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <FileDoneOutlined />
              Encoded Today
            </div>
            <p className="text-3xl font-semibold text-gray-800">7</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <EditOutlined />
              Pending Drafts
            </div>
            <p className="text-3xl font-semibold text-gray-800">9</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <ClockCircleOutlined />
              Returned Items
            </div>
            <p className="text-3xl font-semibold text-gray-800">3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">My Queue</h2>
              <a href="/encoder/infos" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View All
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-2 pr-4 font-medium">Title</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Agency</th>
                    <th className="py-2 pr-4 font-medium">Publish Date</th>
                    <th className="py-2 pr-4 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {queueItems.map((item) => (
                    <tr key={`${item.title}-${item.updatedAt}`} className="border-b last:border-0">
                      <td className="py-3 pr-4 text-gray-800">{item.title}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{item.agency}</td>
                      <td className="py-3 pr-4 text-gray-700">{item.publishDate}</td>
                      <td className="py-3 pr-4 text-gray-700">{item.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h2>
              <div className="space-y-3">
                <a
                  href="/encoder/infos/create"
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                >
                  <FileAddOutlined />
                  New Information
                </a>
                <a
                  href="/encoder/infos"
                  className="block rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  My Drafts
                </a>
                <a
                  href="/encoder/infos"
                  className="block rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Submitted Items
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Quality Alerts</h2>
              <ul className="space-y-3">
                {alerts.map((alert) => (
                  <li key={alert} className="flex items-start gap-2 text-sm text-gray-700">
                    <WarningOutlined className="mt-0.5 text-amber-500" />
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


EncoderDashboard.layout = (page: ReactNode) => (
  <SideBarLayout user={(page as any).props.auth.user}>
    {page}
  </SideBarLayout>
);
