"use client";

import Image from "next/image";
import { Bell, Camera, Eye, EyeOff, LockKeyhole } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

const inputClassName =
  "h-10 w-full rounded-lg border border-transparent bg-[#f0f0f0] px-3 text-xs text-gray-700 outline-none transition-colors focus:border-blue-300 focus:bg-white";

const labelClassName = "mb-1.5 block text-xs font-medium text-gray-800";

export default function DoctorSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState("/doctor/profile-doc.png");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (profileImage.startsWith("blob:")) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const handleProfileImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const nextImage = URL.createObjectURL(file);

    setProfileImage((currentImage) => {
      if (currentImage.startsWith("blob:")) {
        URL.revokeObjectURL(currentImage);
      }

      return nextImage;
    });
  };

  return (
    <section className="pt-1">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Settings</h2>

      <div className="space-y-5">
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
          <h3 className="mb-5 text-sm font-semibold text-gray-900">
            Account Information
          </h3>

        
            <div className="relative mx-auto h-24 w-24 flex-shrink-0 overflow-visible sm:mx-0 sm:h-28 sm:w-28 mb-6">
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-blue-50 shadow-sm">
                <Image
                  src={profileImage}
                  alt="Dr. Runa Pradhan"
                  fill
                  unoptimized={profileImage.startsWith("blob:")}
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              <button
                type="button"
                aria-label="Upload profile photo"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#2563eb] text-white shadow-md transition-colors hover:bg-blue-700"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>

            
 

          <div className="space-y-3">
            <div>
              <label className={labelClassName}>Full Name:</label>
              <input
                className={inputClassName}
                placeholder="Dr. Runa Pradhan NP"
              />
            </div>

            <div>
              <label className={labelClassName}>Role/Title</label>
              <input
                className={inputClassName}
                placeholder="Dr. Runa Pradhan NP"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className={labelClassName}>Email</label>
                <input
                  type="email"
                  className={inputClassName}
                  placeholder="runa.pradhannp@gmail.com"
                />
              </div>
              <div>
                <label className={labelClassName}>Contact Number</label>
                <input
                  className={inputClassName}
                  placeholder="+1 234 567890"
                />
              </div>
            </div>

            <div>
              <label className={labelClassName}>Office</label>
              <input className={inputClassName} placeholder="Colorado Springs" />
            </div>

            <div>
              <label className={labelClassName}>Address</label>
              <input
                className={inputClassName}
                placeholder="1625 Medical Center Point, Suite 130"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className={labelClassName}>City</label>
                <input className={inputClassName} placeholder="Colorado Springs" />
              </div>
              <div>
                <label className={labelClassName}>State</label>
                <input className={inputClassName} placeholder="CO" />
              </div>
              <div>
                <label className={labelClassName}>Zip</label>
                <input className={inputClassName} placeholder="80907" />
              </div>
            </div>

            <div>
              <label className={labelClassName}>About</label>
              <textarea
                rows={5}
                className="w-full resize-none rounded-lg border border-transparent bg-[#f0f0f0] px-3 py-3 text-xs leading-relaxed text-gray-700 outline-none transition-colors focus:border-blue-300 focus:bg-white"
                placeholder="At the forefront of the UAE's construction revolution, Alpha Build Construction is the digital hub for builders, designers, and visionaries. With over 25 years of experience, we've established ourselves as a leading manufacturer, supplier, and contractor specializing in premium building materials and construction services."
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-5 rounded-full bg-[#2563eb] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Save Profile Changes
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <LockKeyhole className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Password Management
              </h3>
              <p className="text-xs text-gray-500">
                Update passwords for admin and other roles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div>
              <label className={labelClassName}>New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={`${inputClassName} pr-10`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  aria-pressed={showNewPassword}
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                >
                  {showNewPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClassName}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`${inputClassName} pr-10`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  aria-pressed={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-4">
            <p className="mb-2 text-xs font-semibold text-amber-700">
              Password Requirements:
            </p>
            <ul className="space-y-1 text-xs leading-relaxed text-amber-700">
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div>

          <button
            type="button"
            className="mt-5 rounded-full bg-[#2563eb] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Notification Settings
              </h3>
              <p className="text-xs text-gray-500">
                Manage your notification preferences
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-gray-900">
                Email Notifications
              </p>
              <p className="text-xs text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <button
              type="button"
              aria-pressed={emailNotifications}
              onClick={() => setEmailNotifications((value) => !value)}
              className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                emailNotifications ? "bg-[#2563eb]" : "bg-gray-300"
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  emailNotifications ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            className="mt-5 rounded-full bg-[#2563eb] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </section>
  );
}
