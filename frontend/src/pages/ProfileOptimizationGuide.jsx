import React from 'react';
import { HiUser, HiPhotograph, HiDocumentText, HiStar, HiTrendingUp, HiCheckCircle, HiArrowRight, HiSparkles, HiChartBar, HiShieldCheck } from 'react-icons/hi';

const ProfileOptimizationGuide = () => {
  const optimizationTips = [
    {
      id: 1,
      icon: HiUser,
      title: 'Complete Your Profile Information',
      description: 'Fill out all required profile fields to build trust and credibility with potential clients.',
      tips: [
        'Upload a professional profile picture (JPEG/PNG)',
        'Add your full name (required field)',
        'Write a compelling experience pitch/bio',
        'Add your skills as tags',
        'Select your state location',
        'Add WhatsApp and phone numbers for contact',
        'Include social media handles (Instagram, X/Twitter, LinkedIn)',
        'Add your portfolio/website link if available'
      ],
      examples: [
        {
          title: 'Freelance Graphic Designer Profile Setup',
          content: `PROFILE PICTURE: Professional headshot with good lighting
FULL NAME: Adebayo Adeolu (Creative Designer)
SKILLS: Logo Design, Brand Identity, Adobe Illustrator, Graphic Design, UI/UX Design, Print Design
EXPERIENCE PITCH: Hi! I'm Adebayo, a passionate graphic designer based in Lagos with 4+ years of experience helping Nigerian businesses establish strong visual identities. I specialize in creating memorable logos and brand materials that drive results. My designs have helped startups increase their brand recognition by 300% and improve customer engagement. When I'm not designing, you'll find me at local design meetups sharing knowledge with fellow creatives. Let's bring your brand vision to life!

LOCATION: Lagos
WHATSAPP: +2348123456789
PHONE: +2348123456789
INSTAGRAM: @adebayo_designs
LINKEDIN: https://linkedin.com/in/adebayo-adeolu
PORTFOLIO: https://adebayodesigns.com`
        },
        {
          title: 'Content Writer Profile Setup',
          content: `PROFILE PICTURE: Professional portrait showing approachability
FULL NAME: Chioma Okoye (SEO Content Specialist)
SKILLS: Content Writing, SEO Writing, Blog Writing, Copywriting, Keyword Research, WordPress, Social Media Content
EXPERIENCE PITCH: Hello! I'm Chioma, a professional content writer and SEO specialist based in Abuja with a background in digital marketing. I help businesses create engaging, SEO-optimized content that ranks well and drives organic traffic. My articles have helped clients achieve top 10 rankings on Google for competitive keywords and increased their organic traffic by 250%. I specialize in creating content that converts readers into customers while maintaining brand voice and messaging. Available for blog posts, website copy, email campaigns, and social media content.

LOCATION: FCT - Abuja
WHATSAPP: +2349034567890
PHONE: +2349034567890
INSTAGRAM: @chioma_writes
X (Twitter): @chioma_content
LINKEDIN: https://linkedin.com/in/chioma-okoye
PORTFOLIO: https://chiomacontent.com`
        },
        {
          title: 'Photographer Profile Setup',
          content: `PROFILE PICTURE: Professional portrait with photography equipment subtly visible
FULL NAME: Ibrahim Musa (Event Photographer)
SKILLS: Wedding Photography, Event Photography, Portrait Photography, Photo Editing, Lightroom, Photoshop, Studio Lighting
EXPERIENCE PITCH: Greetings! I'm Ibrahim, a professional wedding and event photographer based in Kano with 6 years of experience capturing life's most precious moments. I specialize in both traditional and contemporary Nigerian weddings, bringing cultural authenticity while incorporating modern photographic techniques. I've photographed over 200 weddings and events, with clients praising my ability to capture genuine emotions and cultural details that matter most to Nigerian families. My work includes comprehensive packages from engagement shoots to wedding albums with professional editing and retouching.

LOCATION: Kano
WHATSAPP: +2348056789012
PHONE: +2348056789012
INSTAGRAM: @ibrahim_captures
LINKEDIN: https://linkedin.com/in/ibrahim-musa-photography
PORTFOLIO: https://ibrahimphotography.com`
        }
      ]
    },
    {
      id: 2,
      icon: HiPhotograph,
      title: 'Showcase Your Work with Portfolio Images',
      description: 'Upload high-quality portfolio images to visually demonstrate your skills and attract clients.',
      tips: [
        'Upload up to 3 portfolio images (or 10 if verified)',
        'Use JPEG, PNG, or WebP formats (max 5MB per image)',
        'Include before/after images when applicable',
        'Show diverse examples of your work quality',
        'Use professional, well-lit, clear images',
        'Consider adding your portfolio website link for more examples'
      ],
      examples: [
        {
          title: 'Fashion Boutique E-commerce Website Portfolio',
          content: `PORTFOLIO IMAGES TO UPLOAD:
1. Homepage design screenshot showing modern layout
2. Product page with high-quality fashion photography
3. Mobile responsive design demonstration
4. Before/after comparison of old vs new design

PROJECT DESCRIPTION: Complete e-commerce website redesign for a Lagos-based fashion boutique. The client needed a modern, mobile-responsive site that would improve user experience and increase online sales. I implemented a clean design with intuitive navigation, integrated shopping cart functionality, and optimized product photography. Results included 150% increase in mobile conversions and 40% boost in overall sales within 3 months of launch.

TECHNOLOGIES USED: WordPress, WooCommerce, Custom CSS, Photography editing`
        },
        {
          title: 'Restaurant Branding & Menu Design Portfolio',
          content: `PORTFOLIO IMAGES TO UPLOAD:
1. Final menu design with elegant typography and layout
2. Food photography samples used in the menu
3. Brand logo and color scheme presentation
4. Packaging design for takeaway orders

PROJECT DESCRIPTION: Complete visual identity and menu design for a Mediterranean restaurant in Abuja. The challenge was to create an appetizing design that reflects the restaurant's authentic cuisine while maintaining modern appeal. I used warm colors, high-quality food photography, and elegant typography to showcase dishes. The result was customers reporting 60% better perceived food quality and 25% increase in average order value.

TOOLS USED: Adobe Illustrator, Adobe Photoshop, Food photography, Print design`
        },
        {
          title: 'Social Media Graphics Campaign Portfolio',
          content: `PORTFOLIO IMAGES TO UPLOAD:
1. Instagram post carousel examples
2. Story highlights design samples
3. Brand color palette and typography guide
4. Before/after engagement metrics screenshot

PROJECT DESCRIPTION: Complete social media visual identity for a fitness brand in Port Harcourt. The client needed cohesive graphics for Instagram, Facebook, and TikTok to establish a strong online presence. I created 30+ pieces including posts, stories, carousels, and video thumbnails using a modern, energetic style with consistent brand colors and typography. The campaign resulted in 300% increase in engagement and 80% growth in followers within 3 months.

STYLE APPROACH: Modern and energetic, vibrant colors, clean typography, mobile-optimized graphics`
        }
      ]
    },
    {
      id: 3,
      icon: HiDocumentText,
      title: 'Write Detailed Service Descriptions',
      description: 'Clear, detailed service listings help clients understand what you offer.',
      tips: [
        'Use specific, descriptive titles',
        'Explain what\'s included in your service',
        'Mention turnaround times and revisions',
        'Be transparent about pricing and packages'
      ],
      examples: [
        {
          title: 'Logo Design Service Description',
          content: `Professional Logo Design Package - $299

What's Included:
• 3 initial logo concepts with 3 variations each
• High-resolution files (PNG, JPG, PDF, SVG)
• Color variations and black/white versions
• Brand guidelines document
• 3 rounds of revisions
• Commercial usage rights

Timeline: 5-7 business days
Perfect for: Startups, small businesses, personal brands

Why choose me? I have 200+ logos designed for various industries with 98% client satisfaction rate.`
        },
        {
          title: 'Content Writing Service Description',
          content: `SEO Blog Post Writing - $89 per 1,500-word article

What's Included:
• Keyword-optimized, engaging blog post
• SEO title and meta description
• Internal/external linking suggestions
• Plagiarism-free, original content
• 1 round of revisions included
• Content formatted for WordPress

Timeline: 3-5 business days
Perfect for: Business blogs, marketing agencies, e-commerce sites

Why choose me? I've written over 500 articles that have helped clients rank #1 on Google for competitive keywords.`
        },
        {
          title: 'Social Media Management Service',
          content: `Complete Social Media Management - $599/month

What's Included:
• Content creation (12 posts + 8 stories per week)
• Community management and engagement
• Monthly performance reports
• Content calendar planning
• Hashtag research and optimization
• Competitor analysis
• 2 strategy calls per month

Platforms: Instagram, Facebook, LinkedIn
Timeline: Monthly subscription with weekly content delivery

Why choose me? I've helped businesses grow their social media following by 200% and increase engagement by 150%.`
        }
      ]
    },
    {
      id: 4,
      icon: HiStar,
      title: 'Build Your Reputation',
      description: 'Positive reviews and ratings are crucial for attracting new clients.',
      tips: [
        'Deliver high-quality work consistently',
        'Communicate professionally and respond quickly',
        'Ask satisfied clients for reviews',
        'Handle any issues professionally'
      ],
      examples: [
        {
          title: 'Client Review Request Email Template',
          content: `Subject: How was your experience working with me?

Hi [Client Name],

I hope you're doing well! I really enjoyed working on your [project/service] and I'm thrilled with how it turned out.

Would you mind taking 2 minutes to leave a quick review on my Wifmart profile? Your feedback helps other potential clients understand what it's like to work with me.

Here's the direct link: [Your Profile Review Link]

Thank you so much for your time and for choosing me for your project!

Best regards,
[Your Name]`
        },
        {
          title: 'Thank You Email with Review Request',
          content: `Subject: Thank you for choosing me! Would you leave a review?

Dear [Client Name],

Thank you so much for your business and for trusting me with your [project/service]! I'm absolutely delighted with how everything turned out and I hope you are too.

Your project was completed on time and within budget, and it was a pleasure working with you. Your satisfaction means everything to me.

If you have a moment, I'd greatly appreciate it if you could leave a review on my profile. It helps other clients find quality professionals like myself.

Leave a review here: [Your Profile Link]

Thank you again for the opportunity!

Warm regards,
[Your Name]
[Your Contact Information]`
        },
        {
          title: 'Follow-up Review Request Template',
          content: `Subject: Quick feedback request - [Project Name]

Hello [Client Name],

I hope you're enjoying the final results of your [project/service]! It's been about a week since we wrapped up, and I wanted to check in.

I'm always looking to improve and provide the best possible service. If you have a minute, your honest feedback would mean the world to me and help other potential clients.

Could you please share your thoughts here: [Review Link]

Thank you for your time and for the opportunity to work with you!

Best,
[Your Name]`
        }
      ]
    },
    {
      id: 5,
      icon: HiTrendingUp,
      title: 'Optimize for Search Visibility',
      description: 'Make sure potential clients can find you when searching for your services.',
      tips: [
        'Use relevant keywords in your profile and services',
        'Choose appropriate service categories',
        'Complete your location information',
        'Keep your profile information current'
      ],
      examples: [
        {
          title: 'Keyword-Rich Service Title Examples',
          content: `❌ Bad: "Design Services"
✅ Good: "Professional Logo Design & Brand Identity for Small Businesses"

❌ Bad: "Writing"
✅ Good: "SEO Content Writing & Blog Post Creation for B2B Companies"

❌ Bad: "Photography"
✅ Good: "Wedding Photography & Portrait Sessions in [Your City]"

❌ Bad: "Web Development"
✅ Good: "Custom WordPress Development & E-commerce Website Design"`
        },
        {
          title: 'SEO-Optimized Profile Bio Template',
          content: `Professional [Your Service] Specialist | [X] Years Experience | [Your Location]

I help [target audience] with [specific services] to achieve [specific results]. Specializing in [your niche/specialty] with proven track record of [key achievements].

Services: [Service 1], [Service 2], [Service 3], [Service 4]
Keywords: [primary keyword], [secondary keyword], [location-based keyword]

Recent projects include [brief project examples]. Available for [availability details].

#YourService #ProfessionalServices #[YourLocation] #[YourSpecialty]`
        },
        {
          title: 'Service Description with Keywords',
          content: `Professional [Service Type] Services in [Location]

Are you looking for experienced [your profession] who specializes in [specific niche]? With [X years] of experience and [number] satisfied clients, I provide high-quality [service description].

What I Offer:
• [Service 1] - Perfect for [target audience]
• [Service 2] - Ideal for [use case]
• [Service 3] - Great for [specific need]

Why choose me?
• [Unique selling point 1]
• [Proven result 1]
• [Certification/award]

Keywords for search: [primary keywords], [secondary keywords], [location keywords]

Contact me today for a free consultation and quote!`
        }
      ]
    },
    {
      id: 6,
      icon: HiShieldCheck,
      title: 'Get Verified & Add Business Details',
      description: 'Verified professionals can unlock premium features and build more trust with clients.',
      tips: [
        'Complete identity verification to get verified badge',
        'Once verified, add your CAC Number (RC1234567 format)',
        'Upload your CAC Certificate (PDF or image)',
        'Get access to upload up to 10 portfolio images',
        'Display business registration details to clients',
        'Build credibility with official business documentation'
      ],
      examples: [
        {
          title: 'CAC Business Registration Information',
          content: `WHAT IS CAC?
CAC stands for Corporate Affairs Commission - Nigeria's official business registration body.

WHY ADD CAC DETAILS?
• Builds trust with clients by showing you're a registered business
• Required for many B2B transactions in Nigeria
• Demonstrates professionalism and legitimacy
• Unlocks premium features on Wifmart

CAC NUMBER FORMAT:
• Starts with "RC" followed by numbers (e.g., RC1234567)
• Can be found on your business registration certificate
• Case-sensitive, usually in all caps

CAC CERTIFICATE:
• Official PDF document from CAC
• Shows your business name, registration number, and date
• Can be uploaded as PDF or clear image scan
• Maximum file size: 5MB`
        },
        {
          title: 'Business Verification Benefits',
          content: `VERIFICATION UNLOCKS:
✅ Upload up to 10 portfolio images (instead of 3)
✅ Add CAC business registration details
✅ Display verified badge on your profile
✅ Higher visibility in search results
✅ Access to premium client opportunities
✅ Increased trust from potential clients

VERIFICATION PROCESS:
1. Go to Dashboard → Verification tab
2. Submit required identity documents
3. Upload proof of business registration
4. Wait for approval (usually 1-3 business days)
5. Once approved, access premium features

REQUIRED DOCUMENTS:
• Valid ID (Driver's License, National ID, or Passport)
• Utility bill or bank statement (for address verification)
• CAC Certificate (if registering as business)
• Professional certificates (optional but recommended)`
        },
        {
          title: 'Professional Reference Template',
          content: `PROFESSIONAL REFERENCE LETTER

[Company Letterhead]
[Date]

To Whom It May Concern,

I am writing to recommend [Your Name] for [their profession/service] work. I had the pleasure of working with [Your Name] on [project/service description] from [start date] to [end date].

During our collaboration, [Your Name] demonstrated exceptional [key skills/qualities]. Specifically:

• [Specific achievement or quality]
• [Another specific achievement]
• [Third specific achievement]

[Your Name]'s work exceeded our expectations in terms of [quality/timing/budget]. Their [professional quality] and [another quality] made them a valuable asset to our project.

I would not hesitate to work with [Your Name] again and highly recommend their services to anyone seeking professional [your service type].

Sincerely,

[Reference Name]
[Reference Title]
[Reference Company]
[Reference Contact Information]
[Reference Phone/Email]`
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Update Profile',
      description: 'Go to your profile settings and complete all sections',
      link: '/profile/edit',
      icon: HiUser
    },
    {
      title: 'Add Portfolio',
      description: 'Upload your best work to showcase your skills',
      link: '/profile/edit',
      icon: HiPhotograph
    },
    {
      title: 'Get Verified',
      description: 'Start the verification process to build trust',
      link: '/badge-verification',
      icon: HiShieldCheck
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-300/10 to-indigo-300/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <HiSparkles className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Profile Optimization Guide
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Maximize your success on Wifmart by optimizing your profile to attract more clients and stand out from the competition.
              </p>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/30 p-8 lg:p-12 text-center">
            <HiChartBar className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Why Profile Optimization Matters
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              A well-optimized profile can increase your visibility by up to 300% and help you attract higher-quality clients.
              Clients make decisions based on what they see in your profile, so make it count!
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100/50">
                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                <p className="text-gray-700">of clients check reviews before hiring</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100/50">
                <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
                <p className="text-gray-700">more inquiries with portfolio images</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100/50">
                <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
                <p className="text-gray-700">higher conversion with detailed profiles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Tips */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              6 Essential Optimization Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these proven strategies to transform your profile into a client magnet
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {optimizationTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={tip.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/30 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl mr-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        {index + 1}. {tip.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-4">
                        {tip.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-6 rounded-2xl border border-gray-200/30">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <HiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Key Tips:
                    </h4>
                    <ul className="space-y-3">
                      {tip.tips.map((item, idx) => (
                        <li key={idx} className="flex items-start text-gray-700">
                          <HiArrowRight className="h-4 w-4 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Practical Examples Section */}
                  {tip.examples && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50/30 p-6 rounded-2xl border border-green-200/30">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <HiSparkles className="h-5 w-5 text-emerald-500 mr-2" />
                        Practical Examples (Copy & Edit):
                      </h4>
                      <div className="space-y-4">
                        {tip.examples.map((example, idx) => (
                          <div key={idx} className="bg-white/70 p-4 rounded-xl border border-gray-200/30">
                            <h5 className="font-medium text-gray-800 mb-2 text-sm">
                              {example.title}
                            </h5>
                            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 font-mono leading-relaxed whitespace-pre-wrap">
                              {example.content}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-3 italic">
                        💡 Copy these templates and customize them with your own information, experience, and achievements.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 text-center mb-12 max-w-3xl mx-auto">
              Take the first steps towards optimizing your profile and attracting more clients
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                    <p className="text-blue-100 mb-6">{action.description}</p>
                    <a
                      href={action.link}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 inline-block"
                    >
                      Get Started
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/30 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Success Stories
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100/50">
                <div className="flex items-center mb-4">
                  <HiStar className="h-6 w-6 text-yellow-500 mr-2" />
                  <span className="font-semibold text-gray-800">Sarah's Story</span>
                </div>
                <p className="text-gray-700 mb-4">
                  "After optimizing my profile with a professional portfolio and detailed service descriptions,
                  my client inquiries increased by 250% in just one month!"
                </p>
                <div className="text-sm text-green-600 font-medium">
                  +250% more inquiries
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100/50">
                <div className="flex items-center mb-4">
                  <HiTrendingUp className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="font-semibold text-gray-800">Mike's Journey</span>
                </div>
                <p className="text-gray-700 mb-4">
                  "Getting verified and adding client testimonials helped me land my biggest project yet.
                  The optimization guide was a game-changer!"
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  5-star rating achieved
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOptimizationGuide;
