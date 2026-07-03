"use client";

import { Eye, EyeOff, Loader2, Shield, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Logo from "@/components/ui/Logo";

import { useLoginMutation } from "@/Redux/api/authApi";
import { setOtpPending, setCredentials } from "@/Redux/features/auth/authSlice";
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
            email: res.data.email || email,
            phone: res.data.phone || "",
          } as any),
        );
        toast.success(res.message);
        router.push("/receive-otp");
      } else if (res.data?.accessToken && res.data?.user) {
        // MFA disabled or not required, direct login
        dispatch(
          setCredentials({
            user: res.data.user,
            accessToken: res.data.accessToken,
          })
        );
        toast.success("Login successful");

        const roles = res.data.user.roles ?? [];
        if (roles.includes("DOCTOR") || roles.includes("PROVIDER")) {
          router.push("/doctor");
        } else {
          router.push("/patient");
        }
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
                    Welcome Back
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
                    Sign in to your account to continue
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
                      placeholder="Enter your email"
                      className="w-full h-[56px] bg-white/10 border border-white/10 rounded-[14px] px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                    />
                  </div>

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
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-[56px] bg-white/10 border border-white/10 rounded-[14px] px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm pr-12"
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
                        Signing in…
                      </>
                    ) : (
                      <>
                        Login <ArrowRight className="w-6 h-6 ml-1" strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <Link
                      href="/forgot-password"
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
                      Forgot Password?
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

export default LoginPage;
