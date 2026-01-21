import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface ArticleQuarterReport {
    YEAR: number;
    quarter_id: number;
    total_published: number;
}

export default function ArticleByQuarterCard() {
    const [report, setReport] = useState<ArticleQuarterReport[]>([]);

    useEffect(() => {
        axios.get<ArticleQuarterReport[]>('/reports/articles-by-quarter')
            .then(res => setReport(res.data))
            .catch(err => console.error(err));
    }, []);

    // Create a display label like "2024 Q1"
    const formattedData = report.map((row) => ({
        name: `${row.YEAR} Q${row.quarter_id}`,
        total: row.total_published,
    }));

    return (
        <div className="space-y-6 flex flex-col md:flex-row">

            <div className="flex-1">
                <div className='h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#4F46E5" name="Published Articles" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className='flex-1'>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Published Articles Table</h3>
                <div>
                    <table className="min-w-full text-left text-sm border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">Year</th>
                                <th className="px-4 py-2 border">Quarter</th>
                                <th className="px-4 py-2 border">Total Published</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{row.YEAR}</td>
                                    <td className="px-4 py-2 border">Q{row.quarter_id}</td>
                                    <td className="px-4 py-2 border">{row.total_published}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
