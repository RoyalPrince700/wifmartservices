import { HiStar, HiCheckCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';



const FeaturedProviders = () => {
  const navigate = useNavigate();

  const providers = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Web Developer",
      rating: 4.9,
      reviews: 128,
      rate: "$45/hr",
      image: null, // Will use fallback avatar
      skills: ["React", "Node.js", "MongoDB"],
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "UI/UX Designer",
      rating: 4.8,
      reviews: 96,
      rate: "$50/hr",
      image: null, // Will use fallback avatar
      skills: ["Figma", "UI Design", "Prototyping"],
      verified: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Content Writer",
      rating: 4.7,
      reviews: 142,
      rate: "$35/hr",
      image: null, // Will use fallback avatar
      skills: ["SEO", "Blogging", "Copywriting"],
      verified: true
    },
    {
      id: 4,
      name: "David Kim",
      title: "Digital Marketing Specialist",
      rating: 4.9,
      reviews: 87,
      rate: "$55/hr",
      image: null, // Will use fallback avatar
      skills: ["SEO", "Google Ads", "Social Media"],
      verified: true
    }
  ];

  const handleProviderClick = (providerId) => {
    navigate(`/provider/${providerId}`);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Featured Service Providers</h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover top-rated professionals ready to help with your projects
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              onClick={() => handleProviderClick(provider.id)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-100"
            >
              <div className="p-6">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
                    {provider.verified && (
                      <HiCheckCircle className="h-5 w-5 text-blue-500 ml-1" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{provider.title}</p>
                </div>

                <div className="mt-4 flex items-center">
                  <div className="flex items-center">
                    <HiStar className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium text-gray-900">{provider.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{provider.reviews} reviews</span>
                </div>

                <div className="mt-4">
                  <span className="text-lg font-bold text-gray-900">{provider.rate}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {provider.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button className="mt-6 w-full group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative">View Profile</span>
                  <div className="absolute inset-0 rounded-lg bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/search')}
            className="group relative inline-flex items-center px-8 py-4 border-2 border-gray-300 shadow-lg text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <span className="relative">Browse All Providers</span>
            <div className="absolute inset-0 rounded-xl bg-gray-400/10 scale-0 group-active:scale-100 transition-transform duration-150"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProviders;