import { HiSearch, HiUserAdd, HiChat, HiCheckCircle, HiChevronLeft, HiChevronRight, HiArrowRight, HiSparkles } from 'react-icons/hi';
import { useState, useRef, useEffect } from 'react';

const HowItWorks = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const steps = [
    {
      id: 1,
      name: 'Search & Explore',
      description: 'Browse through categories or search for specific services and skills.',
      icon: <HiSearch className="h-10 w-10" />,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100',
      accentColor: 'text-blue-600',
    },
    {
      id: 2,
      name: 'Connect with Providers',
      description: 'View profiles, portfolios, and reviews to find the perfect match.',
      icon: <HiUserAdd className="h-10 w-10" />,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-100',
      accentColor: 'text-purple-600',
    },
    {
      id: 3,
      name: 'Discuss Your Project',
      description: 'Message providers directly to discuss requirements and timelines.',
      icon: <HiChat className="h-10 w-10" />,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100',
      accentColor: 'text-green-600',
    },
    {
      id: 4,
      name: 'Get Work Done',
      description: 'Hire with confidence and receive quality work delivered on time.',
      icon: <HiCheckCircle className="h-10 w-10" />,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-100',
      accentColor: 'text-orange-600',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % steps.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + steps.length) % steps.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % steps.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false); // Pause auto-play when user touches
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < steps.length - 1) {
      nextSlide();
    }
    if (isRightSwipe && currentSlide > 0) {
      prevSlide();
    }

    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">How Wifmart Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            Simple steps to find and hire the best service providers
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className="mt-12 sm:hidden">
          <div className="relative">
            {/* Carousel Container */}
            <div
              className="overflow-hidden rounded-2xl"
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {steps.map((step) => (
                  <div key={step.id} className="w-full flex-shrink-0 px-2">
                    <div className={`relative h-80 rounded-2xl bg-gradient-to-br ${step.bgGradient} p-6 shadow-lg overflow-hidden group`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white"></div>
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-white"></div>
                      </div>

                      {/* Step Number */}
                      <div className="relative z-10">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${step.gradient} text-white font-bold text-lg shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                          {step.id}
                        </div>

                        {/* Icon */}
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-md mb-4 ${step.accentColor} transform group-hover:scale-105 transition-transform duration-300`}>
                          {step.icon}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                          {step.name}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Animated Arrow */}
                        <div className={`absolute bottom-6 right-6 ${step.accentColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-blue-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:scale-105 transition-all duration-200 z-10"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:scale-105 transition-all duration-200 z-10"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:block mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative group">
                {index < steps.length - 1 && (
                  <div className="hidden absolute inset-0 lg:flex items-center justify-center">
                    <div className="h-0.5 w-full bg-gradient-to-r from-gray-200 to-gray-300"></div>
                  </div>
                )}
                <div className="relative flex flex-col items-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Step Number */}
                  <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.gradient} text-white font-bold text-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className={`flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.bgGradient} ${step.accentColor} mb-6 group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center leading-tight">
                    {step.name}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>

                  {/* Hover Effect */}
                  <div className={`mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${step.accentColor} font-semibold`}>
                    Learn More →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creative CTA Section */}
        <div className="mt-16 relative overflow-hidden">
          {/* Background with blue gradient and pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl"></div>
          <div className="absolute inset-0 bg-black bg-opacity-10 rounded-3xl"></div>

          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-x-12 translate-y-12 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>

          {/* Floating sparkles */}
          <div className="absolute top-8 right-8 text-blue-200 animate-bounce">
            <HiSparkles className="w-6 h-6" />
          </div>
          <div className="absolute bottom-8 left-8 text-blue-100 animate-bounce" style={{animationDelay: '1.5s'}}>
            <HiSparkles className="w-4 h-4" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 text-center">
            {/* Main heading with gradient text */}
            <div className="mb-6">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 mb-2">
                Ready to Transform Your Experience?
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-400 mx-auto rounded-full"></div>
            </div>

            {/* Subtitle with better typography */}
            <p className="text-lg sm:text-xl text-white text-opacity-90 font-medium mb-2 leading-relaxed">
              Join <span className="font-bold text-blue-200">10,000+</span> clients and service providers
            </p>
            <p className="text-base text-white text-opacity-80 mb-8">
              Start your journey with Wifmart today and unlock endless possibilities
            </p>

            {/* Creative buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              {/* Primary button - Find Services */}
              <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>

                {/* Button content */}
                <span className="relative z-10 flex items-center">
                  <HiSearch className="w-5 h-5 mr-3 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  <span className="text-blue-600 group-hover:text-white transition-colors duration-300">Find Services</span>
                  <HiArrowRight className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform duration-300 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </span>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-all duration-1000"></div>
              </button>

              {/* Secondary button - Become Provider */}
              <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                {/* Button content */}
                <span className="relative z-10 flex items-center">
                  <HiSparkles className="w-5 h-5 mr-3" />
                  Provide Services
                  <HiArrowRight className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>

                {/* Animated border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 rounded-2xl transition-colors duration-300"></div>

                {/* Background fill animation */}
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-white text-opacity-80">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-300 rounded-full mr-2 animate-pulse"></div>
                99.9% Uptime
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white bg-opacity-50 rounded-full"></div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-200 rounded-full mr-2 animate-pulse"></div>
                Secure & Verified
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white bg-opacity-50 rounded-full"></div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;