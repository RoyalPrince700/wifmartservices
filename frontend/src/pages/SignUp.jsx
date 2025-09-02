import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import cubeImage from "../assets/cylinder.png";
import waveImage from "../assets/noodle.png";
import SummaryApi from '../../common';
const Signup = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Add this line to check if the form is submitting
    if (data.password === data.confirmPassword) {
        try {
            const response = await fetch(SummaryApi.signUp.url, {
                method: SummaryApi.signUp.method,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            if (response.status === 201) { // Successful signup
                const result = await response.json();
                if (result.success) {
                    toast.success(result.message);
                    navigate('/signin');
                } else {
                    toast.error(result.message || "An error occurred");
                }
            } else { // Handle non-201 response statuses
                const errorDetails = await response.json();
                console.error("Signup failed:", errorDetails);
                toast.error(errorDetails.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Network or server error:", error); // Log full error details to console
            toast.error('An error occurred. Please try again.');
        }
    } else {
        toast.error("Passwords do not match.");
    }
};

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#183EC2] to-[#EAEEFE] relative overflow-hidden">
      {/* Animated 3D Shapes */}
      <motion.img
        src={cubeImage}
        alt="Cube"
        className="absolute top-10 left-20 w-48 opacity-80"
        animate={{
          translateY: [-30, 30],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 5,
          ease: "easeInOut",
        }}
      />
      <motion.img
        src={waveImage}
        alt="Wave"
        className="absolute bottom-10 right-10 w-60 opacity-80"
        animate={{
          translateX: [-20, 20],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 4,
          ease: "easeInOut",
        }}
      />
      {/* Signup Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-4">Create Account</h2>
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              placeholder='Name'
              type="text"
              name='name'
              value={data.name}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-800'
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              placeholder='Email'
              type="email"
              name='email'
              value={data.email}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-800'
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              placeholder='Password'
              type={showPassword ? 'text' : 'password'}
              name='password'
              value={data.password}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-800'
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className='self-end text-sm text-gray-600'>
              {showPassword ? 'Hide' : 'Show'} Password
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              placeholder='Confirm Password'
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              value={data.confirmPassword}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-800'
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='self-end text-sm text-gray-600'>
              {showConfirmPassword ? 'Hide' : 'Show'} Confirm Password
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
};

export default Signup;
