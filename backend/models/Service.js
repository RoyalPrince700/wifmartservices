// backend/models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  // Keeps your existing fields
  client_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  provider_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  event_date: { 
    type: Date 
  },
  location: { 
    type: String 
  },
  budget: { 
    type: String 
  },
  phone: { 
    type: String, 
    required: true // Matches HireRequestModal requirement
  },
  email: { 
    type: String, 
    required: true // Matches HireRequestModal requirement
  },
  message: { 
    type: String, 
    required: true 
  },
  attachment_url: { 
    type: String 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'hired', 'completed'], // Added 'completed' to align with hireController.js
    default: 'pending'
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  reviewed: { 
    type: Boolean, 
    default: false 
  },
  read: { 
    type: Boolean, 
    default: false 
  }
});

// Index for faster queries (provider dashboard)
serviceSchema.index({ provider_id: 1, status: 1, created_at: -1 });

export default mongoose.model('Service', serviceSchema);
