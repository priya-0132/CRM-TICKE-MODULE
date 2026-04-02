import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {

    const [notifications, setNotifications] = useState([]);
    const [lastData, setLastData] = useState([]);

    // ✅ Poll backend every 10 sec
    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // ✅ Fetch notifications
    const fetchNotifications = async () => {
        try {
            const res = await fetch('/notifications');
            const data = await res.json();

            const newOnes = data.filter(t =>
                !lastData.find(old => old.id === t.id)
            );

            if (newOnes.length > 0) {
                newOnes.forEach(item => {
                    showNotification(`🔔 ${item.description}`);
                });
            }

            setLastData(data);

        } catch (err) {
            console.error('Notification error:', err);
        }
    };

    // ✅ Show toast
    const showNotification = (message) => {
        const id = Date.now();

        let type = 'info';
        if (message.includes('Created')) type = 'success';
        if (message.includes('Deleted')) type = 'error';

        setNotifications(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>}>
            <Head title="Admin Dashboard" />

            {/* ✅ MODERN TOAST UI */}
            <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`shadow-xl rounded-lg px-4 py-3 min-w-[280px] animate-slide-in flex justify-between items-start
                            ${notif.type === 'success'
                                ? 'border-l-4 border-green-500 bg-green-50'
                                : notif.type === 'error'
                                ? 'border-l-4 border-red-500 bg-red-50'
                                : 'border-l-4 border-blue-500 bg-white'
                            }`}
                    >
                        <div className="text-sm text-gray-800">
                            {notif.message}
                        </div>

                        {/* ❌ Close button */}
                        <button
                            onClick={() =>
                                setNotifications(prev =>
                                    prev.filter(n => n.id !== notif.id)
                                )
                            }
                            className="ml-3 text-gray-400 hover:text-gray-700 text-lg"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="py-12 max-w-7xl mx-auto">

                {/* Welcome */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold">
                        Welcome Admin, {auth.user.name}
                    </h3>
                    <p className="text-gray-600">
                        Manage tickets and users
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <p className="text-gray-500">Total Tickets</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <p className="text-gray-500">Pending</p>
                        <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <p className="text-gray-500">Completed</p>
                        <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <p className="text-gray-500">Assigned</p>
                        <p className="text-2xl font-bold text-blue-500">{stats.assigned}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <Link
                        href="/tickets/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl text-center font-semibold"
                    >
                        ➕ Create Ticket
                    </Link>

                    <Link
                        href="/tickets"
                        className="bg-gray-200 hover:bg-gray-300 p-6 rounded-2xl text-center font-semibold"
                    >
                        📋 View All Tickets
                    </Link>

                    <Link
                        href="/users"
                        className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-2xl text-center font-semibold"
                    >
                        👥 Manage Users
                    </Link>
                </div>

                {/* Activity Logs */}
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                                Activity Logs
                            </h4>
                            <p className="text-sm text-gray-500">
                                Track system actions like delete, restore, and updates
                            </p>
                        </div>

                        <Link
                            href="/activity-logs"
                            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm transition"
                        >
                            View Logs →
                        </Link>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}