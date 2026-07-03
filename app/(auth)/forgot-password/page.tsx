"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Loader2, Mail } from 'lucide-react';

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
          email: res.data.email || email,
          phone: res.data.phone || "",
        } as any)
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

      <main className="flex flex-col items-center px-4 sm:px-6 pt-[180px] pb-[80px] w-full">
        <div className="w-full flex justify-center">
          <div className="relative text-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col p-[40px] w-[620px] min-h-[620px] max-w-full">
            <Image
              src="/footer.png"
              alt="Auth Background"
              fill
              priority
              quality={100}
              className="object-cover z-0 pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10 pointer-events-none" />

            <div className="relative z-20 flex flex-col items-center justify-center gap-[40px] w-full flex-grow">
              {/* Header */}
              <header className="w-full text-center flex flex-col items-center gap-[30px]">
                <Logo variant="light" />
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors duration-200 px-6 py-2.5 rounded-full text-sm font-medium text-white backdrop-blur-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>
                <div className="flex flex-col items-center gap-[12px] w-full">
                  <h2 style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: "30px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "100%",
                  }}>
                    Forgot Password
                  </h2>
                  <p style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "150%",
                  }}>
                    Enter your registered email address
                  </p>
                </div>
              </header>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-[40px]"
              >
                <div className="w-full flex flex-col gap-6">
                  <div className="space-y-2">
                    <label style={{
                      display: "block",
                      color: "#FFF",
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "100%",
                      marginBottom: "8px"
                    }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full h-[56px] bg-white/10 border border-white/10 rounded-[14px] px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      display: "flex",
                      height: "60px",
                      padding: "10px 116px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "9px",
                      alignSelf: "stretch",
                      borderRadius: "14px",
                      color: "#FFF",
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: "22px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "100%",
                    }}
                    className="w-full bg-[#1D4ED8] hover:bg-[#1e40af] active:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Checking account…
                      </>
                    ) : (
                      <>
                        Continue <ArrowRight className="w-6 h-6 ml-1" strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>
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
