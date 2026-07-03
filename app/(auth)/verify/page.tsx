"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Logo from "@/components/ui/Logo";

import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/Redux/api/authApi";
import { setCredentials } from "@/Redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/store/hooks";

const VerifyPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const otpPending = useAppSelector((state) => state.auth.otpPending);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // ── OTP input handlers ──────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digitsOnly = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!digitsOnly) return;

    const newOtp = [...otp];
    for (let i = 0; i < digitsOnly.length; i++) newOtp[i] = digitsOnly[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(digitsOnly.length, 5)]?.focus();
  };

  // ── Submit OTP ──────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }

    if (!otpPending?.challengeId) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      const res = await verifyOtp({
        challengeId: otpPending.challengeId,
        otp: otpCode,
      }).unwrap();

      toast.success(res.message);

      // FORGOT_PASSWORD flow — go to reset-password, no credentials to store
      if (otpPending.purpose === "FORGOT_PASSWORD") {
        router.push("/reset-password");
        return;
      }

      // LOGIN flow — store credentials and redirect to dashboard
      dispatch(
        setCredentials({
          user: res.data.user,
          accessToken: res.data.accessToken,
        }),
      );

      const roles = res.data.user.roles ?? [];
      if (roles.includes("DOCTOR")) {
        router.push("/doctor");
      } else {
        router.push("/patient");
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Invalid OTP. Please try again.";
      toast.error(message);
    }
  };

  // ── Resend OTP ──────────────────────────────────────────────────────────────

  const handleResend = async () => {
    if (!otpPending?.userId || !otpPending?.challengeId) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      const resendRes = await resendOtp({
        challengeId: otpPending.challengeId,
        userId: otpPending.userId,
        purpose: otpPending.purpose,
      }).unwrap();

      toast.success(resendRes.message);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to resend OTP.";
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
                <div className="flex flex-col items-center gap-[12px] w-full text-center">
                  <h2 style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: "30px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "100%",
                  }}>
                    Verify Authentication
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
                    Enter the 6 digit authentication code we've sent at your
                    <br />
                    {otpPending?.method === "PHONE" ? "phone" : "email"}
                  </p>
                </div>
              </header>

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[40px]">
                <div className="w-full flex flex-col gap-6">
                  <div className="w-full">
                    <label style={{
                      display: "block",
                      color: "#FFF",
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "100%",
                      marginBottom: "8px",
                      textAlign: "left"
                    }}>
                      Enter OTP
                    </label>
                    <div className="flex justify-between gap-2 sm:gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={handlePaste}
                          placeholder="-"
                          className="flex-1 min-w-0 aspect-square max-h-16 bg-white/10 border border-white/10 rounded-[14px] text-center text-lg sm:text-xl text-white font-semibold placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-200"
                        />
                      ))}
                    </div>
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
                        Verifying…
                      </>
                    ) : (
                      <>
                        Verify Authentication <ArrowRight className="w-6 h-6 ml-1" strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2 flex flex-col gap-2">
                    <span className="text-[20px] font-light text-white" style={{ fontFamily: "Quicksand, sans-serif" }}>
                      Didn't receive the code?
                    </span>
                    <button
                      type="button"
                      disabled={isResending}
                      onClick={handleResend}
                      className="text-[20px] font-normal text-white hover:text-gray-200 transition-colors underline underline-offset-4 disabled:opacity-50"
                      style={{ fontFamily: "Quicksand, sans-serif" }}
                    >
                      {isResending ? "Sending..." : "Resend"}
                    </button>
                  </div>
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

export default VerifyPage;
