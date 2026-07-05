"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSubscribeNewsletterMutation } from "@/Redux/features/footerData/footerDataApi";

export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await subscribeNewsletter({ email }).unwrap();
      if (response?.success) {
        toast.success(response.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(response?.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || "Failed to subscribe. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <form
      onSubmit={handleSubscribe}
      className="mt-6 flex items-center justify-between w-full max-w-[420px] bg-[#313e40] rounded-[14px] p-[6px] border border-white/5"
    >
      <input
        type="email"
        required
        disabled={isLoading}
        placeholder="Enter your mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent text-white placeholder-white/50 text-[16px] font-normal font-[Quicksand] px-3 outline-none border-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-[16px] px-6 py-2.5 rounded-[10px] transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap font-[Quicksand]"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Subscribing...</span>
          </>
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}
