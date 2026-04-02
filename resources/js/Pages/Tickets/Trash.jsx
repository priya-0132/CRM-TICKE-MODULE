import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Trash({ auth, tickets }) {

    const restoreTicket = (id) => {
        if (confirm('Restore this ticket?')) {
            router.post(`/tickets/${id}/restore`);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Trash (Deleted Tickets)</h2>}>
            <Head title="Trash" />

            <div className="py-12 max-w-7xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">

                    <h3 className="text-lg font-bold mb-4">
                        Deleted Tickets
                    </h3>

                    <table className="w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border">Title</th>
                                <th className="p-3 border">Priority</th>
                                <th className="p-3 border">Status</th>
                                <th className="p-3 border">Author</th>
                                <th className="p-3 border">Assigned To</th>
                                <th className="p-3 border">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tickets.length > 0 ? (
                                tickets.map(ticket => (
                                    <tr key={ticket.id} className="hover:bg-gray-50">

                                        <td className="p-3 border">{ticket.title}</td>
                                        <td className="p-3 border">{ticket.priority}</td>
                                        <td className="p-3 border">{ticket.status}</td>
                                        <td className="p-3 border">{ticket.author?.name}</td>
                                        <td className="p-3 border">{ticket.assignee?.name || '-'}</td>

                                        <td className="p-3 border text-center">
                                            <button
                                                onClick={() => restoreTicket(ticket.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                            >
                                                Restore
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-4">
                                        No deleted tickets found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}