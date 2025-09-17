import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  initiateBadgePayment, 
  verifyBadgePayment 
} from '../services/api';
import toast from 'react-hot-toast';
import { 
  HiCheckCircle, 
  HiShieldCheck, 
  HiStar, 
  HiTrendingUp, 
  HiEye, 
  HiDocumentText,
  HiClock,
  HiCurrencyDollar,
  HiArrowLeft,
  HiExclamation
} from 'react-icons/hi';

const VerificationPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Helper functions
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

  const isBadgeActive = user?.isVerifiedBadge && isSubscriptionActive(user.subscriptionEnd);
  const isBadgeExpired = user?.isVerifiedBadge && !isSubscriptionActive(user.subscriptionEnd);

  // Calculate days remaining
  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = getDaysRemaining(user?.subscriptionEnd);

  // Payment handlers
  const handleBuyBadge = async (plan) => {
    setPaymentLoading(true);
    try {
      console.log("🌍 Environment Variables Check:");
      console.log("  - API Base URL:", import.meta.env.VITE_API_BASE_URL);
      console.log("  - Flutterwave Public Key:", import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ? "✅ Loaded" : "❌ Missing");

      const { txRef, amount, customer } = await initiateBadgePayment(plan);
      console.log("🚀 Generated txRef:", txRef);

      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;

      script.onload = () => {
        console.log("⚡ Flutterwave loaded");
        console.log("🔑 Frontend Flutterwave Public Key:", import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY);

        window.FlutterwaveCheckout({
          public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
          tx_ref: txRef,
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
              const result = await verifyBadgePayment(response.transaction_id);

              if (result.success) {
                toast.success('🎉 Success! You\'re now verified!');
                window.location.reload();
              } else {
                toast.error(`Verification failed: ${result.message || result.error}`);
              }
            } catch (err) {
              console.error("❌ Verification error:", err);
              toast.error('Could not verify payment. Contact support.');
            } finally {
              setPaymentLoading(false);
            }
          },
          onclose: () => {
            console.log("Modal closed");
            setPaymentLoading(false);
          },
        });
      };

      script.onerror = () => {
        toast.error("Failed to load payment gateway");
        setPaymentLoading(false);
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("💥 Payment initiation failed:", error);
      toast.error(error.message || "Payment setup failed");
      setPaymentLoading(false);
    }
  };

  const handleRenewBadge = () => {
    const plan = window.confirm('Renew yearly for ₦10,000? (Save ₦2,000)')
      ? 'yearly'
      : 'monthly';
    handleBuyBadge(plan);
  };

  const benefits = [
    {
      icon: <HiShieldCheck className="w-6 h-6 text-blue-600" />,
      title: "Verified Badge",
      description: "Display a trusted verification badge on your profile that builds instant credibility with clients"
    },
    {
      icon: <HiTrendingUp className="w-6 h-6 text-green-600" />,
      title: "Higher Search Ranking",
      description: "Get prioritized in search results and appear at the top when clients are looking for services"
    },
    {
      icon: <HiEye className="w-6 h-6 text-purple-600" />,
      title: "Increased Visibility",
      description: "Your profile gets 3x more views and appears in featured sections across the platform"
    },
    {
      icon: <HiDocumentText className="w-6 h-6 text-orange-600" />,
      title: "CAC Upload Access",
      description: "Upload your business registration documents to prove your business is legally registered"
    },
    {
      icon: <HiStar className="w-6 h-6 text-yellow-600" />,
      title: "Premium Portfolio",
      description: "Upload unlimited portfolio images to showcase your best work and attract more clients"
    },
    {
      icon: <HiCurrencyDollar className="w-6 h-6 text-emerald-600" />,
      title: "Higher Earning Potential",
      description: "Verified providers earn 40% more on average due to increased trust and visibility"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard?tab=verification')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Verification Center</h1>
                <p className="text-sm text-gray-600">Manage your verification status and subscription</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Benefits Section - Mobile First */}
        <div className="lg:hidden mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Benefits</h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
                {isBadgeActive && (
                  <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <HiCheckCircle className="w-4 h-4" />
                    <span>Active</span>
                  </div>
                )}
              </div>

              {isBadgeActive ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <HiShieldCheck className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-blue-900">Verified Badge</h3>
                          <p className="text-sm text-blue-700">Your profile is verified and trusted</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <HiClock className="w-8 h-8 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-green-900">Subscription Active</h3>
                          <p className="text-sm text-green-700">
                            {daysRemaining > 0 
                              ? `${daysRemaining} days remaining`
                              : 'Expires today'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Subscription End Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(user.subscriptionEnd)}
                        </p>
                      </div>
                      <button
                        onClick={handleRenewBadge}
                        disabled={paymentLoading}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                      >
                        {paymentLoading ? 'Processing...' : 'Renew Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : isBadgeExpired ? (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <HiExclamation className="w-6 h-6 text-red-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-900">Subscription Expired</h3>
                        <p className="text-sm text-red-700 mt-1">
                          Your verification expired on {formatDate(user.subscriptionEnd)}. 
                          Renew to restore all premium features.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleBuyBadge('monthly')}
                      disabled={paymentLoading}
                      className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {paymentLoading ? 'Processing...' : 'Renew Monthly - ₦1,000'}
                    </button>
                    <button
                      onClick={() => handleBuyBadge('yearly')}
                      disabled={paymentLoading}
                      className="flex-1 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {paymentLoading ? 'Processing...' : 'Renew Yearly - ₦10,000 (Save ₦2,000)'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <HiShieldCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Verified Today</h3>
                    <p className="text-gray-600 mb-6">
                      Unlock premium features and increase your earning potential
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleBuyBadge('monthly')}
                      disabled={paymentLoading}
                      className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {paymentLoading ? 'Processing...' : 'Get Verified - ₦1,000/month'}
                    </button>
                    <button
                      onClick={() => handleBuyBadge('yearly')}
                      disabled={paymentLoading}
                      className="flex-1 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {paymentLoading ? 'Processing...' : 'Get Verified - ₦10,000/year (Save ₦2,000)'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CAC Verification Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">CAC Verification</h2>
              
              {user?.cac_status === 'Verified' ? (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <HiCheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">CAC Verified</h3>
                      <p className="text-sm text-green-700">Your business is legally registered and verified</p>
                    </div>
                  </div>
                </div>
              ) : isBadgeActive ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user?.cac_status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user?.cac_status || 'Not Submitted'}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/profile/edit')}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      {user?.cac_status === 'Rejected' ? 'Re-upload CAC' : 'Upload CAC'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Upload your CAC certificate to complete business verification and gain additional trust.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <HiExclamation className="w-6 h-6 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900">CAC Upload Requires Verified Badge</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        You need an active verification subscription to upload CAC documents.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Benefits */}
          <div className="space-y-6">
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Benefits</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Plans</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Monthly</h4>
                    <span className="text-2xl font-bold text-blue-600">₦1,000</span>
                  </div>
                  <p className="text-sm text-gray-600">Perfect for testing the waters</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-green-200 relative">
                  <div className="absolute -top-2 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Best Value
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Yearly</h4>
                    <span className="text-2xl font-bold text-green-600">₦10,000</span>
                  </div>
                  <p className="text-sm text-gray-600">Save ₦2,000 annually</p>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Having trouble with verification or payment? Our support team is here to help.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
