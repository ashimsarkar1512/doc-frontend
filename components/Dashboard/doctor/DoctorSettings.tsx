"use client";

import {
  useChangePasswordMutation,
  useGetCommunicationPreferencesQuery,
  useGetCurrentUserQuery,
  useGetSessionsQuery,
  useToggleMfaMutation,
  useUpdateCommunicationPreferencesMutation,
  useUpdateProfileMutation,
  useUploadAttachmentMutation,
} from "@/Redux/api/authApi";
import {
  Camera,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Laptop,
  LockKeyhole,
  MessageSquare,
  Shield,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import type { ChangeEvent } from "react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const inputClassName =
  "h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

const labelClassName = "mb-2 block text-sm font-semibold text-gray-900";

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
      relative inline-flex h-8 w-14
      items-center
      rounded-full
      transition-colors duration-300
      ${enabled ? "bg-[#2563eb]" : "bg-gray-200"}
    `}
  >
    <span
      className={`
        inline-block h-6 w-6
        transform rounded-full
        bg-white
        shadow
        transition-all duration-300 ease-in-out
        ${enabled ? "translate-x-7" : "translate-x-1"}
      `}
    />
  </button>
);

export default function DoctorSettings() {
  const { data: currentUserData, refetch } = useGetCurrentUserQuery();

console.log(currentUserData)



  const user = currentUserData?.data;

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [uploadAttachment, { isLoading: isUploadingImage }] =
    useUploadAttachmentMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [toggleMfa, { isLoading: isTogglingMfa }] = useToggleMfaMutation();
  const { data: preferencesData } = useGetCommunicationPreferencesQuery();
  const [updatePreferences, { isLoading: isUpdatingPreferences }] =
    useUpdateCommunicationPreferencesMutation();
  const { data: sessionsData } = useGetSessionsQuery();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarId, setAvatarId] = useState<string | undefined>();
  const [profileImage, setProfileImage] = useState("/doctor/profile-doc.png");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // MFA state
  const [twoFactorVerification, setTwoFactorVerification] = useState(true);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullName(user.profile?.name || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(user.profile?.title || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSpecialty(user.profile?.specialty || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOfficeLocation(user.profile?.officeLocation || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress(user.profile?.address || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCity(user.profile?.city || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(user.profile?.state || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setZip(user.profile?.zipCode || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBio(user.profile?.bio || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhone(user.phone || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarId(user.profile?.avatarId);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (user.profile?.avatar) {
        setProfileImage(user.profile.avatar);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTwoFactorVerification(user.mfaEnabled);
    }
  }, [user]);

  useEffect(() => {
    if (preferencesData?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmailNotifications(preferencesData.data.emailNotifications);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSmsNotifications(preferencesData.data.smsNotifications);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPushNotifications(preferencesData.data.pushNotifications);
    }
  }, [preferencesData]);

  const handleProfileImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadAttachment(formData).unwrap();
      setAvatarId(result.data.id);
      const nextImage = URL.createObjectURL(file);
      setProfileImage(nextImage);
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        avatarId,
        name: fullName,
        phone,
        bio,
        title,
        specialty,
        officeLocation,
        address,
        city,
        state,
        zipCode: zip,
      }).unwrap();
      toast.success("Profile updated successfully");
      refetch();
    } catch (error: any) {
      if (
        error?.data?.message?.toLowerCase().includes("phone") ||
        error?.status === 409
      ) {
        toast.error(
          "this phone number already use please use another phone number"
        );
      } else {
        toast.error(error?.data?.message || "Failed to update profile");
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const handleToggleMfa = async () => {
    try {
      await toggleMfa().unwrap();
      setTwoFactorVerification(!twoFactorVerification);
      toast.success("2FA setting updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update 2FA setting");
    }
  };

  const handleSavePreferences = async () => {
    try {
      await updatePreferences({
        emailNotifications,
        smsNotifications,
        pushNotifications,
      }).unwrap();
      toast.success("Preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  return (
    <section className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and preferences
        </p>
      </div>

      {/* Account Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">
            Account Information
          </h2>
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
                alt="Profile"
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
              disabled={isUploadingImage}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#2563eb] text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
            />
          </div>

          <div>
            <label className={labelClassName}>Role/Title</label>
            <input
              className={inputClassName}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Role/Title"
            />
          </div>

          <div>
            <label className={labelClassName}>Specialty</label>
            <input
              className={inputClassName}
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Specialty"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>Email</label>
              <input
                type="email"
                className={inputClassName}
                value={user?.email || ""}
                disabled
                placeholder="Email"
              />
            </div>
            <div>
              <label className={labelClassName}>Contact Number</label>
              <input
                className={inputClassName}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contact Number"
              />
            </div>
          </div>

          <div>
            <label className={labelClassName}>Office</label>
            <input
              className={inputClassName}
              value={officeLocation}
              onChange={(e) => setOfficeLocation(e.target.value)}
              placeholder="Office"
            />
          </div>

          <div>
            <label className={labelClassName}>Address</label>
            <input
              className={inputClassName}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClassName}>City</label>
              <input
                className={inputClassName}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <label className={labelClassName}>State</label>
              <input
                className={inputClassName}
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
              />
            </div>
            <div>
              <label className={labelClassName}>Zip</label>
              <input
                className={inputClassName}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Zip"
              />
            </div>
          </div>

          <div>
            <label className={labelClassName}>About</label>
            <textarea
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="About"
            />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isUpdatingProfile || isUploadingImage}
          className="mt-6 rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isUpdatingProfile ? "Saving..." : "Save Profile Changes"}
        </button>
      </div>

      {/* Password Management */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Password Management
            </h2>
            <p className="text-sm text-gray-500">Update your password</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClassName}>Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className={`${inputClassName} pr-10`}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={`${inputClassName} pr-10`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
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

        <button
          onClick={handleUpdatePassword}
          disabled={isChangingPassword}
          className="mt-6 rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isChangingPassword ? "Updating..." : "Update Password"}
        </button>
      </div>

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
            <p className="font-medium text-gray-900">2 Step Verification</p>
            <p className="text-sm text-gray-500">
              {twoFactorVerification ? "Enabled" : "Disabled"}
            </p>
          </div>
          <ToggleSwitch
            enabled={twoFactorVerification}
            onChange={handleToggleMfa}
          />
        </div>

        {/* Device Sessions */}
        <div className="rounded-xl border border-[#F1D38A] bg-[#FFFBEF] p-4">
          <h3 className="mb-4 font-semibold text-[#C46A0A]">
            Your Device & active sessions
          </h3>

          {sessionsData?.data?.map((device, idx) => {
            const isDesktop = device.deviceName.toLowerCase().includes("windows") || device.deviceName.toLowerCase().includes("mac") || device.deviceName.toLowerCase().includes("desktop");
            return (
            <details
              key={idx}
              className="group mb-3 rounded-lg border border-[#F1D38A] bg-[#FFFBEF] p-4"
              open={idx === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-3">
                  {isDesktop ? (
                    <Laptop className="h-5 w-5 text-[#C46A0A]" />
                  ) : (
                    <Smartphone className="h-5 w-5 text-[#C46A0A]" />
                  )}
                  <span className="font-medium text-[#A95600]">
                    {device.deviceName}
                    {device.isActiveNow ? " - Active now" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#C46A0A]">
                  {device.sessionCount} sessions on {device.deviceName}
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </div>
              </summary>
              <div className="mt-4 grid grid-cols-3 gap-y-4 text-sm text-[#A95600] border-t border-[#F1D38A]/50 pt-4">
                {device.sessions.map((session, sIdx) => {
                  const d = new Date(session.lastLogin);
                  const formattedDate = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()} - ${d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}`;
                  
                  return (
                  <React.Fragment key={`${idx}-${sIdx}`}>
                    <div className="flex items-center gap-2">
                      <p>Last login:</p>
                      <p>{formattedDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p>IP Address:</p>
                      <p>{session.ipAddress}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p>Session Due:</p>
                      <p>{session.sessionDue}</p>
                    </div>
                  </React.Fragment>
                )})}
              </div>
            </details>
          )})}
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Communication Preferences
            </h2>
            <p className="text-sm text-gray-500">
              Manage your communication preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <ToggleSwitch
              enabled={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">SMS Notifications</p>
              <p className="text-xs text-gray-500">
                Receive notifications via SMS
              </p>
            </div>
            <ToggleSwitch
              enabled={smsNotifications}
              onChange={() => setSmsNotifications(!smsNotifications)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Push Notifications</p>
              <p className="text-xs text-gray-500">
                Receive push notifications
              </p>
            </div>
            <ToggleSwitch
              enabled={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
            />
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          disabled={isUpdatingPreferences}
          className="mt-6 rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isUpdatingPreferences ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </section>
  );
}
