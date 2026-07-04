"use client";

import React, { useRef, useState } from "react";
import { useSubmitContactLeadMutation } from "@/Redux/features/contact/contactApi";

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

export default function ContactForm() {
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

  return (
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
  );
}
