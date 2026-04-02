import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, ticket, assignees }) {
    const { data, setData, post, processing, errors } = useForm({
        title: ticket.title || '',
        description: ticket.description || '',
        priority: ticket.priority || '',
        status: ticket.status || '',
        assigned_to: ticket.assigned_to || '', // ✅ IMPORTANT
        file: null,
        _method: 'put',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(`/tickets/${ticket.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Edit Ticket</h2>}
        >
            <Head title="Edit Ticket" />

            <div className="py-12 max-w-4xl mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-2xl shadow-md space-y-4"
                >
                    {/* Title */}
                    <div>
                        <label className="block mb-1">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.title && <div className="text-red-500">{errors.title}</div>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.description && <div className="text-red-500">{errors.description}</div>}
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block mb-1">Priority</label>
                        <select
                            value={data.priority}
                            onChange={(e) => setData('priority', e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        >
                            <option value="">Select</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block mb-1">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        >
                            <option value="Pending">Pending</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* ✅ Assign To */}
                    <div>
                        <label className="block mb-1">Assign To</label>
                        <select
                            value={data.assigned_to}
                            onChange={(e) => setData('assigned_to', e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        >
                            <option value="">-- Select Assignee --</option>

                            {assignees.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block mb-1">Replace File</label>
                        <input
                            type="file"
                            onChange={(e) => setData('file', e.target.files[0])}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Update Ticket
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}