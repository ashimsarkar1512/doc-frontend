"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { useSubmitContactLeadMutation } from "@/Redux/features/contact/contactApi";
import Expert from "@/components/home/Expert";
import { useGetWebsiteSettingsQuery } from "@/Redux/features/footerData/footerDataApi";
import { useGetHeroSectionByPageQuery } from "@/Redux/features/heroSection/heroSectionApi";

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

  const { data: heroData, isLoading: isHeroLoading } = useGetHeroSectionByPageQuery("ContactUs");

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
      <section className="pt-28 md:pt-36 px-4 sm:px-6 max-w-[1520px] mx-auto">
        <div className="relative bg-[#f4f7fa] rounded-[32px] w-full py-20 md:py-28 flex flex-col items-center justify-center min-h-[240px]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[32px] px-6 md:px-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 394"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-auto max-h-[90%] opacity-[0.55]"
            >
              <path
                d="M88.6828 394C59.8517 394 37.7723 385.792 22.4444 369.375C7.48147 352.958 0 329.793 0 299.878V94.1222C0 64.2074 7.48147 41.0417 22.4444 24.625C37.7723 8.20833 59.8517 0 88.6828 0C117.514 0 139.411 8.20833 154.374 24.625C169.702 41.0417 177.366 64.2074 177.366 94.1222V134.617H120.433V90.2917C120.433 66.5787 110.397 54.7222 90.325 54.7222C70.2528 54.7222 60.2167 66.5787 60.2167 90.2917V304.256C60.2167 327.604 70.2528 339.278 90.325 339.278C110.397 339.278 120.433 327.604 120.433 304.256V245.703H177.366V299.878C177.366 329.793 169.702 352.958 154.374 369.375C139.411 385.792 117.514 394 88.6828 394Z"
                fill="url(#g1)"
              />
              <path
                d="M301.503 394C271.942 394 249.315 385.609 233.622 368.828C217.929 352.046 210.083 328.333 210.083 297.689V96.3111C210.083 65.6667 217.929 41.9537 233.622 25.1722C249.315 8.39074 271.942 0 301.503 0C331.063 0 353.69 8.39074 369.383 25.1722C385.076 41.9537 392.922 65.6667 392.922 96.3111V297.689C392.922 328.333 385.076 352.046 369.383 368.828C353.69 385.609 331.063 394 301.503 394ZM301.503 339.278C322.305 339.278 332.706 326.692 332.706 301.519V92.4806C332.706 67.3083 322.305 54.7222 301.503 54.7222C280.7 54.7222 270.299 67.3083 270.299 92.4806V301.519C270.299 326.692 280.7 339.278 301.503 339.278Z"
                fill="url(#g1)"
              />
              <path
                d="M433.646 5.47222H509.19L567.765 234.758H568.859V5.47222H622.507V388.528H560.648L488.388 108.897H487.293V388.528H433.646V5.47222Z"
                fill="url(#g1)"
              />
              <path
                d="M714.342 60.1944H651.388V5.47222H837.512V60.1944H774.559V388.528H714.342V60.1944Z"
                fill="url(#g1)"
              />
              <path
                d="M888.072 5.47222H969.638L1032.04 388.528H971.828L960.88 312.464V313.558H892.451L881.503 388.528H825.666L888.072 5.47222ZM953.763 261.572L926.939 72.2333H925.844L899.568 261.572H953.763Z"
                fill="url(#g1)"
              />
              <path
                d="M1145.04 394C1116.21 394 1094.13 385.792 1078.8 369.375C1063.84 352.958 1056.36 329.793 1056.36 299.878V94.1222C1056.36 64.2074 1063.84 41.0417 1078.8 24.625C1094.13 8.20833 1116.21 0 1145.04 0C1173.87 0 1195.77 8.20833 1210.73 24.625C1226.06 41.0417 1233.72 64.2074 1233.72 94.1222V134.617H1176.79V90.2917C1176.79 66.5787 1166.76 54.7222 1146.68 54.7222C1126.61 54.7222 1116.57 66.5787 1116.57 90.2917V304.256C1116.57 327.604 1126.61 339.278 1146.68 339.278C1166.76 339.278 1176.79 327.604 1176.79 304.256V245.703H1233.72V299.878C1233.72 329.793 1226.06 352.958 1210.73 369.375C1195.77 385.792 1173.87 394 1145.04 394Z"
                fill="url(#g1)"
              />
              <path
                d="M1316.83 60.1944H1253.88V5.47222H1440V60.1944H1377.05V388.528H1316.83V60.1944Z"
                fill="url(#g1)"
              />
              <defs>
                <linearGradient
                  id="g1"
                  x1="720"
                  y1="0"
                  x2="720"
                  y2="394"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#C8CDD2" />
                  <stop offset="1" stopColor="#C8CDD2" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="relative z-10 text-center px-4">
            {isHeroLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-64 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-96 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-72 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-5xl xl:lg:text-[76px] font-bold text-gray-900 mb-4 tracking-tight">
                  {heroData?.title || "Contact Us"}
                </h1>
                <p className="text-sm md:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
                  {heroData?.description ||
                    "Contact us to schedule a consultation with our medical team and explore personalized options to support your weight management goals."}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

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
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-28">
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
