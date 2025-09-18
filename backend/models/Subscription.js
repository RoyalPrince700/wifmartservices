// models/Subscription.js
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['monthly', 'yearly', '6months'],
    required: true,
  },
  tier: {
    type: String,
    enum: ['basic', 'premium', 'ultimate'],
    default: 'basic',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'NGN',
  },
  txRef: {
    type: String,
    required: true,
    unique: true,
  },
  flwRef: String,
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);