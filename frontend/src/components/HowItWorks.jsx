import { HiSearch, HiUserAdd, HiChat, HiCheckCircle } from 'react-icons/hi';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      name: 'Search & Explore',
      description: 'Browse through categories or search for specific services and skills.',
      icon: <HiSearch className="h-8 w-8" />,
    },
    {
      id: 2,
      name: 'Connect with Providers',
      description: 'View profiles, portfolios, and reviews to find the perfect match.',
      icon: <HiUserAdd className="h-8 w-8" />,
    },
    {
      id: 3,
      name: 'Discuss Your Project',
      description: 'Message providers directly to discuss requirements and timelines.',
      icon: <HiChat className="h-8 w-8" />,
    },
    {
      id: 4,
      name: 'Get Work Done',
      description: 'Hire with confidence and receive quality work delivered on time.',
      icon: <HiCheckCircle className="h-8 w-8" />,
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">How Wifmart Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            Simple steps to find and hire the best service providers
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden absolute inset-0 sm:flex items-center aria-hidden='true'">
                    <div className="h-0.5 w-full bg-gray-200"></div>
                  </div>
                )}
                <div className="relative flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl font-bold">
                    {step.id}
                  </div>
                  <div className="mt-4 text-center">
                    <div className="flex justify-center text-blue-600">
                      {step.icon}
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">{step.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Ready to get started?</h3>
            <p className="mt-2 text-lg text-gray-600">
              Join thousands of clients and service providers on Wifmart
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Find Services
              </button>
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Become a Provider
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;