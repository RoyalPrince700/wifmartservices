// frontend/src/pages/Dashboard.jsx
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Import named functions
import {
  getHiredProviders,
  getClients,
  getHireRequests,
  updateHireStatus,
  leaveReview, initiateBadgePayment,   // ✅ Add this
  verifyBadgePayment      // ✅ And this
} from '../services/api';

import { AuthContext } from '../../src/contexts/AuthContext';
import toast from 'react-hot-toast'; // ✅ Don't forget this!
import ClientRequestModal from '../components/ClientRequestModal';

// Utility function to normalize IDs
const normalizeId = (id) => {
  if (!id) return '';
  if (typeof id === 'object' && id.$oid) return id.$oid;
  return id.toString();
};

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hiredProviders, setHiredProviders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [hireRequests, setHireRequests] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProviderRequest, setSelectedProviderRequest] = useState(null);
  
  useEffect(() => {
  const fetchData = async () => {
  try {
    setLoading(true);
    // console.log('🔍 Starting dashboard data fetch...');

    const providersRes = await getHiredProviders().catch(err => {
      // console.error('❌ getHiredProviders failed:', err);
      return { data: [] };
    });

    const clientsRes = await getClients().catch(err => {
      // console.error('❌ getClients failed:', err);
      return { data: [] };
    });

    const requestsRes = await getHireRequests().catch(() => ({ data: [] }));
    const rawData = requestsRes.data || requestsRes || [];

    const normalizedRequests = rawData.map(req => ({
      ...req,
      _id: req._id?.$oid || req._id?.toString() || req._id
    }));

    setHireRequests(normalizedRequests);
    setHiredProviders(providersRes.hiredProviders || []);
    setClients(clientsRes.clients || []);

  } catch (err) {
    // console.error('💥 Unexpected error in dashboard:', err);
    setError('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};


  if (token) {
    fetchData();
  } else {
    navigate('/signin');
  }
}, [token, navigate]);

  if (!token) return null;

  // Profile completion progress bar
  const ProfileCompletion = ({ completion }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${completion}%` }}
      ></div>
    </div>
  );

  // Status badge component
  const StatusBadge = ({ status, reason }) => {
    const getStatusConfig = (status) => {
      switch(status) {
        case 'Verified':
        case 'Approved':
          return { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' };
        case 'Pending':
          return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' };
        case 'Rejected':
          return { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' };
        default:
          return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '' };
      }
    };
    
    const config = getStatusConfig(status);
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
        {reason && status === 'Rejected' && (
          <div className="ml-2 text-xs" title={reason}>ℹ️</div>
        )}
      </div>
    );
  };

  // Dashboard card component
  const DashboardCard = ({ title, children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm p-4 md:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  );

  // Stats card component
  const StatCard = ({ title, value, subtitle, icon }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
      <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

 // Modified handleUpdateStatus function with logging
const handleUpdateStatus = async (serviceId, status) => {
  // console.log('🚀 handleUpdateStatus called with:', { serviceId, status });

  if (!serviceId) {
    // console.error('❌ Missing serviceId:', serviceId);
    toast.error('Failed to update: missing request ID');
    return;
  }

  if (!window.confirm(`Update status to "${status}"?`)) {
    // console.log('🛑 Status update cancelled by user');
    return;
  }

  try {
    // console.log('🔄 Calling updateHireStatus API with:', { serviceId, status });
    const response = await updateHireStatus(serviceId, status);
    // console.log('✅ updateHireStatus API response:', response);

    // ✅ Use `id`, not `_id` — no need for normalizeId
    setHireRequests((prev) =>
      prev.map((req) => (req.id === serviceId ? { ...req, status } : req))
    );

    toast.success('Status updated!');
  } catch (err) {
    // console.error('❌ Error updating status:', err);
    toast.error(err.message || 'Failed to update status');
  }
};

const submitReview = async (serviceId, rating, comment) => {
  try {
    await leaveReview(serviceId, rating, comment); // ✅ Use imported function
    toast.success('Review submitted!');
    
    // Refresh
    const providersRes = await getHiredProviders();
    setHiredProviders(providersRes.data);
  } catch (err) {
    toast.error(err.message);
  }
};

const handleLeaveReview = (serviceId) => {
  const rating = prompt('Rate this provider (1-5):');
  const comment = prompt('Add a comment (optional):');
  if (!rating || rating < 1 || rating > 5) {
    return toast.error('Rating must be between 1 and 5');
  }

  submitReview(serviceId, rating, comment);
};

  // Render different content based on active tab
  const renderTabContent = () => {
  switch(activeTab) {
    case 'overview':
      return (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatCard 
              title="Hired Providers" 
              value={hiredProviders.length} 
              icon="👥"
            />
            <StatCard 
              title="Clients" 
              value={clients.length} 
              icon="👥"
            />
          </div>

          {/* ✅ Optional: Brief message */}
          <div className="text-center py-8 text-gray-500">
            <p>Go to the <strong>Providers</strong> and <strong>Clients</strong> tabs to see full lists.</p>
          </div>
        </>
      );

case 'providers':
  return (
    <DashboardCard title="Hired Providers">
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : hiredProviders.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {hiredProviders.map((provider) => (
            <li key={provider.id} className="py-4 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-medium text-blue-800">
                  {provider.name?.charAt(0).toUpperCase() || 'P'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{provider.name}</p>
                <p className="text-sm text-gray-500">{provider.service || 'No service'}</p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={provider.status || 'hired'} />
              </div>

              {/* Only View Details Button */}
              <div className="ml-4">
                <button
  onClick={() => setSelectedProviderRequest({
    name: provider.name,
    profile_image: provider.profile_image,
    whatsapp: provider.whatsapp, // if available
    requestDetails: {
      title: provider.title,
      budget: provider.budget,
      event_date: provider.event_date,
      location: provider.location,
      phone: provider.phone,
      email: provider.email,
      message: provider.message,
      attachment_url: provider.attachment_url,
    },
  })}
  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
>
  View Details
</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't hired any providers yet.</p>
          <button 
            onClick={() => navigate('/search')}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Find Providers
          </button>
        </div>
      )}
    </DashboardCard>
  );  
  case 'hire-requests':
  return (
    <DashboardCard title="Hire Requests">
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : hireRequests.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {hireRequests.map((req) => (
  <li key={req._id} className="py-4">
    <div className="flex items-center mb-2">
      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
        <span className="font-medium text-green-800">
          {req.client_id?.name?.charAt(0).toUpperCase() || 'U'}
        </span>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">{req.client_id?.name}</p>
        <p className="text-sm text-gray-500">{req.title}</p>
      </div>
      <div className="ml-auto">
        <StatusBadge status={req.status} />
      </div>
    </div>
    <p className="text-sm text-gray-600 mb-2">{req.message}</p>
    {req.budget && <p className="text-xs text-gray-500">Budget: {req.budget}</p>}
    
    {req.status === 'pending' && (
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => handleUpdateStatus(req._id, 'accepted')}
          className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Accept
        </button>
        <button
          onClick={() => handleUpdateStatus(req._id, 'rejected')}
          className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    )}
    {req.status === 'hired' && (
      <button
        onClick={() => handleUpdateStatus(req._id, 'completed')}
        className="mt-3 text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Mark as Completed
      </button>
    )}
  </li>
))}
        </ul>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No hire requests yet. Share your profile to get more visibility!
        </div>
      )}
    </DashboardCard>
  );
      
case 'clients':
  return (
    <DashboardCard title="Hire History">
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      ) : hireRequests.length > 0 ? (
        <div className="space-y-4">
          {hireRequests.map((req) => (
            <div
              key={req._id}
              className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm group"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {req.client_id?.name?.charAt(0).toUpperCase() || 'C'}
                </span>
              </div>

              {/* Content */}
              <div className="ml-4 flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {req.client_id?.name}
                </h3>
                <p className="text-sm text-gray-700 mt-0.5 line-clamp-1">
                  {req.title || 'No title'}
                </p>

                <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-500">
                  {req.location && <span>📍 {req.location}</span>}
                  {req.event_date && (
                    <span>📅 {new Date(req.event_date).toLocaleDateString()}</span>
                  )}
                  {req.budget && <span>💰 {req.budget}</span>}
                </div>
              </div>

              {/* Actions: View Details + Status Dropdown */}
              <div className="flex flex-col ml-2 space-y-2 min-w-[160px]">
                {/* View Details Button */}
                <button
                  onClick={() => setSelectedClient(req)}
                  className="w-full px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  View Details
                </button>

               {/* Status Dropdown */}
{/* Status Dropdown */}
<select
  value={req.status || 'pending'}
  onChange={(e) => {
    const newStatus = e.target.value;
    const id = req.id; // ✅ Use `id`, not `_id`
    if (!id) {
      console.error('❌ No ID found for request:', req);
      toast.error('Cannot update: missing ID');
      return;
    }
    handleUpdateStatus(id, newStatus);
  }}
  className="w-full px-2 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-800"
>
  <option value="pending">Pending</option>
  <option value="accepted">Accepted</option>
  <option value="rejected">Rejected</option>
  <option value="hired">Hired</option>
  <option value="completed">Completed</option>
</select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gray-500 text-xl">📁</span>
          </div>
          <p className="text-gray-500 text-sm">No hire history yet.</p>
        </div>
      )}
    </DashboardCard>
  );
 case 'verification':
  const isBadgeActive = user?.isVerifiedBadge && isSubscriptionActive(user.subscriptionEnd);
  const isBadgeExpired = user?.isVerifiedBadge && !isSubscriptionActive(user.subscriptionEnd);

  return (
    <div className="space-y-6">
      {/* ✅ Badge Verification Section */}
      <DashboardCard title="Verified Badge">
        {isBadgeActive ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status="Verified" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Active</p>
                <p className="text-xs text-gray-500">Expires {formatDate(user.subscriptionEnd)}</p>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ You have a verified badge! Your profile is trusted and gets higher visibility.
              </p>
            </div>
          </div>
        ) : isBadgeExpired ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status="Expired" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-600">Expired</p>
                <p className="text-xs text-gray-500">Was active until {formatDate(user.subscriptionEnd)}</p>
              </div>
            </div>
            <button
              onClick={handleRenewBadge}
              className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Renew Verified Badge
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Pay to unlock:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
              <li>Upload CAC certificate</li>
              <li>Add more portfolio images</li>
              <li>Verified badge on your profile</li>
              <li>Higher search ranking</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleBuyBadge('monthly')}
                className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Pay ₦1,000/month
              </button>
              <button
                onClick={() => handleBuyBadge('yearly')}
                className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
              >
                Pay ₦10,000/year 🎉 Save ₦2,000!
              </button>
            </div>
          </div>
        )}
      </DashboardCard>

      {/* CAC Verification (only visible if badge is active) */}
      <DashboardCard title="CAC Verification">
        {user?.cac_status === 'Verified' ? (
          <div className="flex items-center justify-between">
            <StatusBadge status="Verified" />
            <p className="text-sm text-green-600">You're all set!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status={user?.cac_status || 'Not Submitted'} />
              </div>
              {isBadgeActive && user?.cac_status !== 'Verified' && (
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Upload CAC
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {isBadgeActive
                ? "Upload your CAC certificate to complete business verification."
                : "Unlock Verified Badge first to upload CAC."}
            </p>
          </>
        )}
      </DashboardCard>

      {/* Manual Verification (admin-approved) - for non-paying users */}
      <DashboardCard title="Account Verification">
        {!user?.isVerifiedBadge && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge 
                  status={user?.verification_status || 'Not Applied'} 
                  reason={user?.verification_rejection_reason} 
                />
              </div>
              {user?.verification_status !== 'Approved' && (
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  {user?.verification_status === 'Rejected' ? 'Re-apply' : 'Apply Now'}
                </button>
              )}
            </div>

            {user?.verification_status === 'Rejected' && user?.verification_rejection_reason && (
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                <p className="text-sm text-red-700">{user.verification_rejection_reason}</p>
              </div>
            )}
          </>
        )}

        {user?.isVerifiedBadge && (
          <div className="text-center py-4">
            <StatusBadge status="Verified" />
            <p className="text-sm text-green-700 mt-2">
              ✅ You have a verified badge via payment. No manual approval needed.
            </p>
          </div>
        )}
      </DashboardCard>
    </div>
  );   
      default:
        return null;
    }
  };

  // ✅ Add this helper at the top (inside Dashboard component)
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const isSubscriptionActive = (endDate) => {
  return endDate && new Date(endDate) > new Date();
};

const handleBuyBadge = async (plan) => {
  try {
    // ✅ Step 1: Get real txRef from backend
    const { txRef, amount, customer } = await initiateBadgePayment(plan);
    console.log("🚀 Generated txRef:", txRef); // Should be "badge_..."

    // ✅ Step 2: Load Flutterwave
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;

    script.onload = () => {
      console.log("⚡ Flutterwave loaded");

      window.FlutterwaveCheckout({
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: txRef,  // ✅ Use your txRef
        amount: amount,
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: {
          email: customer.email,
          phone_number: customer.phone,
          name: customer.name,
        },
        customizations: {
          title: 'Get Verified Badge',
          description: `Pay ₦${amount} to unlock full features`,
          logo: 'https://wifmart.com/logo.png',
        },
        callback: async (response) => {
  console.log("✅ Flutterwave callback:", response);

  try {
    // ✅ Send Flutterwave's transaction_id, not your txRef
    const result = await verifyBadgePayment(response.transaction_id);

    if (result.success) {
      toast.success('🎉 Success! You’re now verified!');
      window.location.reload();
    } else {
      toast.error('Verification failed: ' + (result.message || result.error));
    }
  } catch (err) {
    console.error("❌ Verification error:", err);
    toast.error('Could not verify payment. Contact support.');
  }
},
        onclose: () => {
          console.log("Modal closed");
        },
      });
    };

    script.onerror = () => {
      toast.error("Failed to load payment gateway");
    };

    document.body.appendChild(script);
  } catch (error) {
    console.error("💥 Payment initiation failed:", error);
    toast.error(error.message || "Payment setup failed");
  }
};

// ✅ Handle renewing expired badge
const handleRenewBadge = () => {
  const plan = window.confirm('Renew yearly for ₦10,000? (Save ₦2,000)')
    ? 'yearly'
    : 'monthly';
  handleBuyBadge(plan);
};

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={() => navigate('/profile/edit')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview (visible on all tabs) */}
          <div className="md:col-span-1 space-y-6">
            <DashboardCard title="Profile Overview">
              {user ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    {user.profile_image ? (
                      <img 
                        src={user.profile_image} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" 
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                        <span className="text-2xl font-bold text-blue-600">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                    <h2 className="mt-3 text-lg font-semibold text-gray-800">{user.name}</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                      <span className="text-sm font-semibold text-blue-600">{user.profile_completion}%</span>
                    </div>
                    <ProfileCompletion completion={user.profile_completion} />
                    <button
                      onClick={() => navigate('/profile/edit')}
                      className="mt-4 w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Complete Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              )}
            </DashboardCard>

            {/* Verification Status Summary */}
<DashboardCard title="Verification Status">
  <div className="space-y-4">
    {/* CAC */}
    <div>
      <p className="text-sm text-gray-600 mb-2">CAC</p>
      <StatusBadge status={user?.cac_status || 'Locked'} />
    </div>

    {/* Account Verification */}
    <div>
      <p className="text-sm text-gray-600 mb-2">Account</p>
      {user?.isVerifiedBadge ? (
        <StatusBadge status="Verified" />
      ) : (
        <StatusBadge status={user?.verification_status || 'Pending'} />
      )}
    </div>

    {/* Verified Badge Status */}
    {user?.isVerifiedBadge && (
      <div>
        <p className="text-sm text-gray-600 mb-2">Paid Badge</p>
        <StatusBadge status="Active" />
        <p className="text-xs text-gray-500 mt-1">
          Until {formatDate(user.subscriptionEnd)}
        </p>
      </div>
    )}

    <button 
      onClick={() => setActiveTab('verification')}
      className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-lg"
    >
      Manage Verification
    </button>
  </div>
</DashboardCard>
          </div>

          {/* Right Column - Main Content (changes based on active tab) */}
          <div className="md:col-span-2 space-y-6">
            {/* Desktop Tab Navigation */}
<div className="hidden md:flex bg-white rounded-xl shadow-sm overflow-hidden">
  {[
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'providers', label: 'Providers', icon: '👥' },
    { id: 'clients', label: 'Clients', icon: '🤝' },
    // ✅ Only show "Hire Requests" if user has skills (i.e., is a provider)
    user?.skills?.length > 0 && {
      id: 'hire-requests',
      label: 'Requests',
      icon: '📬'
    },
    { id: 'verification', label: 'Verification', icon: '✅' }
  ]
    .filter(Boolean) // 👈 This removes any `false` or `undefined` entries
    .map((tab) => (
      <button
        key={tab.id}
        className={`flex-1 py-3 text-sm font-medium text-center flex items-center justify-center ${
          activeTab === tab.id
            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => setActiveTab(tab.id)}
      >
        <span className="mr-2">{tab.icon}</span>
        {tab.label}
      </button>
    ))}
</div>

            {/* Mobile Tab Navigation */}
<div className="md:hidden flex bg-white rounded-xl shadow-sm overflow-x-auto scrollbar-hide">
  {[
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'providers', label: 'Providers', icon: '👥' },
    { id: 'clients', label: 'Clients', icon: '🤝' },
    // ✅ Only show "Requests" tab if user has skills
    user?.skills?.length > 0 && {
      id: 'hire-requests',
      label: 'Requests',
      icon: '📬'
    },
    { id: 'verification', label: 'Verify', icon: '✅' }
  ]
    .filter(Boolean) // Removes invalid entries
    .map((tab) => (
      <button
        key={tab.id}
        className={`px-4 py-3 text-sm font-medium text-center flex-shrink-0 ${
          activeTab === tab.id
            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => setActiveTab(tab.id)}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg mb-1">{tab.icon}</span>
          <span>{tab.label}</span>
        </div>
      </button>
    ))}
</div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </main>
      {selectedClient && (
  <ClientRequestModal
    client={selectedClient}
    onClose={() => setSelectedClient(null)}
  />
)}
{/* View Provider Request Details */}

{selectedProviderRequest && (
  <ClientRequestModal
    client={selectedProviderRequest}
    onClose={() => setSelectedProviderRequest(null)}
  />
)}
    </div>
  );
};

export default Dashboard;