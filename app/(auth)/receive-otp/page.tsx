"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Logo from "@/components/ui/Logo";

import { useSendOtpMutation } from "@/Redux/api/authApi";
import { setOtpPending } from "@/Redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/store/hooks";

const maskEmail = (email: string) => {
  if (!email) return "";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visibleChars = name.length > 4 ? name.slice(0, 4) : name;
  return `${visibleChars}****@${domain}`;
};

const maskPhone = (phone: string) => {
  if (!phone) return "";
  if (phone.length < 4) return phone;
  const visibleChars = phone.slice(-4);
  return `****${visibleChars}`;
};

const ReceiveOtpPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const otpPending = useAppSelector((state) => state.auth.otpPending);

// console.log(otpPending)


  const [selectedMethod, setSelectedMethod] = useState<"EMAIL" | "PHONE">(
    "EMAIL",
  );

  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpPending?.userId) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      const res = await sendOtp({
        userId: otpPending.userId,
        purpose: otpPending.purpose,
        method: selectedMethod,
      }).unwrap();

      // Store challengeId so verify page can use it
      dispatch(
        setOtpPending({
          userId: otpPending.userId,
          challengeId: res.data.challengeId,
          method: selectedMethod,
          purpose: otpPending.purpose ?? "LOGIN",
          email: otpPending.email,
          phone: otpPending.phone,
        }),
      );

      toast.success(res.message);
      router.push("/verify");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to send OTP. Please try again.";
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
                  Receive OTP Code
                </h2>
                <p className="text-sm md:text-base text-white/80 max-w-md mx-auto leading-relaxed">
                  Choose how you want to receive the verification code
                </p>
              </header>

              <form
                onSubmit={handleSubmit}
                className="flex-grow flex flex-col justify-between"
              >
                <div className="flex flex-col space-y-4 py-4 w-full max-w-md mx-auto">
                  {/* Email Option */}
                  <label
                    className={`flex items-center gap-3 p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedMethod === "EMAIL"
                        ? "bg-white/20 border-white/40 shadow-lg"
                        : "bg-white/10 border-white/10 hover:bg-white/15"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        selectedMethod === "EMAIL"
                          ? "border-[#2563eb] bg-white"
                          : "border-white/50 bg-white/20"
                      }`}
                    >
                      {selectedMethod === "EMAIL" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="otp-method"
                      value="EMAIL"
                      checked={selectedMethod === "EMAIL"}
                      onChange={() => setSelectedMethod("EMAIL")}
                      className="hidden"
                    />
                  
                    <div className="">
                      {otpPending?.email && (
                        <span className="text-lg text-white/70">
                          {maskEmail(otpPending.email)}
                        </span>
                      )}
                    </div>
                  </label>

                  {/* Phone Option */}
                  <label
                    className={`flex items-center gap-3 p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedMethod === "PHONE"
                        ? "bg-white/20 border-white/40 shadow-lg"
                        : "bg-white/10 border-white/10 hover:bg-white/15"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        selectedMethod === "PHONE"
                          ? "border-[#2563eb] bg-white"
                          : "border-white/50 bg-white/20"
                      }`}
                    >
                      {selectedMethod === "PHONE" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="otp-method"
                      value="PHONE"
                      checked={selectedMethod === "PHONE"}
                      onChange={() => setSelectedMethod("PHONE")}
                      className="hidden"
                    />
                    
                    <div className="">
                      {otpPending?.phone && (
                        <span className="text-lg text-white/70">
                          {maskPhone(otpPending.phone)}
                        </span>
                      )}
                    </div>
                  </label>
                </div>

                <footer className="mt-8 space-y-4 text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full max-w-md mx-auto bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-4 md:py-5 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Code <ArrowRight className="h-5 w-5" />
                      </>
                    )}
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
