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
                    Receive OTP Code
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
                    Choose how you want to receive the verification code
                  </p>
                </div>
              </header>

              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-[40px]"
              >
                <div className="w-full flex flex-col gap-6">
                  {/* Email Option */}
                  <label
                    className={`flex items-center gap-3 p-4 sm:p-5 rounded-[14px] border transition-all duration-200 cursor-pointer ${selectedMethod === "EMAIL"
                        ? "bg-white/20 border-white/40 shadow-lg"
                        : "bg-white/10 border-white/10 hover:bg-white/15"
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedMethod === "EMAIL"
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

                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] text-white/90">Email:</span>
                      {otpPending?.email && (
                        <span className="text-[15px] text-white/90">
                          {maskEmail(otpPending.email)}
                        </span>
                      )}
                    </div>
                  </label>

                  {/* Phone Option */}
                  {otpPending?.phone && (
                    <label
                      className={`flex items-center gap-3 p-4 sm:p-5 rounded-[14px] border transition-all duration-200 cursor-pointer ${selectedMethod === "PHONE"
                          ? "bg-white/20 border-white/40 shadow-lg"
                          : "bg-white/10 border-white/10 hover:bg-white/15"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedMethod === "PHONE"
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

                      <div className="flex items-center gap-1.5">
                        <span className="text-[15px] text-white/90">Phone:</span>
                        <span className="text-[15px] text-white/90">
                          {maskPhone(otpPending.phone)}
                        </span>
                      </div>
                    </label>
                  )}
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
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Code <ArrowRight className="w-6 h-6 ml-1" strokeWidth={2.5} />
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

export default ReceiveOtpPage;
