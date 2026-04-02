import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function TicketsIndex({ auth, tickets, filters }) {
    const { data, setData, get, delete: destroy, processing } = useForm(filters);

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('tickets.index'), { preserveState: true });
    };

    const handleDelete = (ticketId) => {
        if (confirm('Are you sure you want to delete this ticket?')) {
            destroy(route('tickets.destroy', ticketId), {
                onFinish: () => get(route('tickets.index')),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-semibold text-gray-800">Tickets</h2>}
        >
            <Head title="Tickets" />

            <div className="py-10 max-w-7xl mx-auto px-4">

                {/* 🔹 Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">
                        All Tickets
                    </h3>
                </div>

                {/* 🔹 Filter + Actions */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4">

                    {/* Filters */}
                    <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-center">
                        <select
                            value={data.status || ''}
                            onChange={(e) => setData('status', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <select
                            value={data.priority || ''}
                            onChange={(e) => setData('priority', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">All Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
                        >
                            Apply Filters
                        </button>
                    </form>

                    {/* 🔹 Export Button */}
                    <a
                       href="/tickets/export"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
>
                       ⬇ Export CSV
                    </a>
                    

                </div>

                {/* 🔹 Table */}
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left">Title</th>
                                <th className="px-6 py-3 text-left">Priority</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Author</th>
                                <th className="px-6 py-3 text-left">Assigned</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {ticket.title}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${ticket.priority === 'High' ? 'bg-red-100 text-red-600' :
                                                ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-green-100 text-green-600'}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                                                ticket.status === 'InProgress' ? 'bg-blue-100 text-blue-600' :
                                                'bg-green-100 text-green-600'}`}>
                                                {ticket.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {ticket.author?.name}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {ticket.assignee?.name || '-'}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">

                                                {/* View */}
                                                <Link
                                                    href={`/tickets/${ticket.id}`}
                                                    className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-800 text-white rounded-md transition"
                                                >
                                                    View
                                                </Link>

                                                {/* Edit */}
                                                {(auth.user.role === 'admin' || auth.user.id === ticket.author_id) && (
                                                    <Link
                                                        href={`/tickets/${ticket.id}/edit`}
                                                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}

                                                {/* Delete */}
                                                {(auth.user.role === 'admin' || auth.user.id === ticket.author_id) && (
                                                    <button
                                                        onClick={() => handleDelete(ticket.id)}
                                                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                                                    >
                                                        Delete
                                                    </button>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                        No tickets found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🔹 Bottom Actions */}
                <div className="mt-6 flex justify-between items-center">

                    {/* Back */}
                    <Link
                        href={
                            auth.user.role === 'admin'
                                ? '/admin/dashboard'
                                : auth.user.role === 'assignee'
                                ? '/assignee/dashboard'
                                : '/dashboard'
                        }
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm transition"
                    >
                        ← Back to Dashboard
                    </Link>

                    {/* Trash */}
                    <Link
                        href="/tickets/trash"
                        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm transition"
                    >
                        🗑️ Trash
                    </Link>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}