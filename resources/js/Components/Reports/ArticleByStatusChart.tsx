import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface StatusReport {
  status: string;
  total: number;
}

const COLORS = ['#4ADE80', '#60A5FA', '#FACC15', '#F87171']; // customize for draft, submit, return, publish

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submit: 'Submitted',
  return: 'Returned',
  publish: 'Published',
};

export default function ArticlesByStatusChart() {
  const [data, setData] = useState<StatusReport[]>([]);

  useEffect(() => {
    axios.get<StatusReport[]>('/reports/articles-by-status')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const chartData = data.map(d => ({
    name: STATUS_LABELS[d.status] || d.status,
    value: d.total,
  }));

  return (
    <div className="">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Articles by Status</h2>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
