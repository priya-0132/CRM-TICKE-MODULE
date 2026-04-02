import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    const { post } = useForm();

    const [notifications, setNotifications] = useState([]);
    const [lastData, setLastData] = useState([]);

    const logout = () => {
        post(route('logout'));
    };

    // ✅ Poll notifications every 10 sec
    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // ✅ Fetch from backend (same API)
    const fetchNotifications = async () => {
        try {
            const res = await fetch('/notifications');
            const data = await res.json();

            // ✅ only new logs
            const newOnes = data.filter(item =>
                !lastData.find(old => old.id === item.id)
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

    // ✅ Show popup
    const showNotification = (message) => {
        const id = Date.now();

        setNotifications(prev => [...prev, { id, message }]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Dashboard
                    </h2>

                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>
            }
        >
            <Head title="Dashboard" />

            {/* ✅ POPUP UI */}
            <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg animate-slide-in"
                    >
                        {notif.message}
                    </div>
                ))}
            </div>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Welcome */}
                    <div className="mb-6 text-gray-800">
                        <h3 className="text-2xl font-bold">
                            Welcome, {auth.user.name}!
                        </h3>
                        <p className="text-gray-600 mt-1">
                            Here’s an overview of your tickets.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <p className="text-gray-500">Total Tickets</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <p className="text-gray-500">Pending Tickets</p>
                            <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <p className="text-gray-500">Completed Tickets</p>
                            <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <p className="text-gray-500">My Assigned Tickets</p>
                            <p className="text-2xl font-bold text-blue-500">{stats.assigned}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Link
                            href={route('tickets.create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 text-center font-semibold transition"
                        >
                            ➕ Create New Ticket
                        </Link>

                        <Link
                            href={route('tickets.index')}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl p-6 text-center font-semibold transition"
                        >
                            📋 View All Tickets
                        </Link>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}