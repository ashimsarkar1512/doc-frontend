"use client";

import {
  useChangePasswordMutation,
  useGetCommunicationPreferencesQuery,
  useGetCurrentUserQuery,
  useUpdateCommunicationPreferencesMutation,
  useUpdateProfileMutation,
  useUploadAttachmentMutation,
} from "@/Redux/api/authApi";
import { Camera, KeyRound, Mail, ShieldCheck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function SettingsCenter() {
  const { data: currentUserData, refetch } = useGetCurrentUserQuery();
  const user = currentUserData?.data;

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [uploadAttachment, { isLoading: isUploadingImage }] =
    useUploadAttachmentMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const { data: preferencesData } = useGetCommunicationPreferencesQuery();
  const [updatePreferences, { isLoading: isUpdatingPreferences }] =
    useUpdateCommunicationPreferencesMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [avatarId, setAvatarId] = useState<string | undefined>();

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

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
      setAvatarId(user.profile?.avatarId);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadAttachment(formData).unwrap();
      setAvatarId(result.data.id);
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
        bio,
        address,
        city,
        state,
        zipCode: zip,
      }).unwrap();
      toast.success("Profile updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update profile");
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
        <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-5">
          <div className="border-b border-gray-50 pb-3">
            <h4 className="text-base font-bold text-gray-900 leading-tight">
              Account Information
            </h4>
            <p className="text-[11px] text-gray-400 mt-0.5 font-light">
              Manage your profile details and bio information.
            </p>
          </div>

          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#2e5e54] text-white font-bold text-2xl flex items-center justify-center border-2 border-white shadow-sm group cursor-pointer">
              <span>{fullName?.charAt(0)?.toUpperCase() || "U"}</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-800">
                Upload New Profile Picture
              </span>
              <span className="text-[10px] text-gray-400 font-light mt-0.5">
                JPG, PNG or GIF up to 2MB.
              </span>
            </div>
          </div>

          {/* Core Inputs Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-gray-100 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Contact Number
              </label>
              <input
                type="text"
                value={user?.phone || ""}
                disabled
                className="w-full bg-gray-100 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Zip
              </label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              About Bio
            </label>
            <textarea
              value={bio}
              rows={3}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-gray-50 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400 resize-none font-light leading-relaxed"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isUpdatingProfile || isUploadingImage}
            className="self-start px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
          >
            {isUpdatingProfile ? "Saving..." : "Save Profile Changes"}
          </button>
        </div>

        {/* 2. Password Management */}
        <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-5">
          <div className="border-b border-gray-50 pb-3 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-rose-500" />
            <div>
              <h4 className="text-base font-bold text-gray-900 leading-tight">
                Password Management
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5 font-light">
                Update passwords for security guidelines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-[12px] px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password Requirements Container */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>Password Requirements:</span>
            </span>
            <ul className="text-[11px] text-amber-700/80 space-y-1 pl-1 list-disc list-inside font-light">
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={isChangingPassword}
            className="self-start px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>

        {/* 3. Notification Settings */}
        <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-5">
          <div className="border-b border-gray-50 pb-3 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <div>
              <h4 className="text-base font-bold text-gray-900 leading-tight">
                Notification Settings
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5 font-light">
                Manage your communication preferences.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 pl-1">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-gray-800">
                  Email Notifications
                </span>
                <span className="text-[10px] text-gray-400 font-light">
                  Receive real-time notifications via email.
                </span>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-11 h-6 rounded-full transition-all duration-200 focus:outline-none flex items-center p-1 ${
                  emailNotifications ? "bg-[#2563eb]" : "bg-gray-250"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transition-all duration-200 transform ${
                    emailNotifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2 pl-1">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-gray-800">
                  SMS Notifications
                </span>
                <span className="text-[10px] text-gray-400 font-light">
                  Receive real-time notifications via SMS.
                </span>
              </div>
              <button
                onClick={() => setSmsNotifications(!smsNotifications)}
                className={`w-11 h-6 rounded-full transition-all duration-200 focus:outline-none flex items-center p-1 ${
                  smsNotifications ? "bg-[#2563eb]" : "bg-gray-250"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transition-all duration-200 transform ${
                    smsNotifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2 pl-1">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-gray-800">
                  Push Notifications
                </span>
                <span className="text-[10px] text-gray-400 font-light">
                  Receive real-time push notifications.
                </span>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-11 h-6 rounded-full transition-all duration-200 focus:outline-none flex items-center p-1 ${
                  pushNotifications ? "bg-[#2563eb]" : "bg-gray-250"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transition-all duration-200 transform ${
                    pushNotifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={isUpdatingPreferences}
            className="self-start px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
          >
            {isUpdatingPreferences ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
