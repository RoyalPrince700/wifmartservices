import React from "react";
import { motion } from "framer-motion";
import GoogleSignIn from "../components/Auth/GoogleSignIn.jsx";

import cubeImage from "../assets/cylinder.png";
import waveImage from "../assets/noodle.png";

function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6FAFF] via-[#EEF5FF] to-[#FFFFFF] relative overflow-hidden">
      {/* Animated 3D Shapes */}
      <motion.img
        src={cubeImage}
        alt="Cube"
        className="absolute top-10 left-20 w-48 opacity-10"
        animate={{ translateY: [-30, 30], rotate: [0, 360] }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 8, ease: "easeInOut" }}
      />
      <motion.img
        src={waveImage}
        alt="Wave"
        className="absolute bottom-10 right-10 w-60 opacity-10"
        animate={{ translateX: [-20, 20], scale: [1, 1.1] }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 6, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -100, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glass morphism card */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-8 shadow-2xl">
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Wifmart</h1>
            <p className="text-slate-600 text-lg">Sign in or join with Google</p>
          </motion.div>

          {/* Google Auth Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Info Card */}
            <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-slate-900 font-semibold text-lg mb-2">Quick & Secure Access</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Continue with your Google account to access Wifmart. No passwords, just secure OAuth.
              </p>
            </div>

            {/* Google Sign In Button */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <GoogleSignIn />
            </div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-3"
            >
              <div className="flex items-center text-slate-700 text-sm">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                No passwords to remember
              </div>
              <div className="flex items-center text-slate-700 text-sm">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Instant profile bootstrap
              </div>
              <div className="flex items-center text-slate-700 text-sm">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Secure OAuth 2.0
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center text-slate-500 text-xs mt-6"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default Auth;


