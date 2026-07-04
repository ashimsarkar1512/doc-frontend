"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { useSubmitContactLeadMutation } from "@/Redux/features/contact/contactApi";
import Expert from "@/components/home/Expert";
import { useGetWebsiteSettingsQuery } from "@/Redux/features/footerData/footerDataApi";
import CommonHero from "@/components/shared/CommonHero";
// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVICES = [
  "Medical Weight Loss",
  "Hormone Therapy",
  "Telehealth Consultation",
  "Prescription Management",
  "Wellness & Nutrition",
];

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitContactLead, { isLoading }] = useSubmitContactLeadMutation();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: settingsData, isLoading: settingsLoading } =
    useGetWebsiteSettingsQuery();
  const contactInfo = settingsData?.contactInfo;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setAttachment(e.target.files?.[0] ?? null);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await submitContactLead({
        ...form,
        attachments: attachment,
      }).unwrap();

      setSuccessMsg(
        "Your message has been sent! We'll get back to you shortly.",
      );
      setForm({ fullName: "", email: "", phone: "", service: "", message: "" });
      setAttachment(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setErrorMsg(
        apiErr?.data?.message ??
          "Something went wrong. Please try again later.",
      );
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="w-full bg-white pb-20">
      <Navbar variant="dark" />

      {/* ── HERO BANNER ── */}
      <CommonHero
        title="Contact Us"
        description="Contact us to schedule a consultation with our medical team and explore personalized options to support your weight management goals."
      />

      {/* ── FORM + OFFICE HOURS ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* LEFT: FORM */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Success Banner */}
            {successMsg && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 text-[14px] px-5 py-4 rounded-xl">
                <svg
                  className="w-5 h-5 mt-0.5 shrink-0 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {successMsg}
              </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-[14px] px-5 py-4 rounded-xl">
                <svg
                  className="w-5 h-5 mt-0.5 shrink-0 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
                  />
                </svg>
                {errorMsg}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-[22px] font-bold text-[#2B2922] mb-2.5"
              >
                Full Name:
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Alan Cattach"
                className={`w-full bg-[#f2f4f7] text-gray-800 placeholder-gray-400 text-[15px] px-5 py-4 rounded-xl border-none focus:ring-2 outline-none transition-all ${errors.fullName ? "ring-2 ring-red-400" : "focus:ring-blue-500"}`}
              />
              {errors.fullName && (
                <p className="mt-1.5 text-[13px] text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[22px] font-bold text-[#2B2922] mb-2.5"
                >
                  Email:
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alan.cattach@gmail.com"
                  className={`w-full bg-[#f2f4f7] text-gray-800 placeholder-gray-400 text-[15px] px-5 py-4 rounded-xl border-none focus:ring-2 outline-none transition-all ${errors.email ? "ring-2 ring-red-400" : "focus:ring-blue-500"}`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-[13px] text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-[22px] font-bold text-[#2B2922] mb-2.5"
                >
                  Contact Number:
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567890"
                  className="w-full bg-[#f2f4f7] text-gray-800 placeholder-gray-400 text-[15px] px-5 py-4 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Service */}
            <div>
              <label
                htmlFor="service"
                className="block text-[22px] font-bold text-[#2B2922] mb-2.5"
              >
                What service you are interested in? (optional)
              </label>
              <div className="relative">
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full appearance-none bg-[#f2f4f7] text-gray-700 text-[15px] px-5 py-4 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all text-lg"
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400">
                  <svg
                    className="h-5 w-5 opacity-70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-[22px] font-bold text-[#2B2922] mb-2.5"
              >
                Message / Questions:
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message or question here..."
                className="w-full bg-[#f2f4f7] text-gray-800 placeholder-gray-400 text-[15px] px-5 py-4 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
              />
            </div>

            {/* File Attachment */}
            {/* <div>
              <label htmlFor="attachments" className="block text-[15px] font-bold text-gray-900 mb-2.5">
                Attachment (optional)
              </label>
              <label
                htmlFor="attachments"
                className="flex items-center gap-3 w-full bg-[#f2f4f7] text-gray-500 text-[14px] px-5 py-4 rounded-xl cursor-pointer hover:bg-[#eaecf0] transition-all group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className={attachment ? "text-gray-800 font-medium" : ""}>
                  {attachment ? attachment.name : "Click to attach a file (PDF, image, etc.)"}
                </span>
                {attachment && (
                  <span className="ml-auto text-[12px] text-gray-400">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </label>
              <input
                ref={fileRef}
                id="attachments"
                name="attachments"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div> */}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2.5 bg-[#2563eb] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-[15px] px-8 py-3.5 rounded-[14px] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Sending…
                </>
              ) : (
                "Submit Message"
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: OFFICE HOURS CARD */}
        <div className="lg:col-span-1 h-[540px] mt-9 sticky top-24 self-start">
          <div
            className="rounded-[24px] overflow-hidden flex flex-col items-center pt-10 relative h-full border border-gray-200"
            style={{ background: "#eef2f6" }}
          >
            <div className="text-center px-6 relative z-10 w-full mb-6">
              <h3 className="font-bold text-[#212121] text-[30px] mb-4 tracking-tight">
                Office Hours
              </h3>
              {settingsLoading ? (
                <div className="space-y-2 mb-5">
                  <div className="h-4 w-3/4 mx-auto bg-gray-300/60 rounded animate-pulse" />
                  <div className="h-3 w-full bg-gray-300/40 rounded animate-pulse" />
                  <div className="h-3 w-4/5 mx-auto bg-gray-300/40 rounded animate-pulse" />
                  <div className="h-3 w-2/3 mx-auto bg-gray-300/40 rounded animate-pulse mt-2" />
                </div>
              ) : (
                <>
                  {/* TODO: Update openHours in admin settings (e.g. "Monday - Friday: 9 AM - 6 PM") */}
                  <p className="text-lg text-[#272628] mb-2 font-semibold">
                    {contactInfo?.openHours || "Monday - Friday: 9 AM - 6 PM"}
                  </p>

                  {/* TODO: Update closedDays in admin settings with full descriptive text
                       e.g. "Our Office is closed from 2 PM to 3 PM for lunch during the week." */}
                  <p className="text-lg text-[#3B3B3B] mb-5 leading-relaxed max-w-[280px] mx-auto">
                    {contactInfo?.closedDays &&
                    contactInfo.closedDays.length > 20
                      ? contactInfo.closedDays
                      : "Our Office is closed from 2 PM to 3 PM for lunch during the week."}
                  </p>

                  {/* TODO: Ensure phone and email are set correctly in admin settings */}
                  <div className="text-lg font-bold text-[#272628] flex justify-center gap-4 items-center gap-1.5 z-20">
                    <span>{contactInfo?.phone || "(720) 279-1164"}</span>
                    <span>{contactInfo?.email || "Info@wlmd.net"}</span>
                  </div>
                </>
              )}
            </div>
            <div className="absolute bottom-[180px] left-0 right-0 text-center z-[1] pointer-events-none select-none">
              <span
                className="font-black tracking-[0.18em] uppercase"
                style={{
                  fontSize: "clamp(64px, 8vw, 88px)",
                  background:
                    "linear-gradient(180deg, #a8c0e8 0%, rgba(168,192,232,0) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                WLMD
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-[2] flex justify-center pointer-events-none">
              <div className="relative w-full h-[280px]">
                <Image
                  src="/doctor-blog.png"
                  alt="Doctor"
                  fill
                  className="object-contain object-bottom drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEET OUR EXPERT PROVIDERS ── */}
      <section >
        <Expert />
      </section>

      {/* ── PARTNER PHARMACIES ── */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 mt-32 mb-16">
        <div className="relative flex items-center justify-center mb-14">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-dashed border-gray-200" />
          </div>
          <div className="relative bg-white px-5">
            <span className="text-gray-400 text-[13px] font-medium tracking-wide">
              Our partner pharmacies
            </span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 md:gap-x-16 lg:gap-x-20">
          <div className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full border-2 border-[#1aad8c] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#1aad8c]"
                fill="currentColor"
              >
                <path d="M12 4C8.13 4 5 7.13 5 11s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              </svg>
            </div>
            <span className="text-[22px] font-semibold text-[#1aad8c] tracking-tight leading-none">
              <span className="italic font-light text-[24px]">Ɛ</span>lympia
            </span>
          </div>
          <div className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#0ea5c6]/10">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#0ea5c6]"
                fill="currentColor"
              >
                <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[#0ea5c6] font-bold text-base">⊹</span>
                <span className="text-[17px] font-bold text-[#0b7a95] tracking-tight">
                  Casa Pharma Rx
                </span>
              </div>
            </div>
          </div>
          <div className="group">
            <span className="text-[32px] font-black text-[#4a2164] tracking-[-0.04em] leading-none">
              Vi<span className="text-[#7e44a3]">O</span>S
            </span>
          </div>
          <div className="flex items-center gap-1.5 group">
            <span className="text-[19px] font-bold text-[#1a9ab8] tracking-tight leading-none">
              AnazaoHealth
            </span>
            <div className="flex flex-col gap-0.5">
              <svg
                viewBox="0 0 12 12"
                className="w-3 h-3 text-[#1a9ab8]"
                fill="currentColor"
              >
                <polygon points="6,0 8,4 12,4 9,7 10,12 6,9 2,12 3,7 0,4 4,4" />
              </svg>
            </div>
          </div>
          <div className="group leading-none">
            <div className="text-[22px] font-black text-[#1e8847] tracking-tight">
              Belmar
            </div>
            <div className="text-[9px] font-medium tracking-[0.18em] uppercase text-[#1e8847]/60 mt-0.5">
              Pharma Solutions
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
