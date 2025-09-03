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

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-900/95 to-blue-900/90 backdrop-blur-sm text-white mt-auto border-t border-gray-700/50 shadow-2xl relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-blue-600 group-hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
              Wifmart
            </h3>
            <p className="text-gray-300 max-w-md">
              Connecting skilled service providers with clients who need their expertise. 
              Find the perfect match for your projects or showcase your skills to potential clients.
            </p>
            <div className="flex mt-8 space-x-6">
              <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center justify-center p-3 rounded-xl border border-gray-600/50 hover:border-blue-600/50 hover:bg-blue-600/10 text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-600/25">
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center justify-center p-3 rounded-xl border border-gray-600/50 hover:border-blue-600/50 hover:bg-blue-600/10 text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-600/25">
                <span className="sr-only">Instagram</span>
                <FaInstagram className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center justify-center p-3 rounded-xl border border-gray-600/50 hover:border-blue-600/50 hover:bg-blue-600/10 text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-600/25">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center justify-center p-3 rounded-xl border border-gray-600/50 hover:border-blue-600/50 hover:bg-blue-600/10 text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-600/25">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-wide uppercase mb-6 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                  <span className="group-hover:font-semibold">Find Providers</span>
                </a>
              </li>
              <li>
                <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                  <span className="group-hover:font-semibold">Become a Provider</span>
                </a>
              </li>
              <li>
                <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                  <span className="group-hover:font-semibold">Pricing</span>
                </a>
              </li>
              <li>
                <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                  <span className="group-hover:font-semibold">Success Stories</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-wide uppercase mb-6 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                  <span className="group-hover:font-semibold">Help Center</span>
                </a>
              </li>
              <li>
                <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                  <span className="group-hover:font-semibold">Terms of Service</span>
                </a>
              </li>
              <li>
                <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                  <span className="group-hover:font-semibold">Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center text-base font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105">
                  <span className="group-hover:font-semibold">Contact Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700/50 pt-10 md:flex md:items-center md:justify-between">
          <div className="flex space-x-8 md:order-2">
            <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative">
              <span className="group-hover:font-semibold">Privacy Policy</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></div>
            </a>
            <a href="#" className="group text-gray-400 hover:text-blue-600 inline-flex items-center text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative">
              <span className="group-hover:font-semibold">Terms of Service</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></div>
            </a>
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1 bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent">
            &copy; {new Date().getFullYear()} Wifmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;