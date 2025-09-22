// src/pages/AdminDashboard.jsx
import React from 'react'; // ✅ Add this line
import { useState, useEffect } from 'react';
// Removed react-tabs for new sidebar layout
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend
} from 'recharts';
import { toast } from 'react-hot-toast';
import { HiSearch } from 'react-icons/hi';
import Loading from '../components/Loading';

// API Functions
import {
  getAdminUsers,
  deleteAdminUser,
  getAdminServices,
  deleteAdminService,
  getVerifiedUsers,
  getAdminStats,
} from '../services/api';

// Optional: Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("AdminDashboard Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-10 text-red-600">
          <h2>Something went wrong.</h2>
          <p>Please refresh or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [selected, setSelected] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalPortfolios: 0,
    totalVerifiedUsers: 0,
    totalConversations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [verifiedPage, setVerifiedPage] = useState(1);
  const [userFilter, setUserFilter] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const limit = 10;
  const [userTotal, setUserTotal] = useState(0);
  const [serviceTotal, setServiceTotal] = useState(0);
  const [verifiedTotal, setVerifiedTotal] = useState(0);

  const fetchData = async (apiCall, setData, setTotal, page, filter = '') => {
    try {
      const data = await apiCall(page, limit, filter);
      setData(data.users || data.requests || data.portfolios || data.services || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch data');
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchData(getAdminUsers, setUsers, setUserTotal, userPage, userFilter),
        fetchData(getAdminServices, setServices, setServiceTotal, servicePage, serviceFilter),
        fetchData(getVerifiedUsers, setVerifiedUsers, setVerifiedTotal, verifiedPage),
        getAdminStats().then(setStats),
      ]);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [
    userPage,
    servicePage,
    verifiedPage,
    userFilter,
    serviceFilter,
  ]);

  // Handle Delete Actions
  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user? This cannot be undone.')) {
      try {
        await deleteAdminUser(id);
        toast.success('User deleted');
        fetchData(getAdminUsers, setUsers, setUserTotal, userPage, userFilter);
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        await deleteAdminService(id);
        toast.success('Service deleted');
        fetchData(getAdminServices, setServices, setServiceTotal, servicePage, serviceFilter);
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const handleUserSearch = () => {
    setUserFilter(userSearchTerm);
    setUserPage(1); // Reset to first page when searching
  };

  // Removed portfolio and CAC/badge handlers in the new UI

  // Pagination Component
  const Pagination = ({ currentPage, total, setPage }) => {
    const totalPages = Math.ceil(total / limit);
    return (
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading variant="spinner" size="lg" color="blue" text="Loading Admin Dashboard..." />
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'services', label: 'Total Services' },
    { id: 'verified', label: 'Verified Users' },
    { id: 'conversations', label: 'Active Conversations' },
  ];

  const barData = [
    { name: 'Users', value: stats.totalUsers || 0 },
    { name: 'Services', value: stats.totalServices || 0 },
    { name: 'Verified', value: stats.totalVerifiedUsers || 0 },
    { name: 'Convos', value: stats.totalConversations || 0 },
  ];

  const pieData = [
    { name: 'Verified', value: stats.totalVerifiedUsers || 0 },
    { name: 'Unverified', value: Math.max((stats.totalUsers || 0) - (stats.totalVerifiedUsers || 0), 0) },
  ];

  const PIE_COLORS = ['#2563eb', '#93c5fd'];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
                <div className="px-4 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                  <p className="text-xs opacity-90">Manage users, services and more</p>
                </div>
                <nav className="p-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelected(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition mb-1 ${
                        selected === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-10">
              {/* Overview header cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
                  <p className="text-sm text-gray-500">Total Services</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
                  <p className="text-sm text-gray-500">Verified Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVerifiedUsers}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
                  <p className="text-sm text-gray-500">Active Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalConversations}</p>
                </div>
              </div>

              {/* Views */}
              {selected === 'overview' && (
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Platform Overview</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Verification Split</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip />
                          <Legend />
                          <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </section>
              )}

              {selected === 'users' && (
                <section className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Manage Users</h2>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search by name or email"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
                        className="px-3 py-2 border border-blue-200 rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleUserSearch}
                        className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        title="Search users"
                      >
                        <HiSearch className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Skills</th>
                          <th className="px-4 py-2 text-left">Admin</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <tr key={user._id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-2 font-medium">{user.name}</td>
                              <td className="px-4 py-2">{user.email}</td>
                              <td className="px-4 py-2">
                                {Array.isArray(user.skills) ? user.skills.join(', ') : ''}
                              </td>
                              <td className="px-4 py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-6 text-gray-500">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination currentPage={userPage} total={userTotal} setPage={setUserPage} />
                </section>
              )}

              {selected === 'services' && (
                <section className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Manage Services</h2>
                    <input
                      type="text"
                      placeholder="Filter by title"
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      className="px-3 py-2 border border-blue-200 rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Client</th>
                          <th className="px-4 py-2 text-left">Title</th>
                          <th className="px-4 py-2 text-left">Budget</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.length > 0 ? (
                          services.map((service) => (
                            <tr key={service._id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-2">{service.client_id?.name || 'Unknown'}</td>
                              <td className="px-4 py-2">{service.title}</td>
                              <td className="px-4 py-2">{service.budget || 'N/A'}</td>
                              <td className="px-4 py-2">
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                                    ${service.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : service.status === 'accepted'
                                      ? 'bg-blue-100 text-blue-800'
                                      : service.status === 'hired'
                                      ? 'bg-green-100 text-green-800'
                                      : service.status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                  {service.status}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={() => handleDeleteService(service._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-6 text-gray-500">
                              No services found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination currentPage={servicePage} total={serviceTotal} setPage={setServicePage} />
                </section>
              )}

              {selected === 'verified' && (
                <section className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Verified Users</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">User</th>
                          <th className="px-4 py-2 text-left">Skills</th>
                          <th className="px-4 py-2 text-left">Profile Completion</th>
                          <th className="px-4 py-2 text-left">Verified Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verifiedUsers.length > 0 ? (
                          verifiedUsers.map((user) => (
                            <tr key={user._id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-2">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </td>
                              <td className="px-4 py-2">
                                {Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || 'N/A'}
                              </td>
                              <td className="px-4 py-2">{user.profile_completion}%</td>
                              <td className="px-4 py-2">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center py-6 text-gray-500">
                              No verified users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination currentPage={verifiedPage} total={verifiedTotal} setPage={setVerifiedPage} />
                </section>
              )}

              {selected === 'conversations' && (
                <section className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Active Conversations</h2>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Now</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalConversations}</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ name: 'Active', value: stats.totalConversations || 0 }] }>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;