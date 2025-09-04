// frontend/src/pages/BrowseCategories.jsx
import { useState, useEffect } from 'react';
import BrowseCategoriesMobile from './BrowseCategoriesMobile';
import BrowseCategoriesDesktop from './BrowseCategoriesDesktop';

const BrowseCategories = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen size on mount and resize
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Render appropriate component based on screen size
  return isMobile ? <BrowseCategoriesMobile /> : <BrowseCategoriesDesktop />;
};

export default BrowseCategories;
