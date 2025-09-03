// Status badge component
export const StatusBadge = ({ status, reason }) => {
  const getStatusConfig = (status) => {
    switch(status) {
      case 'Verified':
      case 'Approved':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' };
      case 'Pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' };
      case 'Rejected':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' };
      case 'Locked':
        return { bg: 'bg-amber-100', text: 'text-amber-800', icon: '🔒' };
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
export const DashboardCard = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm p-4 md:p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    {children}
  </div>
);

// Stats card component
export const StatCard = ({ title, value, subtitle, icon }) => (
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
