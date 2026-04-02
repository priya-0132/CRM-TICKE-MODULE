import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Dashboard({ auth, tickets: initialTickets }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [notifications, setNotifications] = useState([]);

  // Update ticket status
  const updateStatus = (id, status) => {
    router.patch(`/tickets/${id}`, { status }, {
      onSuccess: () => fetchNotifications(),
    });
  };

  // Poll for new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Fetch recent notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/notifications');
      const data = await res.json();

      const newNotifications = data.filter(
        t => !tickets.find(tt => tt.id === t.id && tt.status === t.status)
      );
      if (newNotifications.length) {
        // Add slide-in/out key
        setNotifications(prev => [
          ...prev,
          ...newNotifications.map(n => ({ ...n, show: true })),
        ]);

        // Auto hide after 5 seconds
        newNotifications.forEach((_, idx) => {
          setTimeout(() => {
            setNotifications(prev =>
              prev.map((item, i) =>
                i === prev.length - newNotifications.length + idx
                  ? { ...item, show: false }
                  : item
              )
            );
          }, 5000);
        });
      }

     // setTickets(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Assignee Dashboard</h2>}>
      <Head title="Assignee Dashboard" />

      {/* Notification Popup */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((note, i) => (
          <div
            key={i}
            className={`bg-blue-500 text-white px-4 py-2 rounded shadow-md transform transition-all duration-500 ${
              note.show ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            onClick={() =>
              setNotifications(prev => prev.filter((_, idx) => idx !== i))
            }
          >
            {note.title} updated!
          </div>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="py-12 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
          <h3 className="text-lg font-bold mb-4">Welcome, {auth.user.name}</h3>

          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Priority</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Progress</th>
                <th className="p-3 border">Update</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{ticket.title}</td>
                  <td className="p-3 border">{ticket.priority}</td>
                  <td className="p-3 border text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        ticket.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : ticket.status === 'InProgress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {ticket.status === 'InProgress' ? 'In Progress' : ticket.status}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          ticket.status === 'Pending'
                            ? 'bg-yellow-500 w-1/4'
                            : ticket.status === 'InProgress'
                            ? 'bg-blue-500 w-2/4'
                            : 'bg-green-500 w-full'
                        }`}
                      ></div>
                    </div>
                  </td>
                  <td className="p-3 border text-center">
                    <select
                      value={ticket.status}
                      disabled={ticket.status === 'Completed'}
                      onChange={e => updateStatus(ticket.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}