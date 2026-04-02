import { useForm, usePage, Link } from '@inertiajs/react';

export default function Show({ ticket }) {
    const { auth } = usePage().props;

    const { data, setData, post, reset } = useForm({
        comment: '',
        ticket_id: ticket.id
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('comments.store'), { onSuccess: () => reset('comment') });
    };

    const canComment =
        auth.user.role === 'admin' ||
        ticket.author_id === auth.user.id ||
        ticket.assigned_to === auth.user.id;

    return (
        <div>
            <h1>{ticket.title}</h1>
            <p>{ticket.description}</p>

            {canComment && (
                <form onSubmit={submit} className="mt-4">
                    <textarea
                        value={data.comment}
                        onChange={(e) => setData('comment', e.target.value)}
                        placeholder="Write a comment..."
                        className="border p-2 w-full"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 mt-2">
                        Add Comment
                    </button>
                </form>
            )}

            {!canComment && (
                <p className="text-red-500 mt-4">
                    You are not allowed to comment on this ticket.
                </p>
            )}

            <div className="mt-6">
                <h3>Comments</h3>
                {ticket.comments.length === 0 && <p>No comments yet</p>}
                {ticket.comments.map((c) => (
                    <div key={c.id} className="border p-2 mb-2">
                        <p><b>{c.user?.name}</b></p>
                        <p>{c.comment}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <Link
                    href={route('dashboard')}
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                    <span>←</span> Back to Dashboard
                </Link>
            </div>
        </div>
    );
}