# Wifmart - Requirements Specification

## 📋 Overview

Wifmart is an online marketplace platform that connects service providers with clients. Service providers can create profiles, showcase their portfolios, and clients can search and hire them based on skills and names.

## 🎯 Functional Requirements

### 1. User Authentication & Authorization
- **FR1.1:** Users must be able to sign in using Google OAuth 2.0
- **FR1.2:** System must generate and manage JWT tokens for session management
- **FR1.3:** Secure authentication flow with proper error handling
- **FR1.4:** Users must be able to sign out securely

### 2. User Profile Management
- **FR2.1:** Users must be able to create and update their profiles with:
  - Full name
  - Bio/description
  - Phone number
  - WhatsApp contact link
  - External portfolio link
  - Profile picture
- **FR2.2:** Profile pictures must be uploaded to Cloudinary storage
- **FR2.3:** Users must be able to view and edit their profile information
- **FR2.4:** System must validate profile data before saving

### 3. Service Provider Services Management
- **FR3.1:** Service providers must be able to add multiple skills/services
- **FR3.2:** Each service must include:
  - Skill name
  - Category
  - Description
- **FR3.3:** Service providers must be able to update and delete services
- **FR3.4:** System must validate service data

### 4. Portfolio Management
- **FR4.1:** Service providers must be able to upload up to 5 portfolio images
- **FR4.2:** Portfolio images must be stored in Cloudinary
- **FR4.3:** Optional external portfolio/social media links must be supported
- **FR4.4:** Service providers must be able to delete portfolio items
- **FR4.5:** Images must be properly optimized and named (userId_timestamp.extension)

### 5. Search Functionality
- **FR5.1:** Clients must be able to search service providers by:
  - Skills (skill-based search)
  - Name (name-based search)
- **FR5.2:** Search results must display relevant service provider profiles
- **FR5.3:** Search must be case-insensitive and support partial matches

### 6. Notification System
- **FR6.1:** Users must receive welcome notifications upon sign-in
- **FR6.2:** System must support notification management
- **FR6.3:** Future: Email notifications for important events

### 7. User Interface & Navigation
- **FR7.1:** Platform must have responsive design for mobile and desktop
- **FR7.2:** Public pages must include:
  - Home page with search functionality
  - Service provider listings
  - Individual profile view pages
- **FR7.3:** Authenticated users must have access to dashboard with:
  - Profile management
  - Service management
  - Portfolio management

## 🔧 Technical Requirements

### Frontend
- **TR1.1:** Built with React (JSX) using Vite as build tool
- **TR1.2:** Styled with TailwindCSS for responsive design
- **TR1.3:** Must support modern browsers (Chrome, Firefox, Safari, Edge)
- **TR1.4:** Must be mobile-responsive
- **TR1.5:** Must handle loading states and error states gracefully

### Backend
- **TR2.1:** Built with Node.js and Express.js
- **TR2.2:** Must implement RESTful API design principles
- **TR2.3:** Must handle CORS properly for frontend integration
- **TR2.4:** Must implement proper error handling and logging
- **TR2.5:** Must support environment-based configuration

### Database
- **TR3.1:** MongoDB with Mongoose ODM
- **TR3.2:** Must implement proper schema validation
- **TR3.3:** Must support database indexing for search performance
- **TR3.4:** Must implement proper data relationships

### Media Storage
- **TR4.1:** Cloudinary integration for image storage
- **TR4.2:** Organized folder structure:
  - `wifmart/profile-images/` for profile pictures
  - `wifmart/portfolio-images/` for portfolio samples
- **TR4.3:** Proper file naming convention: `userId_timestamp.extension`

### Authentication
- **TR5.1:** Google OAuth 2.0 integration
- **TR5.2:** JWT token-based session management
- **TR5.3:** Secure token storage and validation
- **TR5.4:** Proper logout and token invalidation

## 📊 Database Schema Requirements

### Users Collection
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| _id | ObjectId | Auto-generated | MongoDB ID |
| googleId | String | Required, Unique | Google account unique ID |
| name | String | Required | Full name |
| email | String | Required, Unique | User email |
| bio | String | Optional | Short description |
| phone | String | Optional | Contact number |
| whatsapp | String | Optional | WhatsApp link |
| portfolio_link | String | Optional | External portfolio URL |
| profile_image | String | Optional | Cloudinary URL for profile picture |
| created_at | Date | Auto-generated | Signup date |

### Services Collection
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| _id | ObjectId | Auto-generated | MongoDB ID |
| user_id | ObjectId | Required | Reference to user's _id |
| skill | String | Required | Skill name |
| category | String | Required | Category of service |
| description | String | Required | Service details |

### Portfolios Collection
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| _id | ObjectId | Auto-generated | MongoDB ID |
| user_id | ObjectId | Required | Reference to user's _id |
| image_url | String | Required | Cloudinary URL for portfolio image |
| link | String | Optional | External portfolio/social link |

## 🌐 API Requirements

### Authentication Endpoints
- `POST /api/auth/google` - Google OAuth sign-in
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### User Management Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-profile-image` - Upload profile image

### Services Endpoints
- `GET /api/services` - Get user's services
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Portfolio Endpoints
- `GET /api/portfolios` - Get user's portfolio
- `POST /api/portfolios` - Upload portfolio image
- `DELETE /api/portfolios/:id` - Delete portfolio item

### Search Endpoints
- `GET /api/search?skill=:skill` - Search by skill
- `GET /api/search?name=:name` - Search by name

## 📱 User Experience Requirements

### Performance
- **PER1:** Page load times must be under 3 seconds
- **PER2:** Image uploads must complete within 10 seconds
- **PER3:** Search results must appear within 2 seconds

### Accessibility
- **ACC1:** Platform must support keyboard navigation
- **ACC2:** Color contrast must meet WCAG guidelines
- **ACC3:** Alt text must be provided for all images

### Security
- **SEC1:** All user inputs must be validated and sanitized
- **SEC2:** JWT tokens must have appropriate expiration times
- **SEC3:** File uploads must be validated for type and size
- **SEC4:** Sensitive data must be properly encrypted

## 🧪 Testing Requirements

### Unit Testing
- **TEST1:** All utility functions must have unit tests
- **TEST2:** API endpoints must have unit tests for success and error cases

### Integration Testing
- **TEST3:** Authentication flow must be integration tested
- **TEST4:** Database operations must be integration tested

### User Acceptance Testing
- **TEST5:** Complete user workflows must be tested
- **TEST6:** Cross-browser compatibility must be verified

## 📈 Future Enhancement Requirements

### Planned Features
- User ratings and reviews system
- Location-based search functionality
- Payment integration with Stripe
- In-app messaging system
- Advanced search filters
- Redis caching for performance optimization

## 🚀 Deployment Requirements

- **DEP1:** Platform must be deployable to cloud services (Vercel, Heroku, etc.)
- **DEP2:** Environment variables must be properly configured
- **DEP3:** Database backups must be automated
- **DEP4:** CDN integration for static assets
- **DEP5:** SSL certificates must be configured

---

*This requirements document serves as the foundation for Wifmart development and should be updated as new features are planned and implemented.*
