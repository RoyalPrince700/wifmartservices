// frontend/src/pages/Dashboard.jsx
import { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiLogout } from 'react-icons/hi';

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

// Import extracted components
import ProfileOverview from '../components/dashboard/ProfileOverview';
import { StatCard } from '../components/dashboard/UIComponents';
import TabNavigation from '../components/dashboard/TabNavigation';
import ProvidersSection from '../components/dashboard/ProvidersSection';
import ClientsSection from '../components/dashboard/ClientsSection';
import VerificationSection from '../components/dashboard/VerificationSection';
import Loading from '../components/Loading';

// Utility function to normalize IDs
const normalizeId = (id) => {
  if (!id) return '';
  if (typeof id === 'object' && id.$oid) return id.$oid;
  return id.toString();
};

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hiredProviders, setHiredProviders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [hireRequests, setHireRequests] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProviderRequest, setSelectedProviderRequest] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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
          <ProvidersSection 
            hiredProviders={hiredProviders}
            loading={loading}
            setSelectedProviderRequest={setSelectedProviderRequest}
          />
        );

      case 'clients':
        return (
          <ClientsSection 
            hireRequests={hireRequests}
            loading={loading}
            setSelectedClient={setSelectedClient}
            handleUpdateStatus={handleUpdateStatus}
          />
        );

      case 'verification':
        return (
          <VerificationSection 
            user={user}
            handleBuyBadge={handleBuyBadge}
            handleRenewBadge={handleRenewBadge}
          />
        );

      default:
        return null;
    }
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

  // Show loading screen while initial data is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading
          variant="spinner"
          size="lg"
          color="blue"
          text="Loading your dashboard..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200"
                title="Account menu"
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/chat');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Messages
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile/edit');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Edit Profile
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to logout?')) {
                        setShowUserMenu(false);
                        logout();
                        navigate('/');
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <HiLogout className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
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
            <ProfileOverview user={user} />

         


          </div>

          {/* Right Column - Main Content (changes based on active tab) */}
          <div className="md:col-span-2 space-y-2">
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

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