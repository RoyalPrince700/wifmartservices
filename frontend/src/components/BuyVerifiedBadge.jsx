// src/components/user/BuyVerifiedBadge.jsx
import React from 'react';
import { initiateBadgePayment, verifyBadgePayment } from '../../services/api';
import { toast } from 'react-hot-toast';

const BuyVerifiedBadge = () => {
  const handlePayment = async (plan) => {
    try {
      // Step 1: Initiate
      const { txRef, amount, customer } = await initiateBadgePayment(plan);

      // Step 2: Load Flutterwave
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;
      script.onload = () => {
        window.FlutterwaveCheckout({
          public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
          tx_ref: txRef,
          amount: amount,
          currency: 'NGN',
          payment_options: 'card, banktransfer, ussd, mobilemoney',
          customer: {
            email: customer.email,
            phone_number: customer.phone,
            name: customer.name,
          },
          customizations: {
            title: 'Get Verified Badge',
            description: `Pay ₦${amount} to unlock full features`,
            logo: 'https://wifmart.com/logo.png',
          },
          callback: async (response) => {
            try {
              const result = await verifyBadgePayment(response.transaction_id);
              if (result.success) {
                toast.success('🎉 Success! You’re now verified!');
                window.location.reload(); // Refresh to show new status
              } else {
                toast.error('Payment verification failed.');
              }
            } catch (err) {
              toast.error('Could not verify payment.');
            } finally {
              window.Flutterwave.close();
            }
          },
          onclose: () => {
            console.log('Payment window closed');
          },
        });
      };
      document.body.appendChild(script);
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-3">Get Verified Badge</h3>
      <p className="text-gray-600 mb-4">
        Pay to unlock:
        <ul className="list-disc list-inside ml-4 mt-1">
          <li>Upload CAC certificate</li>
          <li>Add more portfolio images</li>
          <li>Verified badge on your profile</li>
        </ul>
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handlePayment('monthly')}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Pay ₦1,000/month
        </button>
        <button
          onClick={() => handlePayment('yearly')}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Pay ₦10,000/year 🎉 Save ₦2,000!
        </button>
      </div>
    </div>
  );
};

export default BuyVerifiedBadge;