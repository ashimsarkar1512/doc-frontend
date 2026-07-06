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
  Lock,
  Mail,
  ShieldCheck,
  Smartphone,
  Eye,
  EyeOff,
  ChevronRight,
  Laptop
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PaymentCardManagement from "./PaymentCardManagement";

export default function SettingsCenter() {
  const { data: currentUserData, refetch } = useGetCurrentUserQuery();
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

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarId, setAvatarId] = useState<string | undefined>();

  // Password form state
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
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullName(user.profile?.name || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBio(user.profile?.bio || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress(user.profile?.address || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCity(user.profile?.city || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(user.profile?.state || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setZip(user.profile?.zipCode || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhone(user.phone || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarId(user.profile?.avatarId);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTwoFactorAuth(user.mfaEnabled);
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

  const getDisplayName = () => {
    if (user?.profile?.name) return user.profile.name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("context", "PROFILE_PICTURE");
    formData.append("files", file);

    try {
      const result = await uploadAttachment(formData).unwrap();
      const newAvatarId = result.data.id;
      setAvatarId(newAvatarId);
      // Immediately save avatarId to profile so it persists
      await updateProfile({ avatarId: newAvatarId }).unwrap();
      toast.success("Profile picture updated");
      refetch();
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
          "this phone number already use please use another phone number",
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
      setTwoFactorAuth(!twoFactorAuth);
      toast.success("Two-factor authentication updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update two-factor authentication");
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
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200 mb-12">
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 leading-none">
          Settings
        </h3>
      </div>

      {/* Main Stack */}
      <div className="flex flex-col gap-6">
        {/* 1. Account Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
          <div className="mb-6 flex items-center gap-3">
            <h4 className="text-lg font-bold text-gray-900">
              Account Information
            </h4>
          </div>

          <div className="mb-6">
            <p className="mb-4 text-sm font-semibold text-gray-700">
              Profile Picture
            </p>
            <div className="relative inline-block">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-gray-100 bg-gray-50 shadow-sm">
                {user?.profile?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profile.avatar}
                    alt={getDisplayName()}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#2e5e54] text-3xl font-bold text-white">
                    {getInitials()}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage || isUpdatingProfile}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#2563eb] text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
              >
                {isUploadingImage ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Core Inputs Form */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="h-10 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Zip
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                About
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isUpdatingProfile || isUploadingImage}
            className="mt-6 rounded-full  bg-[#2563eb] w-fit px-3 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdatingProfile ? "Saving..." : "Save Profile Changes"}
          </button>
        </div>

        {/* 2. Password Management */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                Password Management
              </h4>
              <p className="text-sm text-gray-500">Update your password</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-[#f0f0f0] px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
            <p className="mb-3 flex items-center gap-2 text-[20px] font-semibold text-[#C46A0A]">
              <span>⚠️</span>
              Password Requirements:
            </p>
            <ul className="space-y-2 text-[18px] text-yellow-700">
              <li>• At least 8 characters long</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Include at least one number</li>
              <li>• Include at least one special character</li>
            </ul>
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={isChangingPassword}
            className="mt-6 rounded-full bg-[#2563eb] w-fit px-3 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>

        {/* Payment Method */}
        <PaymentCardManagement />

        {/* 3. Security & Device */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Security & Device
              </h4>
              <p className="text-sm text-gray-500">
                The security checkup of your account
              </p>
            </div>
          </div>

          {/* 2 Step Verification */}
          <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4">
            <div>
              <p className="font-medium text-gray-900">Two-step Verification</p>
              <p className="text-sm text-gray-500">
                {twoFactorAuth
                  ? "Two-factor authentication is enabled"
                  : "Two-factor authentication is disabled"}
              </p>
            </div>
            <button
              onClick={handleToggleMfa}
              disabled={isTogglingMfa}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 disabled:opacity-50 ${twoFactorAuth ? "bg-[#2563eb]" : "bg-gray-200"
                }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-300 ease-in-out ${twoFactorAuth ? "translate-x-7" : "translate-x-1"
                  }`}
              />
            </button>
          </div>

          {/* Device Sessions */}
          {sessionsData?.data && sessionsData.data.length > 0 && (
            <div className="rounded-xl border border-[#F1D38A] bg-[#FFFBEF] p-4">
              <h3 className="mb-4 font-semibold text-[#C46A0A]">
                Your Device & active sessions
              </h3>
              {sessionsData.data.map((device, idx) => {
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
                        {device.sessionCount} sessions on
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
                        )
                      })}
                    </div>
                  </details>
                )
              })}
            </div>
          )}
        </div>

        {/* 4. Communication Preferences */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                Communication Preferences
              </h4>
              <p className="text-sm text-gray-500">
                Manage your communication preferences
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${emailNotifications ? "bg-[#2563eb]" : "bg-gray-200"
                  }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-300 ease-in-out ${emailNotifications ? "translate-x-7" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">SMS Notifications</p>
                <p className="text-xs text-gray-500">
                  Receive notifications via SMS
                </p>
              </div>
              <button
                onClick={() => setSmsNotifications(!smsNotifications)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${smsNotifications ? "bg-[#2563eb]" : "bg-gray-200"
                  }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-300 ease-in-out ${smsNotifications ? "translate-x-7" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  Push Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Receive push notifications
                </p>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${pushNotifications ? "bg-[#2563eb]" : "bg-gray-200"
                  }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-300 ease-in-out ${pushNotifications ? "translate-x-7" : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={isUpdatingPreferences}
            className="mt-6 rounded-full bg-[#2563eb] w-fit px-3 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdatingPreferences ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
