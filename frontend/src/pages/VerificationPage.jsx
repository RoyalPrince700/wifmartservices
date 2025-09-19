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
  HiExclamation,
  HiCheck,
  HiX
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

  // Tier configurations with benefits
  const tierConfigs = {
    basic: {
      name: "Basic",
      monthlyPrice: 1000,
      yearlyPrice: 10000,
      color: "blue",
      popular: false,
      benefits: [
        { icon: <HiShieldCheck className="w-5 h-5" />, text: "Verified Badge", included: true },
        { icon: <HiTrendingUp className="w-5 h-5" />, text: "1.2x Search Ranking Boost", included: true },
        { icon: <HiEye className="w-5 h-5" />, text: "1.5x Profile Visibility", included: true },
        { icon: <HiDocumentText className="w-5 h-5" />, text: "CAC Upload Access", included: true },
        { icon: <HiStar className="w-5 h-5" />, text: "Up to 10 Portfolio Images", included: true },
        { icon: <HiCurrencyDollar className="w-5 h-5" />, text: "Basic Support", included: true },
        { icon: <HiStar className="w-5 h-5" />, text: "Priority Support", included: false },
        { icon: <HiTrendingUp className="w-5 h-5" />, text: "Featured Listings", included: false }
      ]
    },
    premium: {
      name: "Premium",
      monthlyPrice: 2000,
      yearlyPrice: 20000,
      color: "purple",
      popular: true,
      benefits: [
        { icon: <HiShieldCheck className="w-5 h-5" />, text: "Verified Badge", included: true },
        { icon: <HiTrendingUp className="w-5 h-5" />, text: "1.5x Search Ranking Boost", included: true },
        { icon: <HiEye className="w-5 h-5" />, text: "2x Profile Visibility", included: true },
        { icon: <HiDocumentText className="w-5 h-5" />, text: "CAC Upload Access", included: true },
        { icon: <HiStar className="w-5 h-5" />, text: "Up to 20 Portfolio Images", included: true },
        { icon: <HiCurrencyDollar className="w-5 h-5" />, text: "Priority Support", included: true },
        { icon: <HiStar className="w-5 h-5" />, text: "Featured Listings", included: true },
        { icon: <HiTrendingUp className="w-5 h-5" />, text: "Advanced Analytics", included: true }
      ]
    },
    ultimate: {
      name: "Ultimate",
      monthlyPrice: 3000,
      yearlyPrice: 30000,
      color: "emerald",
      popular: false,
      benefits: [
        { icon: <HiShieldCheck className="w-5 h-5" />, text: "Verified Badge", included: true },
        { icon: <HiTrendingUp className="w-5 h-5" />, text: "2x Search Ranking Boost", included: true },
        { icon: <HiEye className="w-5 h-5" />, text: "3x Profile Visibility", included: true },
        { icon: <HiDocumentText className="w-5 h-5" />, text: "CAC Upload Access", included: true },
        { icon: <HiStar className="w-5 h-5" />, text: "Up to 35 Portfolio Images", included: true },
        { icon: <HiCurrencyDollar className="w-5 h-5" />, text: "Priority Support", included: true },
        { icon: <HiStar className="w-5 h-5" />, text: "Featured Listings", included: true },
        { icon: <HiTrendingUp className="w-5 h-5" />, text: "Custom Branding", included: true }
      ]
    }
  };

  // Payment handlers
  const handleBuyBadge = async (plan, tier = 'basic') => {
    setPaymentLoading(true);
    try {
      console.log("🌍 Environment Variables Check:");
      console.log("  - API Base URL:", import.meta.env.VITE_API_BASE_URL);
      console.log("  - Flutterwave Public Key:", import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ? "✅ Loaded" : "❌ Missing");

      const { txRef, amount, customer } = await initiateBadgePayment(plan, tier);
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
            title: `Get ${tierConfigs[tier]?.name} Verified Badge`,
            description: `Pay ₦${amount} to unlock ${tier} features`,
            logo: 'https://wifmart.com/wifmart-icon.png',
          },
          callback: async (response) => {
            console.log("✅ Flutterwave callback:", response);

            try {
              const result = await verifyBadgePayment(response.transaction_id);

              if (result.success) {
                toast.success(`🎉 Success! You're now verified with ${tierConfigs[tier]?.name} plan!`);
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

  const handleRenewBadge = (tier = 'basic') => {
    handleBuyBadge('yearly', tier);
  };

  const getColorClasses = (color, variant = 'primary') => {
    const colorMap = {
      blue: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200',
        text: 'text-blue-600',
        border: 'border-blue-500',
        bg: 'bg-blue-50'
      },
      purple: {
        primary: 'bg-purple-600 hover:bg-purple-700 text-white',
        secondary: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200',
        text: 'text-purple-600',
        border: 'border-purple-500',
        bg: 'bg-purple-50'
      },
      emerald: {
        primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        secondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-200',
        text: 'text-emerald-600',
        border: 'border-emerald-500',
        bg: 'bg-emerald-50'
      }
    };
    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

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
                <p className="text-sm text-gray-600">Choose your subscription tier and manage verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Current Status */}
        {isBadgeActive && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Current Subscription</h2>
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                <HiCheckCircle className="w-4 h-4" />
                <span>Active</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${getColorClasses(tierConfigs[user.subscriptionTier]?.color || 'blue', 'bg')}`}>
                <h3 className={`font-semibold ${getColorClasses(user.subscriptionTier || 'blue', 'text')}`}>
                  {tierConfigs[user.subscriptionTier]?.name || 'Basic'} Plan
                </h3>
                <p className="text-sm text-gray-600">Current tier</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{user.subscriptionType === 'yearly' ? 'Yearly' : 'Monthly'}</h3>
                <p className="text-sm text-gray-600">Billing cycle</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{daysRemaining} days left</h3>
                <p className="text-sm text-gray-600">Until {formatDate(user.subscriptionEnd)}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => handleRenewBadge(user.subscriptionTier)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Renew Subscription
              </button>
              <button
                onClick={() => navigate('/profile/edit')}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
              >
                Manage CAC
              </button>
            </div>
          </div>
        )}

        {/* Pricing Tiers */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isBadgeActive ? 'Upgrade Your Plan' : 'Choose Your Verification Tier'}
            </h2>
            <p className="text-lg text-gray-600">
              Select the plan that best fits your business needs and unlock powerful features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(tierConfigs).map(([tierKey, config]) => (
              <div key={tierKey} className={`relative bg-white border-2 rounded-xl p-6 ${
                config.popular 
                  ? `${getColorClasses(config.color, 'border')} shadow-lg` 
                  : 'border-gray-200'
              }`}>
                {config.popular && (
                  <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${getColorClasses(config.color, 'primary')} px-4 py-1 rounded-full text-sm font-medium`}>
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold ${getColorClasses(config.color, 'text')} mb-2`}>{config.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">₦{config.monthlyPrice.toLocaleString()}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-lg font-semibold text-gray-700">₦{config.yearlyPrice.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm">/year</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Save ₦{((config.monthlyPrice * 12) - config.yearlyPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {config.benefits.map((benefit, idx) => (
                    <div key={idx} className={`flex items-center space-x-3 ${benefit.included ? 'text-gray-900' : 'text-gray-400'}`}>
                      <div className={benefit.included ? getColorClasses(config.color, 'text') : 'text-gray-300'}>
                        {benefit.included ? <HiCheck className="w-5 h-5" /> : <HiX className="w-5 h-5" />}
                      </div>
                      <span className="text-sm">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleBuyBadge('monthly', tierKey)}
                    disabled={paymentLoading}
                    className={`w-full py-3 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getColorClasses(config.color, 'primary')}`}
                  >
                    {paymentLoading ? 'Processing...' : 'Monthly Plan'}
                  </button>
                  <button
                    onClick={() => handleBuyBadge('yearly', tierKey)}
                    disabled={paymentLoading}
                    className={`w-full py-3 font-medium rounded-lg transition-colors border disabled:opacity-50 disabled:cursor-not-allowed ${getColorClasses(config.color, 'secondary')}`}
                  >
                    {paymentLoading ? 'Processing...' : 'Yearly Plan (Best Value)'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAC Verification Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
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
                    user?.cac_status === 'Pending Verification' 
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
                  <h3 className="font-semibold text-amber-900">CAC Upload Requires Active Subscription</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    You need an active verification subscription to upload CAC documents.
                  </p>
                </div>
              </div>
            </div>
          )}
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
  );
};

export default VerificationPage;
