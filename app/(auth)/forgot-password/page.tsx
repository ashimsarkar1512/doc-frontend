"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Logo from '@/components/ui/Logo';

import { useForgotPasswordMutation } from '@/Redux/api/authApi';
import { setOtpPending } from '@/Redux/features/auth/authSlice';
import { useAppDispatch } from '@/Redux/store/hooks';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await forgotPassword({ email }).unwrap();

      // Store userId + purpose so receive-otp page can send OTP correctly
      dispatch(
        setOtpPending({
          userId: res.data.userId,
          challengeId: null,
          method: 'EMAIL',
          purpose: 'FORGOT_PASSWORD',
        })
      );

      // Show the exact API message
      toast.success(res.message);
      router.push('/receive-otp');
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        'Something went wrong. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar variant="dark" />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 pt-32 md:pt-40 pb-12 w-full">
        <div className="w-full max-w-[620px] flex justify-center">
          <div className="relative text-white rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col justify-between p-6 sm:p-8 md:p-12 w-full min-h-[600px] md:min-h-[700px]">
            <Image
              src="/footer.png"
              alt="Auth Background"
              fill
              priority
              quality={100}
              className="object-cover z-0 pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />

            <div className="relative z-20 flex flex-col justify-between h-full w-full">
              {/* Header */}
              <header className="text-center mb-4">
                <div className="flex justify-center mb-4">
                  <Logo variant="light" />
                </div>

                <div className="flex justify-center mb-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors duration-200 px-6 py-2.5 rounded-full text-sm font-medium text-white backdrop-blur-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
                  Forgot Password
                </h2>
                <p className="text-xs text-white/70 mt-2 font-light max-w-xs mx-auto leading-relaxed">
                  Enter your registered email address and we'll send you a verification code.
                </p>
              </header>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-grow flex flex-col mt-4">
                <div className="space-y-5 flex-grow flex flex-col justify-center mt-16">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-200">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="w-full bg-white/10 border border-white/10 rounded-2xl pl-11 pr-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <footer className="mb-18">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Checking account…
                      </>
                    ) : (
                      <>Continue <span className="text-base">→</span></>
                    )}
                  </button>

                  {/* <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      className="text-xs font-light text-white/80 hover:text-white transition-colors underline underline-offset-4"
                    >
                      Back to Login
                    </button>
                  </div> */}
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

export default ForgotPasswordPage;
