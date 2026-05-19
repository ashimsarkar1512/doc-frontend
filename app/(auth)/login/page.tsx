import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Logo from '@/components/ui/Logo';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="dark"/>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-6 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-[#0A3D3A] text-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Card Header */}
            <div className="px-8 pt-8 pb-6 text-center">
              
              <h1 className="text-2xl font-bold tracking-tight">WEIGHTLOSS MD</h1>
              <p className="text-sm text-gray-300 mt-1">Welcome Back</p>
              <p className="text-gray-400 text-sm mt-1">
                Sign in to your account to continue
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-8">
              <button className="flex-1 py-4 text-center border-b-2 border-white text-white font-medium">
                Patient Login
              </button>
              <button className="flex-1 py-4 text-center text-gray-400 hover:text-white transition">
                Doctor Login
              </button>
              <button className="flex-1 py-4 text-center text-gray-400 hover:text-white transition">
                New Register
              </button>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition"
                />
              </div>

              <div className="flex justify-end">
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition">
                  Forgot Password?
                </a>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2">
                Login
                <span>→</span>
              </button>
            </div>

            {/* Footer Text */}
            <div className="px-8 py-6 text-center border-t border-white/10">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;