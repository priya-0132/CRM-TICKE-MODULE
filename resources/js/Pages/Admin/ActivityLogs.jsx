import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ActivityLogs({ auth, logs }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Activity Logs</h2>}>
            <Head title="Activity Logs" />

            <div className="py-10 max-w-7xl mx-auto px-4">

                {/* Table */}
                <div className="bg-white shadow-md rounded-2xl overflow-hidden">

                    <table className="min-w-full">
                        <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left">User</th>
                                <th className="px-6 py-3 text-left">Action</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-left">Time</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.length > 0 ? (
                                logs.map(log => (
                                    <tr key={log.id} className="border-t hover:bg-gray-50">

                                        <td className="px-6 py-4 text-gray-700">
                                            {log.user?.name || 'System'}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {log.action}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {log.description}
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                        No activity logs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🔹 Bottom Controls */}
                <div className="mt-6 flex justify-between items-center">

                    {/* Back */}
                    <Link
                        href="/admin/dashboard"
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}