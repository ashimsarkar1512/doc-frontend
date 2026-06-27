"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Logo from '@/components/ui/Logo';

import { useVerifyOtpMutation, useResendOtpMutation } from '@/Redux/api/authApi';
import { setCredentials } from '@/Redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/Redux/store/hooks';

const VerifyPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const otpPending = useAppSelector((state) => state.auth.otpPending);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // ── OTP input handlers ──────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digitsOnly = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    if (!digitsOnly) return;

    const newOtp = [...otp];
    for (let i = 0; i < digitsOnly.length; i++) newOtp[i] = digitsOnly[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(digitsOnly.length, 5)]?.focus();
  };

  // ── Submit OTP ──────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      toast.error('Please enter the full 6-digit code.');
      return;
    }

    if (!otpPending?.challengeId) {
      toast.error('Session expired. Please log in again.');
      router.push('/login');
      return;
    }

    try {
      const res = await verifyOtp({
        challengeId: otpPending.challengeId,
        otp: otpCode,
      }).unwrap();

      toast.success(res.message);

      // FORGOT_PASSWORD flow — go to reset-password, no credentials to store
      if (otpPending.purpose === 'FORGOT_PASSWORD') {
        router.push('/reset-password');
        return;
      }

      // LOGIN flow — store credentials and redirect to dashboard
      dispatch(
        setCredentials({
          user: res.data.user,
          accessToken: res.data.accessToken,
        })
      );

      const roles = res.data.user.roles ?? [];
      if (roles.includes('DOCTOR')) {
        router.push('/doctor');
      } else {
        router.push('/patient');
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        'Invalid OTP. Please try again.';
      toast.error(message);
    }
  };

  // ── Resend OTP ──────────────────────────────────────────────────────────────

  const handleResend = async () => {
    if (!otpPending?.userId || !otpPending?.challengeId) {
      toast.error('Session expired. Please log in again.');
      router.push('/login');
      return;
    }

    try {
      const resendRes = await resendOtp({
        challengeId: otpPending.challengeId,
        userId: otpPending.userId,
        purpose: otpPending.purpose,
      }).unwrap();

      toast.success(resendRes.message);
      setOtp(new Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        'Failed to resend OTP.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-white flex flex-col [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

            <div className="relative z-20 flex flex-col h-full w-full">
              <header className="text-center mb-6 sm:mb-10">
                <div className="flex justify-center mb-4">
                  <Logo variant="light" />
                </div>

                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors duration-200 px-6 py-2.5 rounded-full text-sm font-medium text-white backdrop-blur-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 sm:mb-4">
                  Verify Authentication
                </h2>
                <p className="text-sm md:text-base text-white/80 max-w-md mx-auto leading-relaxed">
                  Enter the 6-digit code sent to your{' '}
                  {otpPending?.method === 'PHONE' ? 'phone' : 'email'}.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-white mb-4">
                      Enter OTP
                    </label>
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

                <footer className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-4 md:py-5 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>Verify Authentication <ArrowRight className="h-5 w-5" /></>
                    )}
                  </button>

                  <div className="flex flex-col items-center gap-2 text-sm">
                    <span className="text-white/80 font-light">Didn&apos;t receive the code?</span>
                    <button
                      type="button"
                      disabled={isResending}
                      onClick={handleResend}
                      className="text-white font-medium hover:text-gray-200 transition-colors underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        'Resend'
                      )}
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
