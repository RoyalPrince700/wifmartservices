import User from '../models/User.js';

// Category mapping for search
const categoryMappings = {
  development: [
    // Website Development
    'website', 'web development', 'website development', 'web design', 'web designer', 'website designer',
    // Mobile Development
    'mobile development', 'android development', 'ios development', 'react native', 'flutter', 'xamarin',
    // Software Development
    'software development', 'application development', 'app development', 'programming', 'coding', 'developer',
    // Frontend Technologies
    'frontend', 'html', 'css', 'javascript', 'typescript', 'react', 'vue.js', 'vue', 'angular', 'jquery', 'bootstrap',
    // Backend Technologies
    'backend', 'node.js', 'node', 'express', 'php', 'laravel', 'django', 'python', 'flask', 'ruby', 'rails',
    // Full Stack
    'full stack', 'fullstack', 'mern', 'mean', 'lamp', 'server', 'database',
    // CMS & E-commerce
    'wordpress', 'woocommerce', 'shopify', 'magento', 'drupal', 'joomla', 'cms', 'ecommerce', 'e-commerce',
    // Other IT Skills
    'it', 'information technology', 'computer science', 'software engineer', 'web developer', 'programmer'
  ],
  design: ['graphic design', 'ui/ux design', 'web design', 'logo design', 'brand design', 'illustrator', 'photoshop', 'figma', 'adobe', 'creative design', 'ui design', 'ux design', 'user interface', 'user experience'],
  marketing: ['digital marketing', 'social media marketing', 'seo', 'content marketing', 'email marketing', 'marketing strategy', 'brand marketing', 'advertising', 'google ads', 'facebook ads', 'instagram marketing'],
  writing: ['content writing', 'copywriting', 'technical writing', 'blog writing', 'creative writing', 'ghostwriting', 'editing', 'proofreading', 'article writing', 'seo writing'],
  vendor: ['vendor', 'supplier', 'retail', 'wholesale', 'fashion vendor', 'bag vendor', 'clothing vendor', 'product vendor', 'store', 'shop', 'market', 'sales', 'retailer', 'merchant', 'bag maker', 'bag seller', 'fashion designer', 'tailor', 'shoe maker', 'jewelry maker', 'accessory designer', 'fashion stylist', 'bag', 'bags', 'handbag', 'handbags', 'purse', 'purses', 'leather goods', 'fashion accessories', 'clothing', 'apparel', 'fashion', 'style', 'designer', 'maker', 'seller', 'trader', 'dealer'],
  business: ['business consulting', 'business development', 'strategy consulting', 'management consulting', 'entrepreneurship', 'startup consulting', 'business planning', 'business advisor', 'business coach']
};

export const searchProviders = async (req, res, next) => {
  try {
    console.log('Search query received:', req.query); // Debug log
    const { q, category } = req.query;

    let query = {};

    // Handle category filtering
    if (category && categoryMappings[category]) {
      const categorySkills = categoryMappings[category];
      query.skills = {
        $in: categorySkills.map(skill => new RegExp(skill, 'i'))
      };
    }

    // Handle search query
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      const searchQuery = {
        $or: [
          { skills: { $in: [searchRegex] } },
          { name: searchRegex },
          { location_state: searchRegex },
          { city: searchRegex },
          { state: searchRegex }
        ],
      };

      // Combine with category query if both exist - use OR instead of AND for more flexible results
      if (Object.keys(query).length > 0) {
        query = {
          $or: [query, searchQuery]
        };
      } else {
        query = searchQuery;
      }
    }

    console.log('Final MongoDB query:', JSON.stringify(query, null, 2)); // Debug log

    const providers = await User.find(query).select(
      'name profile_image skills location_state isVerifiedBadge verification_status experience_pitch bio hourlyRate rating city state'
    );

    console.log('Found providers:', providers.length); // Debug log
    res.json(providers);
  } catch (error) {
    console.error('Search error:', error); // Debug log
    next(error);
  }
};

/**
 * Get featured providers - top-rated users with verified badges
 */
export const getFeaturedProviders = async (req, res, next) => {
  try {
    console.log('Fetching featured providers...');

    // Get top 10 verified providers with highest ratings
    const featuredProviders = await User.find({
      $or: [
        { isVerifiedBadge: true },
        { verification_status: 'Approved' }
      ]
    })
    .select('name profile_image skills location_state isVerifiedBadge verification_status experience_pitch bio profile_completion rating totalReviews')
    .sort({ profile_completion: -1, createdAt: -1 }) // Sort by profile completion desc, then newest first
    .limit(10);

    console.log('Found featured providers:', featuredProviders.length);
    res.json(featuredProviders);
  } catch (error) {
    console.error('Featured providers error:', error);
    next(error);
  }
};

/**
 * Get all service providers - for browse categories page
 */
export const getAllProviders = async (req, res, next) => {
  try {
    console.log('Fetching all providers...');

    // Get all providers with basic info, sorted by newest first
    const allProviders = await User.find({})
    .select('name profile_image skills location_state isVerifiedBadge verification_status experience_pitch bio profile_completion rating totalReviews')
    .sort({ createdAt: -1 }); // Sort by newest first

    console.log('Found all providers:', allProviders.length);
    res.json(allProviders);
  } catch (error) {
    console.error('All providers error:', error);
    next(error);
  }
};

/**
 * Get category counts - returns the number of providers in each category
 */
export const getCategoryCounts = async (req, res, next) => {
  try {
    console.log('Fetching category counts...');

    const categoryCounts = {};

    // Calculate counts for each category
    for (const [categoryId, skills] of Object.entries(categoryMappings)) {
      const count = await User.countDocuments({
        skills: { $in: skills.map(skill => new RegExp(skill, 'i')) }
      });
      categoryCounts[categoryId] = count;
    }

    console.log('Category counts:', categoryCounts);
    res.json(categoryCounts);
  } catch (error) {
    console.error('Category counts error:', error);
    next(error);
  }
};