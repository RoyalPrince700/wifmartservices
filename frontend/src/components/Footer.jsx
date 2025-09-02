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
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Wifmart</h3>
            <p className="text-gray-300 max-w-md">
              Connecting skilled service providers with clients who need their expertise. 
              Find the perfect match for your projects or showcase your skills to potential clients.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Instagram</span>
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Find Providers</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Become a Provider</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300">
              Terms of Service
            </a>
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} Wifmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;