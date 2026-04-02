import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';

export default function UsersTrash({ auth, users }) {
    const restoreUser = (id) => {
        if (confirm('Restore this user?')) {
            router.post(`/users/${id}/restore`);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Deleted Users</h2>}>
            <Head title="Deleted Users" />

            <div className="py-12 max-w-7xl mx-auto px-4">
                <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
                    <h3 className="text-lg font-bold mb-4">Deleted Users</h3>

                    <table className="w-full table-auto border border-gray-200 text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border text-center">Role</th>
                                <th className="p-3 border text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length > 0 ? users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-3 border">{user.name}</td>
                                    <td className="p-3 border">{user.email}</td>
                                    <td className="p-3 border text-center">{user.role}</td>
                                    <td className="p-3 border text-center">
                                        <button
                                            onClick={() => restoreUser(user.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                                        >
                                            Restore
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-4 text-gray-500">
                                        No deleted users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-6 flex justify-end">
                        <Link
                            href="/users"
                            className="inline-block bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm transition"
                        >
                            ← Back to Users
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}