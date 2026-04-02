import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Users({ auth, users }) {

    const deleteUser = (id) => {
        if (confirm("Are you sure you want to delete this user?")) {
            router.delete(`/users/${id}`);
        }
    };

    const updateRole = (id, role) => {
        router.patch(`/users/${id}`, { role });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Manage Users</h2>}>
            <Head title="Users" />

            <div className="py-12 max-w-7xl mx-auto px-4">

                {/* Users Table */}
                <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">

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
                            {users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">

                                        {/* Name */}
                                        <td className="p-3 border">{user.name}</td>

                                        {/* Email */}
                                        <td className="p-3 border">{user.email}</td>

                                        {/* Role Dropdown */}
                                        <td className="p-3 border text-center">
                                            <select
                                                value={user.role}
                                                disabled={auth.user.id === user.id} // cannot change own role
                                                onChange={(e) => updateRole(user.id, e.target.value)}
                                                className="border rounded px-2 py-1 text-sm"
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="author">Author</option>
                                                <option value="assignee">Assignee</option>
                                            </select>
                                        </td>

                                        {/* Action */}
                                        <td className="p-3 border text-center">
                                            {auth.user.id === user.id ? (
                                                <span className="text-gray-400 text-sm">You</span>
                                            ) : (
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-4 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🔹 Bottom Controls */}
                <div className="mt-6 flex justify-between items-center">
                    {/* Back to Dashboard */}
                    <Link
                        href={
                            auth.user.role === 'admin'
                                ? '/admin/dashboard'
                                : auth.user.role === 'assignee'
                                ? '/assignee/dashboard'
                                : '/dashboard'
                        }
                        className="inline-block bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm transition"
                    >
                        ← Back to Dashboard
                    </Link>

                    {/* Trash Users */}
                    <Link
                        href="/users/trash"
                        className="inline-block bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm transition"
                    >
                        🗑️ View Trash
                    </Link>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}