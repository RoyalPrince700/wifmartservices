import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiSearch, HiArrowRight, HiCheckCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const stats = [
    { value: '500+', label: 'Service Providers' },
    { value: '2,000+', label: 'Completed Projects' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-blue-600 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div className="pt-10 px-4 sm:px-6 lg:px-8 lg:pt-16 lg:pr-0">
            <div className="lg:self-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Find the perfect
                <span className="block text-blue-200">service provider</span>
              </h1>
              <p className="mt-5 text-lg text-blue-100 max-w-xl">
                Connect with skilled professionals for your projects. From design to development, 
                find the right expertise for your needs.
              </p>

              <div className="mt-10">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="query"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-md leading-5 bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:bg-white focus:placeholder-gray-400 focus:text-gray-900 focus:ring-0 sm:text-sm"
                      placeholder="Search by skill or name (e.g., Fashion Designer or John Doe)"
                      aria-label="Search by skill or name"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                  >
                    Search
                    <HiArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </form>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-blue-200">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full bg-blue-700 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-l from-blue-600 to-transparent opacity-70"></div>
            <div className="relative z-10 p-8 text-center">
              <HiCheckCircle className="mx-auto h-16 w-16 text-blue-300 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Quality Assured</h3>
              <p className="text-blue-100">Every provider is verified for quality and expertise</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;