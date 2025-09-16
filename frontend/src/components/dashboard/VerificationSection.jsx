import { useNavigate } from 'react-router-dom';
import { DashboardCard, StatusBadge } from './UIComponents';
import { HiCheckCircle } from 'react-icons/hi';

const VerificationSection = ({
  user,
  handleBuyBadge,
  handleRenewBadge,
  paymentLoading
}) => {
  const navigate = useNavigate();

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
              <p className="text-sm text-green-800 flex items-center">
                <HiCheckCircle className="h-4 w-4 mr-2" />
                You have a verified badge! Your profile is trusted and gets higher visibility.
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
              disabled={paymentLoading}
              className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {paymentLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Renew Verified Badge'
              )}
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
                disabled={paymentLoading}
                className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {paymentLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Pay ₦1,000/month'
                )}
              </button>
              <button
                onClick={() => handleBuyBadge('yearly')}
                disabled={paymentLoading}
                className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {paymentLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Pay ₦10,000/year 🎉 Save ₦2,000!'
                )}
              </button>
            </div>
          </div>
        )}
      </DashboardCard>

      {/* CAC Verification */}
      <DashboardCard title="CAC Verification">
        {user?.cac_status === 'Verified' ? (
          <div className="flex items-center justify-between">
            <StatusBadge status="Verified" />
            <p className="text-sm text-green-600">You're all set!</p>
          </div>
        ) : isBadgeActive ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status={user?.cac_status || 'Not Submitted'} />
              </div>
              <button
                onClick={() => navigate('/profile/edit')}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Upload CAC
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Upload your CAC certificate to complete business verification.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status="Locked" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Verified Badge Required</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    CAC Upload Requires Verified Badge
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p className="mb-2">
                      <strong>CAC</strong> (Corporate Affairs Commission) is Nigeria's official business registration body. 
                      Your CAC number and certificate prove your business is legally registered.
                    </p>
                    <p className="mb-2">To upload your CAC documents, you need to:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Purchase a Verified Badge (₦1,000/month or ₦10,000/year)</li>
                      <li>Complete your business verification</li>
                      <li>Gain access to premium features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleBuyBadge('monthly')}
                disabled={paymentLoading}
                className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {paymentLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Get Verified Badge - ₦1,000/month'
                )}
              </button>
              <button
                onClick={() => handleBuyBadge('yearly')}
                disabled={paymentLoading}
                className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {paymentLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Get Verified Badge - ₦10,000/year'
                )}
              </button>
            </div>
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
            <p className="text-sm text-green-700 mt-2 flex items-center justify-center">
              <HiCheckCircle className="h-4 w-4 mr-2" />
              You have a verified badge via payment. No manual approval needed.
            </p>
          </div>
        )}
      </DashboardCard>
    </div>
  );
};

export default VerificationSection;
