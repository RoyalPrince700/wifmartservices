import { useNavigate } from 'react-router-dom';

const ProfileOverview = ({ user }) => {
  const navigate = useNavigate();

  // Profile completion progress bar
  const ProfileCompletion = ({ completion }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${completion}%` }}
      ></div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Profile Overview</h3>

        {/* Get Verified Button - only show if not verified */}
        {!(user?.isVerifiedBadge === true ||
            user?.isVerified === true ||
            user?.verification_status?.toLowerCase() === 'approved') && (
          <button
            onClick={() => navigate('/verification')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            title="Get verified badge"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Get Verified
          </button>
        )}
      </div>
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
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
              {/* ✅ Verified Badge for current user */}
              {(user?.isVerifiedBadge === true ||
                user?.isVerified === true ||
                user?.verification_status?.toLowerCase() === 'approved') && (
                <span className="flex-shrink-0 bg-blue-500 text-white rounded-full p-1.5 shadow-md flex items-center justify-center">
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
            <button
              onClick={() => navigate(`/profile/${user?._id || user?.id}`)}
              className="mt-2 w-full py-2 bg-white text-blue-600 border border-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View Profile
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
    </div>
  );
};

export default ProfileOverview;
