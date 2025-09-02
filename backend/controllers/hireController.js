// controllers/hireController.js
import Service from '../models/Service.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

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
      .populate('client_id', 'name profile_image whatsapp')
      .sort({ created_at: -1 });

    // Map requests to match ClientRequestModal's expected camelCase
    const formattedRequests = requests.map((service) => ({
      id: service._id,
      client_id: service.client_id,
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
    }));

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

    res.status(200).json({
      message: 'Status updated successfully',
      status: service.status,
    });
  } catch (error) {
    console.error('Error updating hire status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};