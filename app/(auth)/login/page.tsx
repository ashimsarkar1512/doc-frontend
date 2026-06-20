"use client";

import { Eye, EyeOff, Loader2, Shield, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Logo from "@/components/ui/Logo";

import { useLoginMutation } from "@/Redux/api/authApi";
import { setOtpPending } from "@/Redux/features/auth/authSlice";
import { useAppDispatch } from "@/Redux/store/hooks";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<"patient" | "doctor">("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();

      if (res.data.status === "OTP_REQUIRED") {
        // Store userId and email in Redux so the next page can call send-otp
        dispatch(
          setOtpPending({
            userId: res.data.userId,
            challengeId: null,
            method: "EMAIL",
            purpose: "LOGIN",
            email,
          }),
        );
        toast.success(res.message);
        router.push("/receive-otp");
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Login failed. Please check your credentials.";
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
                <div className="flex justify-center mb-3">
                  <Logo variant="light" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-4">
                  Welcome Back
                </h2>
                <p className="text-xs text-white/70 mt-1 font-light">
                  Sign in to your account to continue
                </p>
              </header>

              {/* Tabs */}
              <nav className="bg-black/25 p-1 rounded-2xl border border-white/5 flex mb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("patient")}
                  className={`flex-grow py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    activeTab === "patient"
                      ? "bg-white text-[#0A3D3A] shadow-md scale-[1.02]"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  Patient Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("doctor")}
                  className={`flex-grow py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    activeTab === "doctor"
                      ? "bg-white text-[#0A3D3A] shadow-md scale-[1.02]"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Doctor Login
                </button>
                <Link
                  href="/"
                  className="flex-grow py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all duration-300 text-white/75 hover:text-white hover:bg-white/5"
                >
                  New Register
                </Link>
              </nav>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex-grow flex flex-col justify-between mt-2"
              >
                <div className="space-y-5 flex-grow flex flex-col justify-center">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-200">
                      Email Address
                    </label>
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
                    <label className="block text-xs font-semibold text-gray-200">
                      Password
                    </label>
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
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <footer className="mt-auto">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Login <span className="text-base">→</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <a
                      href="/forgot-password"
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
