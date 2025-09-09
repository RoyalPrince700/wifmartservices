import { useNavigate } from 'react-router-dom';
import { DashboardCard, StatusBadge } from './UIComponents';
import Loading from '../Loading';

const ProvidersSection = ({ hiredProviders, loading, setSelectedProviderRequest }) => {
  const navigate = useNavigate();

  return (
    <DashboardCard title="Hired Providers">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loading
            variant="spinner"
            size="lg"
            color="blue"
            text="Loading providers..."
          />
        </div>
      ) : hiredProviders.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {hiredProviders.map((provider) => {
            // Debug log to inspect verification fields
            console.log('👑 Provider Verified:', provider.name, {
              isVerifiedBadge: provider?.isVerifiedBadge,
              isVerified: provider?.isVerified,
              verification_status: provider?.verification_status,
            });

            // Verification logic
            const verified =
              provider?.isVerifiedBadge === true ||
              provider?.isVerified === true ||
              (typeof provider?.verification_status === 'string' &&
                provider?.verification_status.toLowerCase() === 'approved');

            return (
              <li key={provider.id} className="py-4 flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-blue-800">
                      {provider.name?.charAt(0).toUpperCase() || 'P'}
                    </span>
                  </div>
                  <div className="ml-3 flex items-center">
                    <p className="text-sm font-medium text-gray-900 truncate">{provider.name}</p>
                    {/* Verified Badge */}
                    {verified && (
                      <span className="flex-shrink-0 ml-2 bg-blue-500 text-white rounded-full p-1.5 shadow-md flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-0 mt-2 sm:ml-3 sm:mt-0">
                  <p className="text-sm text-gray-500">{provider.service || 'No service'}</p>
                </div>
                <div className="ml-auto mt-2 sm:mt-0">
                  <StatusBadge status={provider.status || 'hired'} />
                </div>
                {/* View Details Button */}
                <div className="ml-0 mt-3 sm:ml-4 sm:mt-0">
                  <button
                    onClick={() => setSelectedProviderRequest({
                      name: provider.name,
                      profile_image: provider.profile_image,
                      whatsapp: provider.whatsapp,
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
            );
          })}
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
};

export default ProvidersSection;
