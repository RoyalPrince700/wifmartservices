// backend/controllers/subscriptionController.js
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import 'dotenv/config'; // ← Ensures process.env is loaded

// 🔍 Debug: Log environment variables on server start
console.log("🔑 Backend Flutterwave Secret Key:", process.env.FLUTTERWAVE_SECRET_KEY ? "✅ Loaded" : "❌ Missing");
console.log("🔑 Backend JWT Secret:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");
console.log("🔑 Backend MongoDB URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing");

// Pricing configuration
const PRICING_CONFIG = {
  basic: {
    monthly: { amount: 1000, currency: 'NGN' },
    yearly: { amount: 10000, currency: 'NGN' }
  },
  premium: {
    monthly: { amount: 2000, currency: 'NGN' },
    yearly: { amount: 20000, currency: 'NGN' }
  },
  ultimate: {
    monthly: { amount: 3000, currency: 'NGN' },
    yearly: { amount: 30000, currency: 'NGN' }
  }
};

// Legacy pricing for backward compatibility
const LEGACY_PRICING = {
  monthly: 1000,
  '6months': 5000,
  yearly: 10000
};

// ✅ Updated function to support tiers
export const initiateBadgePayment = async (req, res) => {
  const { plan, tier } = req.body;
  const userId = req.user.id;

  // Handle legacy requests (backward compatibility)
  if (!tier && ['monthly', 'yearly', '6months'].includes(plan)) {
    const amount = LEGACY_PRICING[plan];
    const txRef = `badge_${Date.now()}_${userId}`;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const subscription = new Subscription({
        userId,
        type: plan,
        tier: 'basic', // Default to basic for legacy requests
        amount,
        txRef,
        status: 'pending',
      });

      await subscription.save();

      return res.json({
        txRef,
        amount,
        currency: 'NGN',
        customer: {
          email: user.email,
          phone: user.whatsapp || 'N/A',
          name: user.name,
        },
        plan,
        tier: 'basic',
      });
    } catch (error) {
      console.error('Initiate Payment Error:', error);
      return res.status(500).json({ error: 'Failed to initiate payment' });
    }
  }

  // Handle new tier-based requests
  if (!tier || !['basic', 'premium', 'ultimate'].includes(tier)) {
    return res.status(400).json({ error: 'Invalid tier. Choose "basic", "premium", or "ultimate".' });
  }

  if (!plan || !['monthly', 'yearly'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan. Choose "monthly" or "yearly".' });
  }

  const pricing = PRICING_CONFIG[tier][plan];
  if (!pricing) {
    return res.status(400).json({ error: 'Invalid pricing configuration' });
  }

  const txRef = `wifmart_${tier}_${plan}_${userId}_${Date.now()}`;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const subscription = new Subscription({
      userId,
      type: plan,
      tier,
      amount: pricing.amount,
      txRef,
      status: 'pending',
    });

    await subscription.save();

    res.json({
      txRef,
      amount: pricing.amount,
      currency: pricing.currency,
      customer: {
        email: user.email,
        phone: user.whatsapp || 'N/A',
        name: user.name,
      },
      plan,
      tier,
    });
  } catch (error) {
    console.error('Initiate Payment Error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

// backend/controllers/subscriptionController.js

export const verifyBadgePayment = async (req, res) => {
  const { transaction_id } = req.body; // ✅ From Flutterwave callback

  if (!transaction_id) {
    return res.status(400).json({ error: 'transaction_id is required' });
  }

  try {
    // ✅ Step 1: Verify with Flutterwave using THEIR transaction_id
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!verifyRes.ok) {
      const errorText = await verifyRes.text();
      console.error('Flutterwave API error:', errorText);
      return res.status(500).json({ error: 'Verification failed' });
    }

    const data = await verifyRes.json();

    if (data.status !== 'success' || data.data.status !== 'successful') {
      return res.json({ success: false, message: 'Payment not successful' });
    }

    // ✅ Step 2: Extract YOUR tx_ref from the response
    const flwTxRef = data.data.tx_ref; // e.g., 'badge_1756405943253_...'

    // ✅ Step 3: Find your subscription
    const subscription = await Subscription.findOne({ txRef: flwTxRef }).populate('userId');
    if (!subscription) {
      return res.status(404).json({ error: 'Transaction not found in our system' });
    }

    if (subscription.status === 'successful') {
      return res.json({ success: true, message: 'Already verified' });
    }

    // ✅ Step 4: Update subscription
    subscription.status = 'successful';
    await subscription.save();

    // ✅ Step 5: Update user
    const user = await User.findById(subscription.userId._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const startDate = new Date();
    const endDate = new Date();
    const monthsToAdd = subscription.type === 'yearly' ? 12 : subscription.type === '6months' ? 6 : 1;
    endDate.setMonth(endDate.getMonth() + monthsToAdd);

    user.isVerifiedBadge = true;
    user.verification_status = 'Approved';
    user.subscriptionType = subscription.type;
    user.subscriptionTier = subscription.tier || 'basic'; // Set tier, default to basic for legacy
    user.subscriptionStart = startDate;
    user.subscriptionEnd = endDate;

    await user.save();

    res.json({
      success: true,
      message: '🎉 You are now verified!',
      user: {
        isVerifiedBadge: user.isVerifiedBadge,
        verification_status: user.verification_status,
        subscriptionType: user.subscriptionType,
        subscriptionTier: user.subscriptionTier,
        subscriptionStart: user.subscriptionStart,
        subscriptionEnd: user.subscriptionEnd,
      },
    });
  } catch (error) {
    console.error('Verification Error:', error.message);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
};