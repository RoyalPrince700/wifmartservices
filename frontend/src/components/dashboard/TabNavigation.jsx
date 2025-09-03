const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'providers', label: 'Providers', icon: '👥' },
    { id: 'clients', label: 'Clients', icon: '🤝' },
    { id: 'verification', label: 'Verification', icon: '✅' }
  ];

  return (
    <>
      {/* Desktop Tab Navigation */}
      <div className="hidden md:flex bg-white rounded-xl shadow-sm overflow-hidden">
        {tabs.map((tab) => (
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
      <div className="md:hidden flex bg-white justify-between rounded-xl shadow-sm">
        {tabs.map((tab) => (
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
    </>
  );
};

export default TabNavigation;
