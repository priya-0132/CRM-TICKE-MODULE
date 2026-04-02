import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        priority: 'Low',
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('priority', data.priority);
        if (data.file) {
            formData.append('file', data.file);
        }

        post(route('tickets.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Create Ticket</h2>}
        >
            <Head title="Create Ticket" />

            <div className="py-12 max-w-3xl mx-auto">
                <form onSubmit={submit} className="bg-white shadow-md rounded-2xl p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter ticket title"
                        />
                        {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe the issue"
                            rows={4}
                        />
                        {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Priority</label>
                        <select
                            value={data.priority}
                            onChange={(e) => setData('priority', e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                        {errors.priority && <p className="text-red-500 mt-1">{errors.priority}</p>}
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">File (optional)</label>
                        <input
                            type="file"
                            onChange={(e) => setData('file', e.target.files[0])}
                            className="w-full"
                        />
                        {errors.file && <p className="text-red-500 mt-1">{errors.file}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Create Ticket
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}