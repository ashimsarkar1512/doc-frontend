"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Logo from '@/components/ui/Logo';
import { User, Shield, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="py-6">
        <Navbar variant="dark" />
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[620px] flex justify-center">
          
          {/* Senior Architected Login Card */}
          <div 
            className="relative text-white rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col justify-between p-8 md:p-12"
            style={{ 
              width: "100%",
              maxWidth: "620px",
              height: "708.66px"
            }}
          >
            {/* ⚡ Next.js Image Component (z-0) - Fully Optimized & priority loaded */}
            <Image 
              src="/footer.png"
              alt="Auth Background"
              fill
              priority
              quality={100}
              className="object-cover z-0 pointer-events-none select-none"
            />
            
            {/* Subtle overlay for text contrast (z-10) */}
            <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />

            {/* Core Interactive Layout Wrapper (z-20) */}
            <div className="relative z-20 flex flex-col justify-between h-full w-full">
              
              {/* Header Content */}
              <header className="text-center mb-4">
                <div className="flex justify-center mb-3">
                  <Logo variant="light" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-4">Welcome Back</h2>
                <p className="text-xs text-white/70 mt-1 font-light">
                  Sign in to your account to continue
                </p>
              </header>

              {/* Segmented Controls (Auth Selection Tabs) */}
              <nav className="bg-black/25 p-1 rounded-2xl border border-white/5 flex mb-2">
                <button 
                  type="button"
                  onClick={() => setActiveTab('patient')}
                  className={`flex-grow py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    activeTab === 'patient' 
                      ? 'bg-white text-[#0A3D3A] shadow-md scale-[1.02]' 
                      : 'text-white/75 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  Patient Login
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('doctor')}
                  className={`flex-grow py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    activeTab === 'doctor' 
                      ? 'bg-white text-[#0A3D3A] shadow-md scale-[1.02]' 
                      : 'text-white/75 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Doctor Login
                </button>
                {/* 
                  💡 Senior Developer Best Practice: 
                  Use Next.js Link instead of button + onClick router.push for direct navigation.
                  This ensures instant page prefetching, right-click capability, and SEO accessibility.
                */}
                <Link 
                  href="/"
                  className="flex-grow py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all duration-300 text-white/75 hover:text-white hover:bg-white/5"
                >
                  New Register
                </Link>
              </nav>

              {/* Login Form */}
              <form 
                onSubmit={(e) => e.preventDefault()} 
                className="flex-grow flex flex-col justify-between mt-2"
              >
                {/* Form Inputs Container */}
                <div className="space-y-5 flex-grow flex flex-col justify-center">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-200">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-200">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-200"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <footer className="mt-auto">
               <Link href="/verify">
                   <button 
                    type="submit" 
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-all duration-200 py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99]"
                  >
                    Login <span className="text-base">→</span>
                  </button>
                 </Link>

                  <div className="text-center pt-4">
                    <a 
                      href="#" 
                      className="text-xs font-light text-white/80 hover:text-white transition-colors underline underline-offset-4"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </footer>
              </form>

            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;