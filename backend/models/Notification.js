// backend/models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'message',
        'hire_request',
        'hire_accepted',
        'verification_approved',
        'badge_granted',
        'payment_received',
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      enum: ['Service', 'ChatMessage', 'User'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);