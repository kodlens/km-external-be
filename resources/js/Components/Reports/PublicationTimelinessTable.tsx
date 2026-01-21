import { useEffect, useState } from 'react';
import axios from 'axios';
import { dateFormat } from '@/helper/helperFunctions';

interface TimelinessReport {
  id: number;
  title: string;
  created_at: string;
  publication_date: string;
  days_to_publish: number;
}

function getBadge(days: number): JSX.Element {
  if (days <= 2) {
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Fast</span>;
  } else if (days <= 7) {
    return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Moderate</span>;
  } else {
    return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Slow</span>;
  }
}

export default function PublicationTimelinessTable() {
  const [data, setData] = useState<TimelinessReport[]>([]);

  useEffect(() => {
    axios.get<TimelinessReport[]>('/reports/publication-timeliness')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Publication Timeliness</h2>
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Submitted</th>
            <th className="px-4 py-2 border">Published</th>
            <th className="px-4 py-2 border">Days</th>
            <th className="px-4 py-2 border">Speed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border max-w-[300px] truncate">{row.title}</td>
              <td className="px-4 py-2 border">{dateFormat(row.created_at)}</td>
              <td className="px-4 py-2 border">{dateFormat(row.publication_date)}</td>
              <td className="px-4 py-2 border text-center">{row.days_to_publish}</td>
              <td className="px-4 py-2 border text-center">{getBadge(row.days_to_publish)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
