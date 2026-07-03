"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Logo from "@/components/ui/Logo";

import { useResetPasswordMutation } from "@/Redux/api/authApi";
import { useAppSelector } from "@/Redux/store/hooks";
import Link from "next/link";

const isPasswordValid = (password: string) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasUpperCase && hasLowerCase && hasSpecialChar;
};

const ResetPasswordPage = () => {
  const router = useRouter();
  const otpPending = useAppSelector((state) => state.auth.otpPending);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid(newPassword)) {
      toast.error("Password must meet all complexity requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!otpPending?.challengeId) {
      toast.error("Session expired. Please start again.");
      router.push("/forgot-password");
      return;
    }

    try {
      const res = await resetPassword({
        challengeId: otpPending.challengeId,
        newPassword,
        confirmPassword,
      }).unwrap();

      toast.success(res.message);
      router.push("/login");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to reset password. Please try again.";
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
                    Reset Password
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
                    Enter your new password below
                  </p>
                </div>
              </header>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-[40px]"
              >
                <div className="w-full flex flex-col gap-6">
                  {/* New Password */}
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
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className={`w-full h-[56px] bg-white/10 border rounded-[14px] px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 transition-all duration-200 text-sm pr-12 ${
                          newPassword && !isPasswordValid(newPassword)
                            ? "border-red-400/60 focus:border-red-400"
                            : "border-white/10 focus:border-white/30"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-200"
                        aria-label={showNew ? "Hide password" : "Show password"}
                      >
                        {showNew ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                    {newPassword && !isPasswordValid(newPassword) && (
                      <p className="text-xs text-red-400 mt-1">
                        Must be 8+ chars, include upper, lower, & special char.
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
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
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className={`w-full h-[56px] bg-white/10 border rounded-[14px] px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 transition-all duration-200 text-sm pr-12 ${
                          confirmPassword && newPassword !== confirmPassword
                            ? "border-red-400/60 focus:border-red-400"
                            : "border-white/10 focus:border-white/30"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-200"
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">
                        Passwords do not match.
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      !newPassword ||
                      !isPasswordValid(newPassword) ||
                      newPassword !== confirmPassword
                    }
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
                        Resetting…
                      </>
                    ) : (
                      <>
                        Reset Password <ArrowRight className="w-6 h-6 ml-1" strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="hover:text-gray-200 transition-colors"
                      style={{
                        color: "#FFF",
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "100%",
                        textDecoration: "underline",
                        textUnderlineOffset: "auto",
                        textDecorationSkipInk: "auto",
                        textDecorationThickness: "auto"
                      }}
                    >
                      Back to Login
                    </Link>
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

export default ResetPasswordPage;
