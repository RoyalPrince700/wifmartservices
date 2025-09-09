import { DashboardCard } from './UIComponents';
import toast from 'react-hot-toast';
import Loading from '../Loading';

const ClientsSection = ({ hireRequests, loading, setSelectedClient, handleUpdateStatus }) => {
  return (
    <DashboardCard title="Requests to Hire You">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loading
            variant="spinner"
            size="lg"
            color="blue"
            text="Loading hire requests..."
          />
        </div>
      ) : hireRequests.length > 0 ? (
        <div className="space-y-3">
          {hireRequests.map((req) => {
            // Debug log to inspect verification fields
            console.log('👑 Client Verified:', req.client_id?.name || 'Unknown', {
              client_id: req.client_id,
              isVerifiedBadge: req.client_id?.isVerifiedBadge,
              isVerified: req.client_id?.isVerified,
              verification_status: req.client_id?.verification_status,
            });

            // Verification logic
            const verified =
              req.client_id?.isVerifiedBadge === true ||
              req.client_id?.isVerified === true ||
              (typeof req.client_id?.verification_status === 'string' &&
                req.client_id?.verification_status.toLowerCase() === 'approved');

            return (
              <div
                key={req._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden p-4">
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">
                        {req.client_id?.name?.charAt(0).toUpperCase() || 'C'}
                      </span>
                    </div>
                    
                    {/* Name and Title */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {req.client_id?.name || 'Unknown Client'}
                        </h3>
                        {/* Smaller Verified Badge */}
                        {verified && (
                          <span className="flex-shrink-0 bg-blue-500 text-white rounded-full p-1 shadow-sm flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-2.5 w-2.5"
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
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {req.title || 'No title'}
                      </p>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                    {req.location && <span>📍 {req.location}</span>}
                    {req.event_date && (
                      <span>📅 {new Date(req.event_date).toLocaleDateString()}</span>
                    )}
                    {req.budget && <span>💰 {req.budget}</span>}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => setSelectedClient(req)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                    >
                      View Details
                    </button>
                    <select
                      value={req.status || 'pending'}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        const id = req.id;
                        if (!id) {
                          console.error('❌ No ID found for request:', req);
                          toast.error('Cannot update: missing ID');
                          return;
                        }
                        handleUpdateStatus(id, newStatus);
                      }}
                      className="flex-1 px-2 py-2 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block p-5">
                  <div className="flex items-center justify-between">
                    {/* Left: Avatar, Name, Title */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {req.client_id?.name?.charAt(0).toUpperCase() || 'C'}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {req.client_id?.name || 'Unknown Client'}
                          </h3>
                          {/* Smaller Verified Badge */}
                          {verified && (
                            <span className="flex-shrink-0 bg-blue-500 text-white rounded-full p-1 shadow-sm flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-2.5 w-2.5"
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
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {req.title || 'No title'}
                        </p>
                      </div>
                    </div>

                    {/* Center: Job Details */}
                    <div className="flex-1 mx-6">
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        {req.location && <span>📍 {req.location}</span>}
                        {req.event_date && (
                          <span>📅 {new Date(req.event_date).toLocaleDateString()}</span>
                        )}
                        {req.budget && <span>💰 {req.budget}</span>}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedClient(req)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                      >
                        View Details
                      </button>
                      <select
                        value={req.status || 'pending'}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const id = req.id;
                          if (!id) {
                            console.error('❌ No ID found for request:', req);
                            toast.error('Cannot update: missing ID');
                            return;
                          }
                          handleUpdateStatus(id, newStatus);
                        }}
                        className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px]"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
};

export default ClientsSection;
