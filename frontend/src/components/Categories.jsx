import { HiCode, HiPencilAlt, HiPhotograph, HiMusicNote, HiAcademicCap, HiBriefcase } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      id: 'development',
      name: 'Development & IT',
      icon: <HiCode className="h-8 w-8" />,
      count: '245 providers',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'design',
      name: 'Design & Creative',
      icon: <HiPencilAlt className="h-8 w-8" />,
      count: '180 providers',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: <HiPhotograph className="h-8 w-8" />,
      count: '120 providers',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'writing',
      name: 'Writing & Translation',
      icon: <HiMusicNote className="h-8 w-8" />,
      count: '95 providers',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'education',
      name: 'Education & Training',
      icon: <HiAcademicCap className="h-8 w-8" />,
      count: '75 providers',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'business',
      name: 'Business Consulting',
      icon: <HiBriefcase className="h-8 w-8" />,
      count: '60 providers',
      color: 'bg-indigo-100 text-indigo-600'
    },
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?category=${categoryId}`);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Browse by Category</h2>
          <p className="mt-4 text-lg text-gray-600">
            Find the right service for your needs from our diverse categories
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y-1"
            >
              <div className="p-6">
                <div className={`rounded-lg p-3 inline-flex ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{category.count}</p>
                <div className="mt-4">
                  <span className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    Browse services →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;