// src/components/admin/BadgeVerificationTab.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const BadgeVerificationTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchRequests();
  }, [page]);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/api/admin/badge-requests', {
        params: { page, limit }
      });
      setRequests(res.data.requests);
      setTotal(res.data.total);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load badge requests');
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Grant verified badge to this user?')) return;
    try {
      await api.post(`/api/admin/approve-badge/${id}`);
      toast.success('Badge granted');
      fetchRequests();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Rejection reason (optional):') || 'Does not meet criteria';
    try {
      await api.post(`/api/admin/reject-badge/${id}`, { reason });
      toast.success('Badge request rejected');
      fetchRequests();
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  const Pagination = () => {
    const totalPages = Math.ceil(total / limit);
    return (
      <div className="flex justify-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) return <p className="text-center py-6">Loading badge requests...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Badge Verification Requests</h2>

      <table className="min-w-full bg-white shadow-md rounded-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Skills</th>
            <th className="px-4 py-2 text-left">Profile Completion</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((req) => (
              <tr key={req._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <p className="font-medium">{req.name}</p>
                  <p className="text-sm text-gray-500">{req.email}</p>
                </td>
                <td className="px-4 py-2">{req.skills.join(', ')}</td>
                <td className="px-4 py-2">{req.profile_completion}%</td>
                <td className="px-4 py-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                    {req.verification_status}
                  </span>
                </td>
                <td className="px-4 py-2 space-y-2">
                  <button
                    onClick={() => handleApprove(req._id)}
                    className="block w-full text-left text-green-500 hover:text-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    className="block w-full text-left text-red-500 hover:text-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No pending badge requests
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination />
    </div>
  );
};

export default BadgeVerificationTab;