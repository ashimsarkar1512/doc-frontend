import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export function AuthChoiceForm({ authChoice, setAuthChoice }: any) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <p style={{ color: "#2B2922", fontFamily: "Quicksand, sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: "150%" }} className="mb-1">
        Almost there! Do you have any account?
      </p>
      <p style={{ color: "#2B2922", fontFamily: "Quicksand, sans-serif", fontSize: "20px", fontWeight: 500, lineHeight: "150%" }} className="mb-5">
        Login or create an account to submit the assessment for
        approval
      </p>
      <div className="flex flex-col gap-3">
        {[
          "Yes, I already have an account",
          "No, I don't have an account. Create one.",
        ].map((option) => {
          const isSelected = authChoice === option;
          return (
            <button
              key={option}
              onClick={() => setAuthChoice(option)}
              className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${
                isSelected
                  ? "bg-white border-blue-500 shadow-sm"
                  : "bg-white border-transparent hover:border-gray-300"
              }`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${
                  isSelected
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-400 bg-gray-300"
                }`}
              >
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </span>
              <span style={{ color: "#2B2922", fontFamily: "Quicksand, sans-serif", fontSize: "20px", fontWeight: 500, lineHeight: "150%" }}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LoginForm({ loginEmail, setLoginEmail, loginPassword, setLoginPassword, showLoginPassword, setShowLoginPassword }: any) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <h2 className="text-gray-900 text-[20px] font-bold mb-6 leading-snug">
        Login account
      </h2>
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-gray-800 text-[15px] font-medium mb-2">
            Email:
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-gray-800 text-[15px] font-medium mb-2">
            Password:
          </label>
          <div className="relative">
            <input
              type={showLoginPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-4 py-3.5 pr-12 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword((p: boolean) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
              tabIndex={-1}
            >
              {showLoginPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterForm({ registerEmail, setRegisterEmail, registerPhone, setRegisterPhone, registerPassword, setRegisterPassword, registerConfirm, setRegisterConfirm, showRegisterPassword, setShowRegisterPassword, showRegisterConfirm, setShowRegisterConfirm }: any) {
  const isPasswordFormatValid = (pw: string) => {
    if (!pw) return true;
    return (
      pw.length >= 8 &&
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[\W_]/.test(pw)
    );
  };
  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <h2 className="text-gray-900 text-[20px] font-bold mb-6 leading-snug">
        Register a new account
      </h2>
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-gray-800 text-[15px] font-medium mb-2">
            Email:
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-gray-800 text-[15px] font-medium mb-2">
            Phone number:
          </label>
          <PhoneInput
            defaultCountry="us"
            value={registerPhone}
            onChange={(phone) => setRegisterPhone(phone)}
            style={{ width: "100%" }}
            inputStyle={{
              width: "100%",
              height: "52px",
              fontSize: "15px",
              backgroundColor: "#e5e7eb",
              border: "1px solid transparent",
              borderRadius: "0.75rem",
              color: "#1f2937",
              paddingLeft: "8px",
            }}
            countrySelectorStyleProps={{
              buttonStyle: {
                height: "52px",
                backgroundColor: "#e5e7eb",
                border: "1px solid transparent",
                borderRadius: "0.75rem 0 0 0.75rem",
                paddingLeft: "10px",
                paddingRight: "8px",
              },
            }}
          />
        </div>
        <div>
          <label className="block text-gray-800 text-[15px] font-medium mb-2">
            Password:
          </label>
          <div className="relative">
            <input
              type={showRegisterPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              className="w-full px-4 py-3.5 pr-12 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
            />
            <button
              type="button"
              onClick={() => setShowRegisterPassword((p: boolean) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
              tabIndex={-1}
            >
              {showRegisterPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {!isPasswordFormatValid(registerPassword) && (
            <p className="text-red-500 text-[13px] mt-2 font-medium">
              Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a special character.
            </p>
          )}
        </div>
        <div>
          <label className="block text-gray-800 text-[15px] font-medium mb-2">
            Confirm Password:
          </label>
          <div className="relative">
            <input
              type={showRegisterConfirm ? "text" : "password"}
              placeholder="••••••••••"
              value={registerConfirm}
              onChange={(e) => setRegisterConfirm(e.target.value)}
              className="w-full px-4 py-3.5 pr-12 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
            />
            <button
              type="button"
              onClick={() => setShowRegisterConfirm((p: boolean) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
              tabIndex={-1}
            >
              {showRegisterConfirm ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {registerConfirm && registerPassword !== registerConfirm && (
            <p className="text-red-500 text-[13px] mt-2 font-medium">
              Passwords do not match.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function OtpChannelPicker({ otpChannel, setOtpChannel, maskedEmail, maskedPhone, activePhone }: any) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <h2 className="text-gray-900 text-[20px] font-bold mb-2 leading-snug">
        Receive OTP Code
      </h2>
      <p className="text-gray-500 text-[14px] mb-5">
        Choose the option to receive the code
      </p>
      <div className="flex flex-col gap-3">
        {[
          {
            key: "EMAIL",
            label: "Email: " + maskedEmail,
            visible: true,
          },
          {
            key: "PHONE",
            label: "Phone: " + maskedPhone,
            visible: !!activePhone,
          },
        ]
          .filter((opt) => opt.visible)
          .map(({ key, label }) => {
            const isSelected = otpChannel === key;
            return (
              <button
                key={key}
                onClick={() => setOtpChannel(key)}
                className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${
                  isSelected
                    ? "bg-white border-blue-500 shadow-sm"
                    : "bg-white border-transparent hover:border-gray-300"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${
                    isSelected
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-400 bg-gray-300"
                  }`}
                >
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </span>
                <span className="text-gray-800 text-[15px] font-medium">
                  {label}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

export function OtpVerifyForm({ otpDigits, handleOtpChange, handleOtpKeyDown, handleOtpPaste, maskedEmail, handleResendOtp, isResending, otpRefs }: any) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <h2 className="text-gray-900 text-[20px] font-bold mb-3 leading-snug">
        Verify Authentication
      </h2>
      <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
        Enter the 6 digit authentication code we&apos;ve sent to{" "}
        <span className="font-medium">{maskedEmail}</span>
      </p>
      <div className="grid grid-cols-6 gap-2 mb-6">
        {otpDigits.map((digit: string, index: number) => (
          <input
            key={index}
            ref={(el) => {
              if (otpRefs.current) {
                otpRefs.current[index] = el;
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={handleOtpPaste}
            className="w-full h-12 rounded-xl bg-gray-300 border-2 border-transparent text-center text-[18px] font-semibold text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-150 caret-blue-600"
            placeholder="–"
          />
        ))}
      </div>
      <p className="text-gray-600 text-[14px]">
        Didn&apos;t receive the code?{" "}
        <button
          onClick={handleResendOtp}
          disabled={isResending}
          className="text-gray-800 font-semibold underline underline-offset-2 hover:text-blue-600 transition-colors duration-150"
        >
          Resend
        </button>
      </p>
    </div>
  );
}

export function ShippingAddressForm({ shippingAddress, setShippingAddress }: any) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <h2 className="text-gray-900 text-[20px] font-bold mb-2 leading-snug">
        Almost there! Just a few more details.
      </h2>
      <p className="text-gray-600 text-[15px] mb-5">
        Your account has been created and you are logged in.
      </p>
      <div className="rounded-xl bg-white p-4 flex flex-col gap-4">
        <p className="text-gray-800 text-[15px] font-semibold">
          Shipping address
        </p>
        <div>
          <label className="block text-gray-700 text-[14px] mb-1">
            Address line 1
          </label>
          <input
            type="text"
            placeholder="4140 Parker Rd. Allentown"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress((p: any) => ({
                ...p,
                address: e.target.value,
              }))
            }
            className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "City:",
              placeholder: "Allentown",
              key: "city" as const,
            },
            {
              label: "State:",
              placeholder: "NM",
              key: "state" as const,
            },
            {
              label: "Zip:",
              placeholder: "31134",
              key: "zip" as const,
            },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-gray-700 text-[14px] mb-1">
                {field.label}
              </label>
              <input
                type="text"
                inputMode={field.key === "zip" ? "numeric" : "text"}
                placeholder={field.placeholder}
                value={shippingAddress[field.key]}
                onChange={(e) => {
                  let val = e.target.value;
                  if (field.key === "zip") {
                    val = val.replace(/\D/g, "");
                  }
                  setShippingAddress((p: any) => ({
                    ...p,
                    [field.key]: val,
                  }));
                }}
                className="w-full px-3 py-3 rounded-lg bg-gray-200 border border-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[14px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
