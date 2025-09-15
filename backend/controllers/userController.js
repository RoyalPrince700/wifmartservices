// controllers/userController.js
import User from '../models/User.js';
import Service from '../models/Service.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import { calculateProfileCompletion } from '../utils/profileUtils.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Get user by ID (public)
 */
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user (name, bio, etc.) — protected route
 */
export const updateUser = async (req, res, next) => {
  try {
    const { name, bio, experience_pitch, phone, whatsapp, portfolio_link, profile_image } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, experience_pitch, phone, whatsapp, portfolio_link, profile_image },
      { new: true, runValidators: true }
    ).select('-googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged-in user
 */
export const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * Setup or complete user profile (first time or edit)
 * Expects: skills (string), whatsapp, phone, instagram_handle, cac_number
 * Files: profile_image, cac_certificate
 */
// controllers/userController.js
// controllers/userController.js
export const setupProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      name,
      skills,
      experience_pitch,
      whatsapp,
      phone,
      instagram_handle,
      x_handle,
      linkedin_handle,
      portfolio_link,
      location_state,
      physical_address,
      cac_number,
      portfolio_images_to_delete,
    } = req.body;

    const updateData = {};

    // ✅ Name
    if (name) updateData.name = name;

    // ✅ Skills: split by comma or || and capitalize
    if (skills) {
      const capitalizeWords = (str) => {
        return str
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };
      
      updateData.skills = skills
        .split(/,|\|\|/)
        .map(skill => capitalizeWords(skill.trim()))
        .filter(skill => skill);
    }

    // ✅ Experience & Pitch
    if (experience_pitch) updateData.experience_pitch = experience_pitch;

    // ✅ Contact Info
    if (whatsapp) updateData.whatsapp = whatsapp;
    if (phone) updateData.phone = phone;
    if (portfolio_link) updateData.portfolio_link = portfolio_link;

    // ✅ Social Media
    if (instagram_handle) updateData.instagram_handle = instagram_handle;
    if (x_handle) updateData.x_handle = x_handle;
    if (linkedin_handle) updateData.linkedin_handle = linkedin_handle;

    // ✅ Location
    if (location_state) updateData.location_state = location_state;
    if (physical_address) updateData.physical_address = physical_address;

    // ✅ CAC
    if (cac_number) updateData.cac_number = cac_number;

    // ✅ Handle portfolio image deletions
    if (portfolio_images_to_delete) {
      const imagesToDelete = Array.isArray(portfolio_images_to_delete)
        ? portfolio_images_to_delete
        : [portfolio_images_to_delete];

      if (imagesToDelete.length > 0) {
        // Delete from Cloudinary
        const deletePromises = imagesToDelete.map(async (url) => {
          try {
            // Extract public_id from Cloudinary URL
            const urlParts = url.split('/');
            const filename = urlParts[urlParts.length - 1];
            const publicId = `wifmart/portfolio/${filename.split('.')[0]}`;

            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.error('Error deleting from Cloudinary:', error);
          }
        });

        await Promise.all(deletePromises);

        // Filter out deleted images from user's portfolio_images
        if (req.user.portfolio_images) {
          updateData.portfolio_images = req.user.portfolio_images.filter(
            image => !imagesToDelete.includes(image.url)
          );
        }
      }
    }

    // ✅ Handle file uploads
    if (req.files) {
      // 🖼️ Profile Image
      if (req.files['profile_image'] && req.files['profile_image'].length > 0) {
        const file = req.files['profile_image'][0];
        const result = await uploadToCloudinary(file, 'wifmart/profiles');
        updateData.profile_image = result.secure_url;
      }

      // 📄 CAC Certificate
      if (req.files['cac_certificate'] && req.files['cac_certificate'].length > 0) {
        const file = req.files['cac_certificate'][0];
        const result = await uploadToCloudinary(file, 'wifmart/cac');
        updateData.cac_certificate = result.secure_url;
        updateData.cac_status = 'Pending Verification';
      }

      // 🖼️ Portfolio Images
      if (req.files['portfolio_images']) {
        const uploadPromises = req.files['portfolio_images'].map(async (file) => {
          const result = await uploadToCloudinary(file, 'wifmart/portfolio');
          return {
            url: result.secure_url,
            public_id: result.public_id
          };
        });
        const newImages = await Promise.all(uploadPromises);

        // Get current portfolio images (after any deletions)
        const currentPortfolioImages = updateData.portfolio_images || req.user.portfolio_images || [];

        updateData.portfolio_images = [
          ...currentPortfolioImages,  // Keep existing (after deletions)
          ...newImages                // Add new
        ];
      }
    }

    // ✅ Recalculate profile completion
    updateData.profile_completion = calculateProfileCompletion({
      ...req.user._doc,
      ...updateData,
    });

    // ✅ Update user
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-googleId -password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error in setupProfile:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      message: 'Internal server error during profile setup',
    });
  }
};

/**
 * Get current user's public profile (for dashboard)
 */
export const getProfile = async (req, res, next) => {
  try {
   const user = await User.findById(req.user._id).select(
  'name profile_image skills whatsapp phone instagram_handle cac_status verification_status isVerifiedBadge profile_completion'
);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of providers hired by this user (client)
 */
// backend/controllers/userController.js

// backend/controllers/userController.js

export const getHiredProviders = async (req, res, next) => {
  try {
    console.log('🔍 getHiredProviders - User ID:', req.user._id);

    const services = await Service.find({ client_id: req.user._id })
     .populate('provider_id', 'name profile_image skills verification_status isVerifiedBadge')

      .sort({ created_at: -1 });

    console.log('📊 Found services for hired providers:', services);

    const hiredProviders = services.map((service) => {
      if (!service.provider_id) {
        return {
          id: null,
          name: "Unknown Provider",
          profile_image: null,
          service: service.title,
          hireDate: service.created_at || service.createdAt,
          status: service.status,
          serviceId: service._id,
        };
      }

      return {
        id: service.provider_id._id,
        name: service.provider_id.name,
        profile_image: service.provider_id.profile_image,
        service: service.title,
        hireDate: service.created_at || service.createdAt,
        status: service.status,
        serviceId: service._id,
        // ✅ Add verification fields
        isVerifiedBadge: service.provider_id.isVerifiedBadge,
        isVerified: service.provider_id.verification_status === 'Approved',
        verification_status: service.provider_id.verification_status,
      };
    });

    console.log('📤 Sending hiredProviders:', hiredProviders);
    res.status(200).json({ hiredProviders });
  } catch (error) {
    next(error);
  }
};


/**
 * Get list of clients for this provider
 * Includes hire request details
 */
export const getClients = async (req, res, next) => {
  try {
    const services = await Service.find({ provider_id: req.user._id })
    .populate('client_id', 'name profile_image email phone whatsapp verification_status isVerifiedBadge')

      .sort({ created_at: -1 });

    const clients = services.map((service) => {
      if (!service.client_id) {
        return {
          id: null,
          name: "Unknown Client",
          profile_image: null,
          email: null,
          phone: null,
          whatsapp: null,
          service: service.title,
          since: service.created_at || service.createdAt,
          status: service.status,
          requestDetails: {
            title: service.title,
            message: service.message,
            eventDate: service.event_date,
            location: service.location,
            budget: service.budget,
            attachmentUrl: service.attachment_url,
          },
        };
      }

      return {
        id: service.client_id._id,
        name: service.client_id.name,
        profile_image: service.client_id.profile_image,
        email: service.client_id.email,
        phone: service.client_id.phone,
        whatsapp: service.client_id.whatsapp,
        service: service.title,
        since: service.created_at || service.createdAt,
        status: service.status,
        // ✅ Add verification fields
        isVerifiedBadge: service.client_id.isVerifiedBadge,
        isVerified: service.client_id.verification_status === 'Approved',
        verification_status: service.client_id.verification_status,
        requestDetails: {
          title: service.title,
          message: service.message,
          eventDate: service.event_date,
          location: service.location,
          budget: service.budget,
          attachmentUrl: service.attachment_url,
        },
      };
    });

    res.status(200).json({ clients });
  } catch (error) {
    next(error);
  }
};


/**
 * Apply for provider verification
 */
export const applyForVerification = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const updateData = {
      verification_status: 'Pending',
    };

    // Handle verification document uploads
    if (req.files && req.files.verification_documents) {
      const docResults = await Promise.all(
        req.files.verification_documents.map((file) =>
          uploadToCloudinary(file, 'wifmart/verification')
        )
      );
      updateData.verification_documents = docResults.map((result) => result.secure_url);
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select('-googleId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Verification application submitted',
      user,
    });
  } catch (error) {
    next(error);
  }
};