"use client";

import Image from "next/image";
import { Bell, Camera, Eye, EyeOff, LockKeyhole, Shield, MessageSquare, Smartphone, Laptop, ChevronRight, ChevronDown } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

const inputClassName =
  "h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

const labelClassName = "mb-2 block text-sm font-semibold text-gray-900";

export default function DoctorSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactorVerification, setTwoFactorVerification] = useState(true);
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

const ToggleSwitch = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) => (
  <button
    type="button"
    onClick={onChange}
    className={`
      relative inline-flex h-6 w-12
      items-center
      rounded-full
      border border-[#2956D8]
      bg-[#D7DDF0]
      transition-colors duration-300
    `}
  >
    <span
      className={`
        inline-block h-5 w-5
        transform rounded-full
        bg-[#2956D8]
        transition-all duration-300 ease-in-out
        ${enabled ? "translate-x-6" : "translate-x-1"}
      `}
    />
  </button>
);

  return (
    <section className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Account Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">

          <h2 className="text-lg font-bold text-gray-900">Account Information</h2>
        </div>

        {/* Profile Picture */}
        <div className="mb-6">
          <p className="mb-4 text-sm font-semibold text-gray-700">
            Profile Picture
          </p>

          <div className="relative inline-block">
            {/* Profile Image */}
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-gray-100 bg-gray-50 shadow-sm">
              <Image
                src={profileImage}
                alt="Dr. Runa Pradhan"
                fill
                unoptimized={profileImage.startsWith("blob:")}
                sizes="112px"
                className="object-cover"
              />
            </div>

            {/* Camera Icon */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#2563eb] text-white shadow-md transition hover:bg-blue-700"
            >
              <Camera className="h-4 w-4" />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleProfileImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClassName}>Full Name</label>
            <input
              className={inputClassName}
              defaultValue="Dr. Runa Pradhan NP"
              placeholder="Full Name"
            />
          </div>

          <div>
            <label className={labelClassName}>Role/Title</label>
            <input
              className={inputClassName}
              defaultValue="Dr. Runa Pradhan NP"
              placeholder="Role/Title"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>Email</label>
              <input
                type="email"
                className={inputClassName}
                defaultValue="runa.pradhannp@gmail.com"
                placeholder="Email"
              />
            </div>
            <div>
              <label className={labelClassName}>Contact Number</label>
              <input
                className={inputClassName}
                defaultValue="+1 234 56780"
                placeholder="Contact Number"
              />
            </div>
          </div>

          <div>
            <label className={labelClassName}>Office</label>
            <input
              className={inputClassName}
              defaultValue="Colorado Springs"
              placeholder="Office"
            />
          </div>

          <div>
            <label className={labelClassName}>Address</label>
            <input
              className={inputClassName}
              defaultValue="1625 Medical Center Point, Suite 130"
              placeholder="Address"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClassName}>City</label>
              <input
                className={inputClassName}
                defaultValue="Colorado Springs"
                placeholder="City"
              />
            </div>
            <div>
              <label className={labelClassName}>State</label>
              <input
                className={inputClassName}
                defaultValue="CO"
                placeholder="State"
              />
            </div>
            <div>
              <label className={labelClassName}>Zip</label>
              <input
                className={inputClassName}
                defaultValue="80907"
                placeholder="Zip"
              />
            </div>
          </div>

          <div>
            <label className={labelClassName}>About</label>
            <textarea
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              defaultValue="At the forefront of the UAE's construction evolution, AlphaKaid Construction is the digital hub for builders, designers, and visionaries. With over 25 years of experience, we've established ourselves as a leading manufacturer, supplier, and contractor specializing in premium building materials and construction services."
              placeholder="About"
            />
          </div>
        </div>

        <button className="mt-6 rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Save Profile Changes
        </button>
      </div>

      {/* Password Management */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Password Management</h2>
            <p className="text-sm text-gray-500">Update passwords for admin and other roles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-yellow-700">
            <span>⚠️</span>
            Password Requirements:
          </p>
          <ul className="space-y-2 text-xs text-yellow-700">
            <li>• At least 8 characters long</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Include at least one number</li>
            <li>• Include at least one special character</li>
          </ul>
        </div>

        <button className="mt-6 rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Update Password
        </button>
      </div>

      {/* Security & Device */}
 {/* Security & Device */}
<div className="rounded-xl border border-gray-200 bg-white p-6">
  <div className="mb-5 flex items-start gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <Shield className="h-5 w-5" />
    </div>

    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Security & Device
      </h2>
      <p className="text-sm text-gray-500">
        The security checkup of your account
      </p>
    </div>
  </div>

  {/* 2 Step Verification */}
  <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4">
    <div>
      <p className="font-medium text-gray-900">
        2 Step Verification
      </p>

      <p className="text-sm text-gray-500">
        Activated on phone 123********89 since 20 May, 2026
      </p>
    </div>

    <ToggleSwitch
      enabled={twoFactorVerification}
      onChange={() =>
        setTwoFactorVerification(!twoFactorVerification)
      }
    />
  </div>

  {/* Device Sessions */}
  <div className="rounded-xl border border-[#F1D38A] bg-[#FFFBEF] p-4">
    <h3 className="mb-4 font-semibold text-[#C46A0A]">
      Your Device & active sessions
    </h3>

    {/* Windows */}
    <div className="mb-3 rounded-lg border border-[#F1D38A] bg-[#FFFBEF] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Laptop className="h-5 w-5 text-[#C46A0A]" />

          <span className="font-medium text-[#A95600]">
            Windows device - Active now
          </span>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 text-sm text-[#C46A0A]"
        >
          2 sessions on Windows computer(s)
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-y-4 text-sm text-[#A95600]">
        <div className="flex items-center gap-2">
          <p>Last login:</p>
          <p>May 27 - 09:14 am</p>
        </div>

        <div className="flex items-center gap-2">
          <p>IP Address:</p>
          <p>192.168.1.45</p>
        </div>

        <div className="flex items-center gap-2">
          <p>Session Due:</p>
          <p>12m 34s</p>
        </div>

        <div className="flex items-center gap-2">
          <p>Last login:</p>
          <p>May 25 - 11:24 pm</p>
        </div>

        <div className="flex items-center gap-2">
          <p>IP Address:</p>
          <p>192.168.0.43</p>
        </div>

        <div className="flex items-center gap-2">
          <p>Session Due:</p>
          <p>45m 34s</p>
        </div>
      </div>
    </div>

    {/* iOS */}
    <div className="rounded-lg border border-[#F1D38A] bg-[#FFFBEF] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="h-5 w-5 text-[#C46A0A]" />

          <span className="font-medium text-[#A95600]">
            iOS device
          </span>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 text-sm text-[#C46A0A]"
        >
          1 sessions on iOS iPhone(s)
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>

    <button className="mt-5 rounded-full bg-[#2956D7] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#2048bc]">
      Update Password
    </button>
  </div>
</div>

      {/* Communication Preferences */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Communication Preferences</h2>
            <p className="text-sm text-gray-500">Manage your communication preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive notifications via email</p>
            </div>
            <ToggleSwitch enabled={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">SMS Notifications</p>
              <p className="text-xs text-gray-500">Receive notifications via SMS</p>
            </div>
            <ToggleSwitch enabled={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Push Notifications</p>
              <p className="text-xs text-gray-500">Receive vo push notification</p>
            </div>
            <ToggleSwitch enabled={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
          </div>
        </div>

        <button className="mt-6 rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Save Settings
        </button>
      </div>
    </section>
  );
}
