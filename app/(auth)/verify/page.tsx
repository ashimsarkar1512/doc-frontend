"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Logo from '@/components/ui/Logo';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const VerifyPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Allow only the last digit if multiple are typed somehow
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    // Only take digits and max 6 characters
    const digitsOnly = pastedData.replace(/\D/g, '').slice(0, 6);

    if (!digitsOnly) return;

    const newOtp = [...otp];
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i < 6) newOtp[i] = digitsOnly[i];
    }
    setOtp(newOtp);

    // Focus last filled input or the next empty one
    const focusIndex = Math.min(digitsOnly.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      console.log('Verifying OTP:', otpCode);
      // Implement verification logic here
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-white flex flex-col [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Navbar — fixed with z-index so it stays on top */}
      <div className="fixed top-0 left-0 right-0 z-50 py-10 bg-white/80 backdrop-blur-sm">
        <Navbar variant="dark" />
      </div>

      {/* Main Content — fills viewport height so card is centered, footer below */}
      <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 pt-24 pb-8">
        <div className="w-full max-w-[620px] flex justify-center">

          {/* Verify Card */}
          <div
            className="relative text-white rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col justify-between p-6 sm:p-8 md:p-12 w-full"
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

              {/* Header Content — Logo first, then Back Button below */}
              <header className="text-center mb-6 sm:mb-10">
                <div className="flex justify-center mb-4">
                  <Logo variant="light" />
                </div>

                {/* Back Button — now below the logo */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors duration-200 px-6 py-2.5 rounded-full text-sm font-medium text-white backdrop-blur-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 sm:mb-4">Verify Authentication</h2>
                <p className="text-sm md:text-base text-white/80 max-w-md mx-auto leading-relaxed">
                  Enter the 6 digit authentication code we&apos;ve sent you at your email & phone number.
                </p>
              </header>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-white mb-4">Enter OTP</label>
                    <div className="flex justify-between gap-1.5 sm:gap-2 md:gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { inputRefs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={handlePaste}
                          placeholder="-"
                          className="flex-1 min-w-0 aspect-square max-h-16 bg-white/10 border border-white/10 rounded-xl md:rounded-2xl text-center text-lg sm:text-xl md:text-2xl text-white font-semibold placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-200"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <footer className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 text-center">
                  <button
                    type="submit"
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-all duration-200 py-4 md:py-5 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99]"
                  >
                    Verify Authentication <ArrowRight className="h-5 w-5" />
                  </button>

                  <div className="flex flex-col items-center gap-2 text-sm">
                    <span className="text-white/80 font-light">Didn&apos;t receive the code?</span>
                    <button
                      type="button"
                      className="text-white font-medium hover:text-gray-200 transition-colors underline underline-offset-4"
                    >
                      Resend
                    </button>
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

export default VerifyPage;