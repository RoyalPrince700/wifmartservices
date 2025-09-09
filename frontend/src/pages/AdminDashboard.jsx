// src/pages/AdminDashboard.jsx
import React from 'react'; // ✅ Add this line
import { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toast } from 'react-hot-toast';
import Loading from '../components/Loading';

// API Functions
import {
  getAdminUsers,
  deleteAdminUser,
  getAdminServices,
  deleteAdminService,
  getAdminPortfolios,
  deleteAdminPortfolio,
  getCACRequests,
  approveCACVerification,
  rejectCACVerification,
  getBadgeRequests,
  approveBadgeVerification,
  rejectBadgeVerification,
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
  const [portfolios, setPortfolios] = useState([]);
  const [cacRequests, setCACRequests] = useState([]);
  const [badgeRequests, setBadgeRequests] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalPortfolios: 0,
    pendingVerifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [portfolioPage, setPortfolioPage] = useState(1);
  const [cacPage, setCACPage] = useState(1);
  const [badgePage, setBadgePage] = useState(1);
  const [userFilter, setUserFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const limit = 10;
  const [userTotal, setUserTotal] = useState(0);
  const [serviceTotal, setServiceTotal] = useState(0);
  const [portfolioTotal, setPortfolioTotal] = useState(0);
  const [cacTotal, setCACTotal] = useState(0);
  const [badgeTotal, setBadgeTotal] = useState(0);

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
        fetchData(getAdminPortfolios, setPortfolios, setPortfolioTotal, portfolioPage),
        fetchData(getCACRequests, setCACRequests, setCACTotal, cacPage),
        fetchData(getBadgeRequests, setBadgeRequests, setBadgeTotal, badgePage),
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
    portfolioPage,
    cacPage,
    badgePage,
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

  const handleDeletePortfolio = async (id) => {
    if (window.confirm('Delete this portfolio?')) {
      try {
        await deleteAdminPortfolio(id);
        toast.success('Portfolio deleted');
        fetchData(getAdminPortfolios, setPortfolios, setPortfolioTotal, portfolioPage);
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  // CAC Verification Actions
  const handleApproveCAC = async (id) => {
    if (window.confirm('Approve CAC verification?')) {
      try {
        await approveCACVerification(id);
        toast.success('CAC verified');
        fetchData(getCACRequests, setCACRequests, setCACTotal, cacPage);
      } catch (err) {
        toast.error('Approval failed');
      }
    }
  };

  const handleRejectCAC = async (id) => {
    const reason = prompt('Enter rejection reason:') || 'Invalid documentation';
    try {
      await rejectCACVerification(id, reason);
      toast.success('CAC application rejected');
      fetchData(getCACRequests, setCACRequests, setCACTotal, cacPage);
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  // Badge Verification Actions
  const handleApproveBadge = async (id) => {
    if (window.confirm('Grant verified badge?')) {
      try {
        await approveBadgeVerification(id);
        toast.success('Badge approved');
        fetchData(getBadgeRequests, setBadgeRequests, setBadgeTotal, badgePage);
      } catch (err) {
        toast.error('Approval failed');
      }
    }
  };

  const handleRejectBadge = async (id) => {
    const reason = prompt('Enter rejection reason:') || 'Does not meet criteria';
    try {
      await rejectBadgeVerification(id, reason);
      toast.success('Badge request rejected');
      fetchData(getBadgeRequests, setBadgeRequests, setBadgeTotal, badgePage);
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

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

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 shadow-md rounded-md text-center">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-3xl">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-md text-center">
            <h2 className="text-xl font-semibold">Total Services</h2>
            <p className="text-3xl">{stats.totalServices}</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-md text-center">
            <h2 className="text-xl font-semibold">Total Portfolios</h2>
            <p className="text-3xl">{stats.totalPortfolios}</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-md text-center">
            <h2 className="text-xl font-semibold">Pending Verifications</h2>
            <p className="text-3xl">{stats.pendingVerifications}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs>
          <TabList>
            <Tab>Users</Tab>
            <Tab>Services</Tab>
            <Tab>Portfolios</Tab>
            <Tab>CAC Verification</Tab>
            <Tab>Badge Verification</Tab>
          </TabList>

          {/* === USERS TAB === */}
          <TabPanel>
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <input
              type="text"
              placeholder="Filter by name or email"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
            />
            <table className="min-w-full bg-white shadow-md rounded-md">
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
            <Pagination currentPage={userPage} total={userTotal} setPage={setUserPage} />
          </TabPanel>

          {/* === SERVICES TAB === */}
          <TabPanel>
            <h2 className="text-2xl font-bold mb-4">Manage Services</h2>
            <input
              type="text"
              placeholder="Filter by title"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
            />
            <table className="min-w-full bg-white shadow-md rounded-md">
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
            <Pagination currentPage={servicePage} total={serviceTotal} setPage={setServicePage} />
          </TabPanel>

          {/* === PORTFOLIOS TAB === */}
          <TabPanel>
            <h2 className="text-2xl font-bold mb-4">Manage Portfolios</h2>
            <table className="min-w-full bg-white shadow-md rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Link</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.length > 0 ? (
                  portfolios.map((portfolio) => (
                    <tr key={portfolio._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{portfolio.user_id?.name || 'Unknown'}</td>
                      <td className="px-4 py-2">
                        <img
                          src={portfolio.image_url}
                          alt="Portfolio"
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        {portfolio.link ? (
                          <a href={portfolio.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            View
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDeletePortfolio(portfolio._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No portfolios found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination currentPage={portfolioPage} total={portfolioTotal} setPage={setPortfolioPage} />
          </TabPanel>

          {/* === CAC VERIFICATION TAB === */}
          <TabPanel>
            <h2 className="text-2xl font-bold mb-4">CAC Verification Requests</h2>
            <table className="min-w-full bg-white shadow-md rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">CAC Number</th>
                  <th className="px-4 py-2 text-left">Certificate</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cacRequests.length > 0 ? (
                  cacRequests.map((req) => (
                    <tr key={req._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <p className="font-medium">{req.name}</p>
                        <p className="text-sm text-gray-500">{req.email}</p>
                      </td>
                      <td className="px-4 py-2 font-mono text-sm">{req.cac_number}</td>
                      <td className="px-4 py-2">
                        {req.cac_certificate ? (
                          <a
                            href={req.cac_certificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View Certificate
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-2 space-y-2">
                        <button
                          onClick={() => handleApproveCAC(req._id)}
                          className="block w-full text-left text-green-500 hover:text-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectCAC(req._id)}
                          className="block w-full text-left text-red-500 hover:text-red-700"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No pending CAC requests
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination currentPage={cacPage} total={cacTotal} setPage={setCACPage} />
          </TabPanel>

          {/* === BADGE VERIFICATION TAB === */}
          <TabPanel>
            <h2 className="text-2xl font-bold mb-4">Badge Verification Requests</h2>
            <table className="min-w-full bg-white shadow-md rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Skills</th>
                  <th className="px-4 py-2 text-left">Profile Completion</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {badgeRequests.length > 0 ? (
                  badgeRequests.map((req) => (
                    <tr key={req._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <p className="font-medium">{req.name}</p>
                        <p className="text-sm text-gray-500">{req.email}</p>
                      </td>
                      <td className="px-4 py-2">{req.skills.join(', ')}</td>
                      <td className="px-4 py-2">{req.profile_completion}%</td>
                      <td className="px-4 py-2 space-y-2">
                        <button
                          onClick={() => handleApproveBadge(req._id)}
                          className="block w-full text-left text-green-500 hover:text-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectBadge(req._id)}
                          className="block w-full text-left text-red-500 hover:text-red-700"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No pending badge requests
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination currentPage={badgePage} total={badgeTotal} setPage={setBadgePage} />
          </TabPanel>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;