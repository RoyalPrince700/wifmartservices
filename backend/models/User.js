// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  portfolio_link: { type: String, default: '' },
  profile_image: { type: String, default: '' },

  // ✅ Skills
  skills: [{ type: String, default: '' }],
  
  // ✅ Experience & Pitch
  experience_pitch: { type: String, default: '' },

  // ✅ Social Media
  instagram_handle: { type: String, default: '' },
  x_handle: { type: String, default: '' },
  linkedin_handle: { type: String, default: '' },

  // ✅ Location
  location_state: { type: String, default: '' },
  physical_address: { type: String, default: '' },

  // ✅ CAC & Verification
  cac_number: { type: String, default: '' },
  cac_certificate: { type: String, default: '' },
  cac_status: {
    type: String,
    enum: ['Not Submitted', 'Pending Verification', 'Verified'],
    default: 'Not Submitted',
  },
  verification_status: {
    type: String,
    enum: ['Not Applied', 'Pending', 'Approved', 'Rejected'],
    default: 'Not Applied',
  },
  verification_rejection_reason: { type: String, default: '' },

  // ✅ Portfolio Images - Improved: Store URL and public_id
  portfolio_images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    }
  ],

  // ✅ Subscription & Badge Verification (NEW)
  isVerifiedBadge: {
    type: Boolean,
    default: false, // True when they've paid and are active
  },
  subscriptionType: {
    type: String,
    enum: ['monthly', 'yearly', null],
    default: null, // 'monthly' or 'yearly'
  },
  subscriptionStart: {
    type: Date,
    default: null,
  },
  subscriptionEnd: {
    type: Date,
    default: null,
  },

  // ✅ Rating System
  rating: { type: Number, default: 3.5, min: 1, max: 5 }, // Default rating for new users
  totalReviews: { type: Number, default: 0 }, // Track number of reviews received

  // ✅ Profile & Admin
  profile_completion: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
}, {
  timestamps: true, // Adds `createdAt` and `updatedAt`
});

// Virtual property to get role based on isAdmin
userSchema.virtual('role').get(function() {
  return this.isAdmin ? 'admin' : 'user';
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export default mongoose.model('User', userSchema);