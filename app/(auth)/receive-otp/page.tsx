"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Logo from '@/components/ui/Logo';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ReceiveOtpPage = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<'email' | 'phone'>('email');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending OTP to:', selectedOption);
    router.push('/verify');
  };

  return (
    <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-white flex flex-col [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Navbar variant="dark" />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 pt-32 md:pt-40 pb-12 w-full">
        <div className="w-full max-w-[620px] flex justify-center">

          {/* Card */}
          <div
            className="relative text-white rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col justify-between p-6 sm:p-8 md:p-12 w-full min-h-[600px] md:min-h-[700px]"
          >
            {/* Background Image */}
            <Image
              src="/footer.png"
              alt="Auth Background"
              fill
              priority
              quality={100}
              className="object-cover z-0 pointer-events-none select-none"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />

            {/* Content Wrapper */}
            <div className="relative z-20 flex flex-col h-full w-full">

              {/* Header Content */}
              <header className="text-center mb-6 sm:mb-10">
                <div className="flex justify-center mb-4">
                  <Logo variant="light" />
                </div>

                {/* Back Button */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors duration-200 px-6 py-2.5 rounded-full text-sm font-medium text-white backdrop-blur-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 sm:mb-4">Receive OTP Code</h2>
                <p className="text-sm md:text-base text-white/80 max-w-md mx-auto leading-relaxed">
                  Choose the option to receive the code
                </p>
              </header>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between">
                <div className="flex flex-col space-y-4 py-4 w-full max-w-md mx-auto">
                  
                  {/* Email Option */}
                  <label 
                    className={`flex items-center gap-3 p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedOption === 'email' 
                        ? 'bg-white/20 border-white/40 shadow-lg' 
                        : 'bg-white/10 border-white/10 hover:bg-white/15'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      selectedOption === 'email' ? 'border-[#2563eb] bg-white' : 'border-white/50 bg-white/20'
                    }`}>
                      {selectedOption === 'email' && <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />}
                    </div>
                    <input 
                      type="radio" 
                      name="otp-option" 
                      value="email" 
                      checked={selectedOption === 'email'}
                      onChange={() => setSelectedOption('email')}
                      className="hidden"
                    />
                    <span className="text-sm sm:text-base font-medium text-white">Email: ex******@email.com</span>
                  </label>

                  {/* Phone Option */}
                  <label 
                    className={`flex items-center gap-3 p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedOption === 'phone' 
                        ? 'bg-white/20 border-white/40 shadow-lg' 
                        : 'bg-white/10 border-white/10 hover:bg-white/15'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      selectedOption === 'phone' ? 'border-[#2563eb] bg-white' : 'border-white/50 bg-white/20'
                    }`}>
                      {selectedOption === 'phone' && <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />}
                    </div>
                    <input 
                      type="radio" 
                      name="otp-option" 
                      value="phone" 
                      checked={selectedOption === 'phone'}
                      onChange={() => setSelectedOption('phone')}
                      className="hidden"
                    />
                    <span className="text-sm sm:text-base font-medium text-white">Phone: +123********90</span>
                  </label>

                </div>

                {/* Action Buttons */}
                <footer className="mt-8 space-y-4 text-center">
                  <button
                    type="submit"
                    className="w-full max-w-md mx-auto bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-all duration-200 py-4 md:py-5 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99]"
                  >
                    Send Code <ArrowRight className="h-5 w-5" />
                  </button>
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

export default ReceiveOtpPage;
