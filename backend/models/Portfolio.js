// backend/models/Portfolio.js
import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image_url: { type: String, required: true },
  link: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('Portfolio', portfolioSchema);