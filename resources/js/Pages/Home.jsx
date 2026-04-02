import { Head, Link } from "@inertiajs/react";

export default function Home({ auth }) {
    return (
        <>
            <Head title="CRM System" />

            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">

                {/* 🔹 Navbar */}
                <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
                    <h1 className="text-xl font-bold text-blue-600">CRM</h1>

                    <div className="space-x-4">
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* 🔹 Hero */}
                <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                    <h1 className="text-4xl font-bold text-gray-800">
                        CRM Ticket Management System
                    </h1>

                    <p className="mt-4 text-gray-600 max-w-xl">
                        Manage tickets, assign tasks, and track progress easily with a modern CRM system.
                    </p>

                    <div className="mt-6 space-x-4">
                        <Link
                            href="/register"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl"
                        >
                            Get Started
                        </Link>

                        <Link
                            href="/login"
                            className="px-6 py-3 bg-gray-200 rounded-xl"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {/* 🔹 Features */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-20">

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
                        <h3 className="text-lg font-semibold">🎯 Role Based System</h3>
                        <p className="text-gray-600 mt-2">
                            Admin, Author & Assignee dashboards with secure access.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
                        <h3 className="text-lg font-semibold">📋 Ticket Management</h3>
                        <p className="text-gray-600 mt-2">
                            Create, edit, filter and manage tickets efficiently.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
                        <h3 className="text-lg font-semibold">⚡ Fast & Modern</h3>
                        <p className="text-gray-600 mt-2">
                            Built with Laravel + React (Inertia) for real-world apps.
                        </p>
                    </div>

                </div>

                {/* 🔹 Footer */}
                <footer className="text-center py-6 text-gray-500">
                    © {new Date().getFullYear()} CRM System
                </footer>

            </div>
        </>
    );
}