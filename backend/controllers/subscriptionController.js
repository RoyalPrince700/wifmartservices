// backend/controllers/subscriptionController.js
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import 'dotenv/config'; // ← Ensures process.env is loaded

// 🔍 Debug: Log environment variables on server start
console.log("🔑 Backend Flutterwave Secret Key:", process.env.FLUTTERWAVE_SECRET_KEY ? "✅ Loaded" : "❌ Missing");
console.log("🔑 Backend JWT Secret:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");
console.log("🔑 Backend MongoDB URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing");

// ✅ Add this missing function
export const initiateBadgePayment = async (req, res) => {
  const { plan } = req.body;
  const userId = req.user.id;

  if (!['monthly', 'yearly'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan. Choose "monthly" or "yearly".' });
  }

  const amount = plan === 'monthly' ? 1000 : 10000;
  const txRef = `badge_${Date.now()}_${userId}`;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const subscription = new Subscription({
      userId,
      type: plan,
      amount,
      txRef,
      status: 'pending',
    });

    await subscription.save();

    res.json({
      txRef,
      amount,
      currency: 'NGN',
      customer: {
        email: user.email,
        phone: user.whatsapp || 'N/A',
        name: user.name,
      },
      plan,
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
    endDate.setMonth(
      endDate.getMonth() + (subscription.type === 'yearly' ? 12 : 1)
    );

    user.isVerifiedBadge = true;
    user.verification_status = 'Approved';
    user.subscriptionType = subscription.type;
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
        subscriptionEnd: user.subscriptionEnd,
      },
    });
  } catch (error) {
    console.error('Verification Error:', error.message);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
};