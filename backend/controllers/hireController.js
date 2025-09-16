// controllers/hireController.js
import Service from '../models/Service.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import { sendHireConfirmationEmail } from '../mailtrap/emails.js';

export const sendHireRequest = async (req, res) => {
  try {
    const { providerId } = req.params; // comes from URL
    const { title, description, eventDate, location, budget, phone, email, message } = req.body;
    const clientId = req.user._id;

    // Validate provider exists
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Handle file upload
    let attachment_url = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'wifmart/hire-attachments');
      attachment_url = result.secure_url;
    }

    // Use snake_case to match Service model
    const service = new Service({
      client_id: clientId,
      provider_id: providerId,
      title,
      description,
      event_date: eventDate,
      location,
      budget,
      phone,
      email,
      message,
      attachment_url,
      status: 'pending',
    });

    await service.save();

    // Send hire notification email immediately when hire request is submitted
    console.log('🎯 Hire request submitted - attempting to send notification email...');
    console.log('  - Service ID:', service._id);
    console.log('  - Provider ID:', service.provider_id);
    console.log('  - Client ID:', service.client_id);
    
    try {
      console.log('🔍 Fetching populated service data for email...');
      // Populate client and provider data for email
      const populatedService = await Service.findById(service._id)
        .populate('client_id', 'name email')
        .populate('provider_id', 'name email');

      console.log('📊 Populated service data for email:');
      console.log('  - Provider:', populatedService?.provider_id);
      console.log('  - Client:', populatedService?.client_id);
      console.log('  - Service Title:', populatedService?.title);

      if (populatedService && populatedService.provider_id && populatedService.client_id) {
        console.log('✅ All required data available, sending hire notification email...');
        await sendHireConfirmationEmail(
          populatedService.provider_id.email,
          populatedService.provider_id.name,
          populatedService.client_id.name,
          populatedService.title
        );
        console.log('✅ Hire notification email sent to:', populatedService.provider_id.email);
      } else {
        console.warn('⚠️  Could not send hire notification email: missing user data');
        console.warn('  - populatedService exists:', !!populatedService);
        console.warn('  - provider_id exists:', !!populatedService?.provider_id);
        console.warn('  - client_id exists:', !!populatedService?.client_id);
      }
    } catch (emailError) {
      console.error('❌ Failed to send hire notification email:');
      console.error('  - Error message:', emailError.message);
      console.error('  - Error stack:', emailError.stack);
      console.error('  - Full error:', emailError);
      // Log the error but don't throw - hire request should continue even if email fails
    }

    res.status(201).json({
      message: 'Hire request sent successfully',
      request: {
        id: service._id,
        title,
        message,
        event_date: eventDate,
        location,
        budget,
        phone,
        email,
        status: service.status,
      },
    });
  } catch (error) {
    console.error('Error sending hire request:', error);
    res.status(500).json({ message: 'Failed to send hire request' });
  }
};

/**
 * GET /api/hire/requests
 * Get all pending (and past) hire requests for this provider
 */
export const getHireRequests = async (req, res) => {
  try {
    const requests = await Service.find({ provider_id: req.user._id })
      .populate('client_id', 'name profile_image whatsapp verification_status isVerifiedBadge')
      .sort({ created_at: -1 })
      .lean();

    // Map requests to match ClientRequestModal's expected camelCase
    // Use explicit client fields to ensure name is preserved
    const formattedRequests = requests.map((service) => {
      const client = service.client_id
        ? {
            _id: service.client_id._id,
            name: service.client_id.name,
            profile_image: service.client_id.profile_image,
            whatsapp: service.client_id.whatsapp,
            isVerifiedBadge: service.client_id.isVerifiedBadge,
            verification_status: service.client_id.verification_status,
            isVerified: service.client_id.verification_status === 'Approved',
          }
        : null;

      return {
        id: service._id,
        client_id: client,
        title: service.title,
        description: service.description,
        eventDate: service.event_date, // Convert to camelCase
        location: service.location,
        budget: service.budget,
        phone: service.phone,
        email: service.email,
        message: service.message,
        attachmentUrl: service.attachment_url, // Convert to camelCase
        status: service.status,
        read: service.read,
        created_at: service.created_at,
      };
    });

    await Service.updateMany(
      { provider_id: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({ data: formattedRequests });
  } catch (error) {
    console.error('Error fetching hire requests:', error);
    res.status(500).json({ message: 'Failed to fetch hire requests' });
  }
};

/**
 * PATCH /api/hire/:id/status
 * Update the status of a hire request
 * Only allowed transitions:
 * pending → accepted/rejected
 * accepted → hired
 * hired → completed
 */
export const updateHireStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ['pending', 'accepted', 'rejected', 'hired', 'completed'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid or missing status. Must be one of: pending, accepted, rejected, hired, completed',
      });
    }

    // Find the service
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Hire request not found' });
    }

    // Check authorization
    if (status !== 'completed') {
      // Provider can accept/reject/hire
      if (service.provider_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only the provider can update this status' });
      }
    } else {
      // Only client can mark as completed
      if (service.client_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only the client can mark this as completed' });
      }
    }

    // Prevent invalid transitions
    const validTransitions = {
      pending: ['accepted', 'rejected'],
      accepted: ['hired'],
      hired: ['completed'],
      rejected: [],
      completed: [],
    };

    if (!validTransitions[service.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from "${service.status}" to "${status}"`,
      });
    }

    // Update status
    service.status = status;
    await service.save();

    // Send hire confirmation email when status changes to 'hired'
    if (status === 'hired') {
      console.log('🎯 Status changed to "hired" - attempting to send email notification...');
      console.log('  - Service ID:', service._id);
      console.log('  - Provider ID:', service.provider_id);
      console.log('  - Client ID:', service.client_id);
      
      try {
        console.log('🔍 Fetching populated service data...');
        // Populate client and provider data for email
        const populatedService = await Service.findById(service._id)
          .populate('client_id', 'name email')
          .populate('provider_id', 'name email');

        console.log('📊 Populated service data:');
        console.log('  - Provider:', populatedService?.provider_id);
        console.log('  - Client:', populatedService?.client_id);
        console.log('  - Service Title:', populatedService?.title);

        if (populatedService && populatedService.provider_id && populatedService.client_id) {
          console.log('✅ All required data available, sending email...');
          await sendHireConfirmationEmail(
            populatedService.provider_id.email,
            populatedService.provider_id.name,
            populatedService.client_id.name,
            populatedService.title
          );
          console.log('✅ Hire confirmation email sent to:', populatedService.provider_id.email);
        } else {
          console.warn('⚠️  Could not send hire confirmation email: missing user data');
          console.warn('  - populatedService exists:', !!populatedService);
          console.warn('  - provider_id exists:', !!populatedService?.provider_id);
          console.warn('  - client_id exists:', !!populatedService?.client_id);
        }
      } catch (emailError) {
        console.error('❌ Failed to send hire confirmation email:');
        console.error('  - Error message:', emailError.message);
        console.error('  - Error stack:', emailError.stack);
        console.error('  - Full error:', emailError);
        // Log the error but don't throw - hire process should continue even if email fails
      }
    } else {
      console.log('ℹ️  Status changed to:', status, '- no email notification needed');
    }

    res.status(200).json({
      message: 'Status updated successfully',
      status: service.status,
    });
  } catch (error) {
    console.error('Error updating hire status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

/**
 * POST /api/hire/:serviceId/review
 * Leave a review for a completed service
 */
export const leaveReview = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { rating, comment } = req.body;
    const clientId = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find the service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user is the client for this service
    if (service.client_id.toString() !== clientId.toString()) {
      return res.status(403).json({ message: 'Only the client can leave a review' });
    }

    // Check if service is completed
    if (service.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed services' });
    }

    // Check if already reviewed
    if (service.reviewed) {
      return res.status(400).json({ message: 'Service already reviewed' });
    }

    // Create the review
    const review = new Review({
      service_id: serviceId,
      client_id: clientId,
      provider_id: service.provider_id,
      rating: Number(rating),
      comment: comment || ''
    });

    await review.save();

    // Mark service as reviewed
    service.reviewed = true;
    await service.save();

    // Update provider's rating and total reviews
    const provider = await User.findById(service.provider_id);
    if (provider) {
      // Get all reviews for this provider
      const allReviews = await Review.find({ provider_id: service.provider_id });

      // Calculate new average rating
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      const newAverageRating = totalRating / allReviews.length;

      // Update provider
      provider.rating = Math.round(newAverageRating * 10) / 10; // Round to 1 decimal place
      provider.totalReviews = allReviews.length;
      await provider.save();
    }

    res.status(201).json({
      message: 'Review submitted successfully',
      review: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at
      }
    });
  } catch (error) {
    console.error('Error leaving review:', error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

/**
 * GET /api/hire/:serviceId/review
 * Get review for a service
 */
export const getReview = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const review = await Review.findOne({ service_id: serviceId })
      .populate('client_id', 'name profile_image')
      .populate('provider_id', 'name profile_image');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      review: {
        id: review._id,
        service_id: review.service_id,
        client: {
          id: review.client_id._id,
          name: review.client_id.name,
          profile_image: review.client_id.profile_image
        },
        provider: {
          id: review.provider_id._id,
          name: review.provider_id.name,
          profile_image: review.provider_id.profile_image
        },
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Failed to fetch review' });
  }
};