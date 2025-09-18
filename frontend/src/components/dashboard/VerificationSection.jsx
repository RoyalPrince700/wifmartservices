import { useNavigate } from 'react-router-dom';
import { DashboardCard, StatusBadge } from './UIComponents';
import { HiCheckCircle } from 'react-icons/hi';

const VerificationSection = ({
  user,
  handleBuyBadge,
  handleRenewBadge
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
          <button
            onClick={() => navigate('/verification')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
          >
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
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
              className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              Renew Verified Badge
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Choose your verification tier:
            </p>
            
            <div className="space-y-3">
              {/* Basic Tier */}
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-600">Basic</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">5 Portfolio Images</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBuyBadge('monthly', 'basic')}
                    className="py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 flex flex-col items-center justify-center"
                  >
                    <div className="font-semibold">₦1,000</div>
                    <div>1 month</div>
                  </button>
                  <button
                    onClick={() => handleBuyBadge('yearly', 'basic')}
                    className="py-2 bg-blue-100 text-blue-700 text-xs font-medium rounded hover:bg-blue-200 flex flex-col items-center justify-center border border-blue-200"
                  >
                    <div className="font-semibold">₦10,000</div>
                    <div>1 year</div>
                  </button>
                </div>
              </div>

              {/* Premium Tier */}
              <div className="border-2 border-purple-200 rounded-lg p-3 bg-purple-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-purple-600">Premium</h4>
                  <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Most Popular</span>
                </div>
                <div className="text-xs text-purple-600 mb-2">15 Portfolio Images + Featured Listings</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBuyBadge('monthly', 'premium')}
                    className="py-2 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 flex flex-col items-center justify-center"
                  >
                    <div className="font-semibold">₦2,000</div>
                    <div>1 month</div>
                  </button>
                  <button
                    onClick={() => handleBuyBadge('yearly', 'premium')}
                    className="py-2 bg-purple-100 text-purple-700 text-xs font-medium rounded hover:bg-purple-200 flex flex-col items-center justify-center border border-purple-200"
                  >
                    <div className="font-semibold">₦20,000</div>
                    <div>1 year</div>
                  </button>
                </div>
              </div>

              {/* Ultimate Tier */}
              <div className="border border-emerald-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-emerald-600">Ultimate</h4>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Unlimited</span>
                </div>
                <div className="text-xs text-emerald-600 mb-2">Unlimited Portfolio + Custom Branding</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBuyBadge('monthly', 'ultimate')}
                    className="py-2 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 flex flex-col items-center justify-center"
                  >
                    <div className="font-semibold">₦3,000</div>
                    <div>1 month</div>
                  </button>
                  <button
                    onClick={() => handleBuyBadge('yearly', 'ultimate')}
                    className="py-2 bg-emerald-100 text-emerald-700 text-xs font-medium rounded hover:bg-emerald-200 flex flex-col items-center justify-center border border-emerald-200"
                  >
                    <div className="font-semibold">₦30,000</div>
                    <div>1 year</div>
                  </button>
                </div>
              </div>
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
                      <li>Purchase a Verified Badge (Basic ₦1,000/month, Premium ₦2,000/month, Ultimate ₦3,000/month)</li>
                      <li>Complete your business verification</li>
                      <li>Gain access to tier-specific premium features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/verification')}
                className="w-full py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Choose Your Verification Tier
              </button>
              <p className="text-xs text-gray-500 mt-2">
                View all tiers and pricing options
              </p>
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

      {/* View Full Page Button */}
      <div className="text-center">
        <button
          onClick={() => navigate('/verification')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>View Full Verification Page</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VerificationSection;
