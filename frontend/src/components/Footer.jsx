import { 
  HiPhone, 
  HiMail, 
  HiLocationMarker, 
  HiGlobeAlt 
} from 'react-icons/hi';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin 
} from 'react-icons/fa';
import wifmartLogo from '../assets/wifmart-logo.png';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-md text-gray-800 mt-auto shadow-2xl shadow-blue-900/20 relative overflow-hidden border border-blue-200/30">

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden md:block">
        {/* Animated background pattern - Desktop */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/15 to-pink-100/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <img
                src={wifmartLogo}
                alt="Wifmart"
                className="h-10 w-auto mb-6 group-hover:scale-105 transition-all duration-300 transform"
              />
              <p className="text-gray-600 max-w-md">
                Connecting skilled service providers with clients who need their expertise.
                Find the perfect match for your projects or showcase your skills to potential clients.
              </p>
              <div className="flex mt-8 space-x-6">
                {/* <a href="#" className="group text-gray-500 hover:text-blue-600 inline-flex items-center justify-center p-3 rounded-xl border border-gray-300/50 hover:border-blue-600/50 hover:bg-blue-600/10 text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-600/25">
                  <span className="sr-only">Facebook</span>
                  <FaFacebook className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </a> */}
                <a href="https://www.instagram.com/wifmartofficial?igsh=MW01bTdidXd0Nm1jaA==" className="group text-gray-500 hover:text-blue-600 inline-flex items-center justify-center p-3 rounded-xl border border-gray-300/50 hover:border-blue-600/50 hover:bg-blue-600/10 text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-600/25">
                  <span className="sr-only">Instagram</span>
                  <FaInstagram className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a href="https://x.com/Wifmartofficial?t=kwz5_gi_t7ojDXJwllf4DA&s=09" className="group text-gray-500 hover:text-blue-600 inline-flex items-center justify-center p-3 rounded-xl border border-gray-300/50 hover:border-blue-600/50 hover:bg-blue-600/10 text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-600/25">
                  <span className="sr-only">Twitter</span>
                  <FaTwitter className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </a>
                {/* <a href="#" className="group text-gray-500 hover:text-blue-600 inline-flex items-center justify-center p-3 rounded-xl border border-gray-300/50 hover:border-blue-600/50 hover:bg-blue-600/10 text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-600/25">
                  <span className="sr-only">LinkedIn</span>
                  <FaLinkedin className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </a> */}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 tracking-wide uppercase mb-6 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Services</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="group text-gray-600 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                    <span className="group-hover:font-semibold">Find Providers</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="group text-gray-600 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                    <span className="group-hover:font-semibold">Become a Provider</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="group text-gray-600 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                    <span className="group-hover:font-semibold">Pricing</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="group text-gray-600 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                    <span className="group-hover:font-semibold">Success Stories</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 tracking-wide uppercase mb-6 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/help" className="group text-gray-600 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                    <span className="group-hover:font-semibold">Help Center</span>
                  </a>
                </li>
                <li>
                  <a href="/terms" className="group text-gray-600 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                    <span className="group-hover:font-semibold">Terms of Service</span>
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="group text-gray-600 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                    <span className="group-hover:font-semibold">Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a href="/contact" className="group text-gray-600 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                    <span className="group-hover:font-semibold">Contact Us</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-300/30 pt-10 md:flex md:items-center md:justify-between">
            <div className="flex space-x-8 md:order-2">
              <a href="/privacy" className="group text-gray-600 hover:text-blue-600 inline-flex items-center text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative">
                <span className="group-hover:font-semibold">Privacy Policy</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></div>
              </a>
              <a href="/terms" className="group text-gray-600 hover:text-blue-600 inline-flex items-center text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative">
                <span className="group-hover:font-semibold">Terms of Service</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></div>
              </a>
            </div>
            <p className="mt-8 text-base text-gray-600 md:mt-0 md:order-1 bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent">
              &copy; {new Date().getFullYear()} Wifmart. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== MOBILE VERSION ==================== */}
      <div className="md:hidden">
        {/* Creative Mobile Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/25 to-pink-50/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200/20 rounded-full blur-2xl animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-xl animate-pulse"></div>

        <div className="max-w-7xl mx-auto py-12 px-4 relative z-10">
          {/* Mobile Hero Section */}
          <div className="text-center mb-12">
            <img
              src={wifmartLogo}
              alt="Wifmart"
              className="h-12 w-auto mb-4 mx-auto animate-pulse"
            />
            <p className="text-gray-600 text-sm leading-relaxed px-2">
              Connecting skilled service providers with clients who need their expertise.
              Find the perfect match for your projects or showcase your skills to potential clients.
            </p>
          </div>

          {/* Creative Mobile Cards Layout */}
          <div className="space-y-6">
            {/* Services Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                Services
              </h3>
              <div className="space-y-2">
                <a href="/categories" className="group flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-gray-700 text-sm font-medium group-hover:text-blue-700">Find Providers</span>
                </a>
                <a href="/dashboard" className="group flex items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-gray-700 text-sm font-medium group-hover:text-purple-700">Become Provider</span>
                </a>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                Support
              </h3>
              <div className="space-y-2">
                <a href="/help" className="group flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-gray-700 text-sm font-medium group-hover:text-gray-800">Help Center</span>
                </a>
                <a href="/terms" className="group flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-gray-700 text-sm font-medium group-hover:text-gray-800">Terms of Service</span>
                </a>
                <a href="/privacy" className="group flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-gray-700 text-sm font-medium group-hover:text-gray-800">Privacy Policy</span>
                </a>
                <a href="/contact" className="group flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-gray-700 text-sm font-medium group-hover:text-gray-800">Contact Us</span>
                </a>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">🌟</span>
                </div>
                Connect With Us
              </h3>
              <div className="flex justify-center space-x-4">
                {/* <a href="#" className="group bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 hover:rotate-6 shadow-lg hover:shadow-xl">
                  <FaFacebook className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </a> */}
                <a href="https://www.instagram.com/wifmartofficial?igsh=MW01bTdidXd0Nm1jaA==" className="group bg-gradient-to-r from-pink-500 to-pink-600 p-4 rounded-2xl text-white hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 hover:-rotate-6 shadow-lg hover:shadow-xl">
                  <FaInstagram className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a href="https://x.com/Wifmartofficial?t=kwz5_gi_t7ojDXJwllf4DA&s=09" className="group bg-gradient-to-r from-blue-400 to-blue-500 p-4 rounded-2xl text-white hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 hover:rotate-6 shadow-lg hover:shadow-xl">
                  <FaTwitter className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </a>
                {/* <a href="#" className="group bg-gradient-to-r from-blue-700 to-blue-800 p-4 rounded-2xl text-white hover:from-blue-800 hover:to-blue-900 transition-all duration-300 transform hover:scale-110 hover:-rotate-6 shadow-lg hover:shadow-xl">
                  <FaLinkedin className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </a> */}
              </div>
            </div>
          </div>

          {/* Mobile Footer Bottom */}
          <div className="mt-8 pt-6 border-t border-gray-300/30 text-center">
            <p className="text-sm text-gray-600 mb-4 bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent">
              &copy; {new Date().getFullYear()} Wifmart. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="/privacy" className="group text-gray-600 hover:text-blue-600 text-xs font-medium transition-all duration-300 transform hover:scale-105">
                <span className="group-hover:font-semibold">Privacy</span>
              </a>
              <a href="/terms" className="group text-gray-600 hover:text-blue-600 text-xs font-medium transition-all duration-300 transform hover:scale-105">
                <span className="group-hover:font-semibold">Terms</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;