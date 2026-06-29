"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import {
  ShieldCheck,
  ChevronDown,
  Trash2,
  Tag,
  CheckCircle,
  Loader2,
  ShoppingCart,
  CalendarDays,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {
  useGetMyCartQuery,
  useGetCartSummaryQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useCheckoutMutation,
} from "@/Redux/features/patient/assesmentcategory";
import {
  formatCardNumber,
  validateCardNumber,
  formatExpiry,
  validateExpiry,
  EXPIRY_MONTH_OPTIONS,
  getExpiryYearOptions,
  formatCVV,
  validateCVV,
  formatZip,
  validateZip,
  validatePhone,
  validateCardHolderName,
  stripNonDigits,
} from "@/utils/checkoutvalidation";

/* ──────────────────────────────────────────────────────────
   Small reusable field wrapper that shows an error message
   ────────────────────────────────────────────────────────── */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-red-500 text-[12px] mt-1.5">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
}

const inputBase =
  "w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 outline-none focus:bg-white border transition-colors";
const inputOk = "border-transparent focus:border-blue-500";
const inputErr = "border-red-400 focus:border-red-500 bg-red-50";

export default function CheckoutPage() {
  const router = useRouter();

  // ── Coupon state ──
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("submissionId");
    if (id) setSubmissionId(id);
  }, []);

  // ── API queries ──
  const { data: cartData, isLoading: cartLoading } = useGetMyCartQuery();
  
  const queryParams: { discountCode?: string; submissionId?: string } = {};
  if (couponApplied) queryParams.discountCode = couponInput.trim();
  if (submissionId) queryParams.submissionId = submissionId;
  const hasParams = Object.keys(queryParams).length > 0;

  const { data: summaryData, isFetching: summaryFetching, isError: summaryError } = useGetCartSummaryQuery(
    hasParams ? queryParams : undefined
  );

  useEffect(() => {
    if (summaryError && couponApplied) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCouponError("Invalid or expired coupon code.");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCouponApplied(false);
    }
  }, [summaryError, couponApplied]);

  // ── API mutations ──
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [checkout, { isLoading: isSubmitting }] = useCheckoutMutation();

  // ── Derived data ──
  const cartItems = cartData?.data?.items ?? [];
  const itemCount = cartData?.data?.totalItem ?? 0;
  const summary = summaryData?.data;

  // ── Local loading states for cart ──
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ── Checkout Form State ──
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    contactNumber: "", // stored in E.164 format, e.g. "+15551234567"
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: "CLOVER",
    cardHolderName: "",
    cardNumber: "",
    expiredDate: "",
    cvv: "",
  });

  const [complianceConfirmation, setComplianceConfirmation] = useState({
    agreedToTermsAndPrivacy: true,
    certifiedInfoAccurate: true,
    understoodFalseInfoConsequences: true,
    understoodRecommendationsBasis: true,
    understoodAdditionalInfoMayBeRequested: true,
  });

  const [recurring, setRecurring] = useState(true);

  // ── Field-level errors (only shown after the field has been touched / on submit) ──
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const setFieldError = (field: string, message: string) =>
    setErrors((e) => ({ ...e, [field]: message }));

  /* ── Expiry date picker (calendar-style month/year dropdown) ── */
  const [expiryPickerOpen, setExpiryPickerOpen] = useState(false);
  const expiryPickerRef = useRef<HTMLDivElement>(null);
  const yearOptions = getExpiryYearOptions();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        expiryPickerRef.current &&
        !expiryPickerRef.current.contains(e.target as Node)
      ) {
        setExpiryPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyExpiryFromPicker = (month: number, year: number) => {
    const mm = String(month).padStart(2, "0");
    const yy = String(year).slice(-2);
    const formatted = `${mm}/${yy}`;
    setPaymentInfo((p) => ({ ...p, expiredDate: formatted }));
    setFieldError("expiredDate", validateExpiry(formatted));
    markTouched("expiredDate");
    setExpiryPickerOpen(false);
  };

  /* ──────────────────────────────────────────────────────────
     Field change handlers — format as you type, validate live
     ────────────────────────────────────────────────────────── */

  const handleZipChange = (val: string) => {
    const formatted = formatZip(val);
    setShippingInfo((s) => ({ ...s, zip: formatted }));
    if (touched.zip) setFieldError("zip", validateZip(formatted));
  };

  const handlePhoneChange = (val: string | undefined) => {
    const value = val || "";
    setShippingInfo((s) => ({ ...s, contactNumber: value }));
    if (touched.contactNumber) setFieldError("contactNumber", validatePhone(value));
  };

  const handleCardHolderChange = (val: string) => {
    setPaymentInfo((p) => ({ ...p, cardHolderName: val }));
    if (touched.cardHolderName)
      setFieldError("cardHolderName", validateCardHolderName(val));
  };

  const handleCardNumberChange = (val: string) => {
    const formatted = formatCardNumber(val);
    setPaymentInfo((p) => ({ ...p, cardNumber: formatted }));
    if (touched.cardNumber) setFieldError("cardNumber", validateCardNumber(formatted));
  };

  const handleExpiryChange = (val: string) => {
    const formatted = formatExpiry(val);
    setPaymentInfo((p) => ({ ...p, expiredDate: formatted }));
    if (touched.expiredDate) setFieldError("expiredDate", validateExpiry(formatted));
  };

  const handleCVVChange = (val: string) => {
    const formatted = formatCVV(val);
    setPaymentInfo((p) => ({ ...p, cvv: formatted }));
    if (touched.cvv)
      setFieldError("cvv", validateCVV(formatted, stripNonDigits(paymentInfo.cardNumber).length));
  };

  /* ──────────────────────────────────────────────────────────
     Blur handlers — validate once the user leaves the field
     ────────────────────────────────────────────────────────── */

  const handleBlurValidate = (field: string) => {
    markTouched(field);
    switch (field) {
      case "fullName":
        setFieldError(
          "fullName",
          shippingInfo.fullName.trim() ? "" : "Full name is required."
        );
        break;
      case "contactNumber":
        setFieldError("contactNumber", validatePhone(shippingInfo.contactNumber));
        break;
      case "address":
        setFieldError(
          "address",
          shippingInfo.address.trim() ? "" : "Address is required."
        );
        break;
      case "city":
        setFieldError("city", shippingInfo.city.trim() ? "" : "City is required.");
        break;
      case "state":
        setFieldError("state", shippingInfo.state.trim() ? "" : "State is required.");
        break;
      case "zip":
        setFieldError("zip", validateZip(shippingInfo.zip));
        break;
      case "cardHolderName":
        setFieldError("cardHolderName", validateCardHolderName(paymentInfo.cardHolderName));
        break;
      case "cardNumber":
        setFieldError("cardNumber", validateCardNumber(paymentInfo.cardNumber));
        break;
      case "expiredDate":
        setFieldError("expiredDate", validateExpiry(paymentInfo.expiredDate));
        break;
      case "cvv":
        setFieldError(
          "cvv",
          validateCVV(paymentInfo.cvv, stripNonDigits(paymentInfo.cardNumber).length)
        );
        break;
    }
  };

  /* ──────────────────────────────────────────────────────────
     Cart handlers (unchanged behavior)
     ────────────────────────────────────────────────────────── */

  const handleRemove = async (itemId: string) => {
    setRemovingId(itemId);
    try {
      await removeFromCart(itemId).unwrap();
      toast.success("Item removed from cart");
    } catch (e: unknown) {
      toast.error((e as { data?: { message?: string } })?.data?.message || "Failed to remove item");
      console.error("Remove from cart failed:", e);
    } finally {
      setRemovingId(null);
    }
  };

  const handleQtyChange = async (
    itemId: string,
    currentQty: number,
    delta: number
  ) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    setUpdatingId(`${itemId}-${delta > 0 ? "inc" : "dec"}`);
    try {
      await updateCartItem({ id: itemId, quantity: newQty }).unwrap();
      toast.success("Cart updated");
    } catch (e: unknown) {
      toast.error((e as { data?: { message?: string } })?.data?.message || "Failed to update cart");
      console.error("Update cart failed:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    setCouponApplied(true);
    setCouponError("");
  };

  const formatServiceDuration = (sd?: string) => {
    if (!sd) return "—";
    return sd
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  /* ──────────────────────────────────────────────────────────
     Full-form validation on submit
     ────────────────────────────────────────────────────────── */

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {
      fullName: shippingInfo.fullName.trim() ? "" : "Full name is required.",
      contactNumber: validatePhone(shippingInfo.contactNumber),
      address: shippingInfo.address.trim() ? "" : "Address is required.",
      city: shippingInfo.city.trim() ? "" : "City is required.",
      state: shippingInfo.state.trim() ? "" : "State is required.",
      zip: validateZip(shippingInfo.zip),
      cardHolderName: validateCardHolderName(paymentInfo.cardHolderName),
      cardNumber: validateCardNumber(paymentInfo.cardNumber),
      expiredDate: validateExpiry(paymentInfo.expiredDate),
      cvv: validateCVV(paymentInfo.cvv, stripNonDigits(paymentInfo.cardNumber).length),
    };

    setErrors(newErrors);
    setTouched({
      fullName: true,
      contactNumber: true,
      address: true,
      city: true,
      state: true,
      zip: true,
      cardHolderName: true,
      cardNumber: true,
      expiredDate: true,
      cvv: true,
    });

    return Object.values(newErrors).every((msg) => !msg);
  };

  const handleSubmit = () => {
    if (!validateAll()) {
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }

    const submissionId = localStorage.getItem("submissionId");
    if (!submissionId) {
      toast.error("Valid assessment submission not found. Please complete the assessment.");
      return;
    }

    const checkoutPayload = {
      submissionId,
      shippingInfo,
      paymentInfo,
      complianceConfirmation,
      discountCode: couponApplied ? couponInput.trim() : undefined,
      isRecurring: recurring,
      billingCycle: summary?.serviceDuration || "MONTHLY",
    };

    localStorage.setItem("checkoutPayload", JSON.stringify(checkoutPayload));
    router.push("/previewdetails");
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar variant="dark" />

      <div className="pt-32 pb-16 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* LEFT: Checkout Form */}
          <div className="flex-1 min-w-0 w-full">
            <button
              onClick={() => router.back()}
              className="relative z-50 flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors text-[14px] font-medium mb-6 group w-fit cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            <h1 className="text-[26px] font-bold text-gray-900 mb-1">Checkout</h1>
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-gray-700 mb-8">
              Pay to checkout and submit for approval
            </h2>

            {/* Shipping Info */}
            <div className="mb-10">
              <h2 className="text-[18px] font-bold text-gray-900 mb-4">Shipping Info:</h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                    }
                    onBlur={() => handleBlurValidate("fullName")}
                    placeholder="e.g. John Doe"
                    className={`${inputBase} ${errors.fullName && touched.fullName ? inputErr : inputOk}`}
                  />
                  <FieldError message={touched.fullName ? errors.fullName : undefined} />
                </div>

                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                    Contact Number
                  </label>
                  {/* International phone input with built-in country selector + format validation */}
                  <div
                    className={`flex items-center w-full bg-[#F3F4F6] rounded-lg border transition-colors ${errors.contactNumber && touched.contactNumber
                        ? "border-red-400 bg-red-50"
                        : "border-transparent focus-within:border-blue-500 focus-within:bg-white"
                      }`}
                  >
                    <PhoneInput
                      defaultCountry="us"
                      value={shippingInfo.contactNumber}
                      onChange={(phone) => handlePhoneChange(phone)}
                      style={{ width: "100%" }}
                      inputStyle={{
                        width: "100%",
                        height: "46px",
                        fontSize: "14px",
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#374151",
                        paddingLeft: "8px",
                        outline: "none"
                      }}
                      countrySelectorStyleProps={{
                        buttonStyle: {
                          height: "46px",
                          backgroundColor: "transparent",
                          border: "none",
                          paddingLeft: "10px",
                          paddingRight: "8px",
                        },
                      }}
                      inputProps={{
                        onBlur: () => handleBlurValidate("contactNumber"),
                        placeholder: "e.g. +1 555 000 0000"
                      }}
                    />
                  </div>
                  <FieldError
                    message={touched.contactNumber ? errors.contactNumber : undefined}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, address: e.target.value })
                    }
                    onBlur={() => handleBlurValidate("address")}
                    placeholder="e.g. 123 Main St, Apt 4B"
                    className={`${inputBase} ${errors.address && touched.address ? inputErr : inputOk}`}
                  />
                  <FieldError message={touched.address ? errors.address : undefined} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, city: e.target.value })
                      }
                      onBlur={() => handleBlurValidate("city")}
                      placeholder="e.g. New York"
                      className={`${inputBase} ${errors.city && touched.city ? inputErr : inputOk}`}
                    />
                    <FieldError message={touched.city ? errors.city : undefined} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, state: e.target.value })
                      }
                      onBlur={() => handleBlurValidate("state")}
                      placeholder="e.g. NY"
                      className={`${inputBase} ${errors.state && touched.state ? inputErr : inputOk}`}
                    />
                    <FieldError message={touched.state ? errors.state : undefined} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                      Zip
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      value={shippingInfo.zip}
                      onChange={(e) => handleZipChange(e.target.value)}
                      onBlur={() => handleBlurValidate("zip")}
                      placeholder="e.g. 10001"
                      className={`${inputBase} ${errors.zip && touched.zip ? inputErr : inputOk}`}
                    />
                    <FieldError message={touched.zip ? errors.zip : undefined} />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <h2 className="text-[18px] font-bold text-gray-900">Payment Info:</h2>
                <div className="flex items-center gap-1.5 text-gray-500 text-[14px]">
                  Payment powered by:
                  <div className="flex items-center text-[#2A8F3F] font-bold text-[18px] tracking-tight ml-1">
                    <svg className="w-5 h-5 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C9.5 2 7 4 7 6.5C7 7.5 7.5 8.5 8 9.5C6 9 4 9 2.5 10.5C1.5 11.5 1.5 13.5 3 15C4.5 16.5 6.5 16.5 7.5 15.5C8.5 14.5 9 13.5 9.5 12C9.5 14 9.5 16 9.5 18H14.5C14.5 16 14.5 14 14.5 12C15 13.5 15.5 14.5 16.5 15.5C17.5 16.5 19.5 16.5 21 15C22.5 13.5 22.5 11.5 21.5 10.5C20 9 18 9 16 9.5C16.5 8.5 17 7.5 17 6.5C17 4 14.5 2 12 2Z" />
                    </svg>
                    clover
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                    Payment Method
                  </label>
                  <div className="w-full bg-[#F3F4F6] text-gray-700 font-medium text-[14px] rounded-lg px-4 py-3 border border-transparent">
                    Clover
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    autoComplete="cc-name"
                    value={paymentInfo.cardHolderName}
                    onChange={(e) => handleCardHolderChange(e.target.value)}
                    onBlur={() => handleBlurValidate("cardHolderName")}
                    placeholder="e.g. John Doe"
                    className={`${inputBase} ${errors.cardHolderName && touched.cardHolderName ? inputErr : inputOk
                      }`}
                  />
                  <FieldError
                    message={touched.cardHolderName ? errors.cardHolderName : undefined}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    onBlur={() => handleBlurValidate("cardNumber")}
                    placeholder="e.g. 4111 1111 1111 1111"
                    className={`${inputBase} ${errors.cardNumber && touched.cardNumber ? inputErr : inputOk
                      }`}
                  />
                  <FieldError message={touched.cardNumber ? errors.cardNumber : undefined} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Expiry Date */}
                  <div className="flex-1 relative" ref={expiryPickerRef}>
                    <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                      Expired Date
                    </label>

                    <div
                      className={`flex items-center h-[42px] ${inputBase} ${errors.expiredDate && touched.expiredDate ? inputErr : inputOk
                        } px-0 py-0`}
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        value={paymentInfo.expiredDate}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        onBlur={() => handleBlurValidate("expiredDate")}
                        placeholder="MM/YY"
                        className="flex-1 h-full bg-transparent outline-none px-4 min-w-0"
                      />

                      <button
                        type="button"
                        onClick={() => setExpiryPickerOpen((v) => !v)}
                        aria-label="Open expiry date picker"
                        className="h-full px-3 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors shrink-0"
                      >
                        <CalendarDays className="w-4 h-4" />
                      </button>
                    </div>

                    <FieldError
                      message={touched.expiredDate ? errors.expiredDate : undefined}
                    />

                    {expiryPickerOpen && (
                      <div className="absolute z-20 top-full left-0 mt-2 w-full sm:w-[280px] bg-white border border-gray-200 rounded-xl shadow-lg p-3">
                        <p className="text-[12px] font-semibold text-gray-500 mb-2 px-1">
                          Select expiry month &amp; year
                        </p>

                        <div className="grid grid-cols-3 gap-1.5 max-h-[180px] overflow-y-auto mb-2">
                          {EXPIRY_MONTH_OPTIONS.map(
                            (m: { value: number; label: string }) => {
                              const currentYear =
                                parseInt(paymentInfo.expiredDate.split("/")[1], 10) ||
                                yearOptions[0];

                              const fullYear =
                                currentYear < 100 ? 2000 + currentYear : currentYear;

                              const isPast =
                                new Date(fullYear, m.value, 0) < new Date();

                              return (
                                <button
                                  key={m.value}
                                  type="button"
                                  disabled={isPast}
                                  onClick={() =>
                                    applyExpiryFromPicker(m.value, fullYear)
                                  }
                                  className="text-gray-800 text-[12px] py-1.5 rounded-md border border-gray-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                  {String(m.value).padStart(2, "0")}
                                </button>
                              );
                            }
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-2">
                          {yearOptions.map((y: number) => {
                            const currentMonth =
                              parseInt(paymentInfo.expiredDate.split("/")[0], 10) || 1;

                            const isSelectedYear =
                              String(y).slice(-2) ===
                              paymentInfo.expiredDate.split("/")[1];

                            return (
                              <button
                                key={y}
                                type="button"
                                onClick={() =>
                                  applyExpiryFromPicker(currentMonth, y)
                                }
                                className={`text-[12px] px-2.5 py-1 rounded-md border transition-colors ${isSelectedYear
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "text-gray-800 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                                  }`}
                              >
                                {y}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CVV */}
                  <div className="flex-1">
                    <label className="block text-gray-800 text-[14px] font-medium mb-1.5">
                      CVV
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={paymentInfo.cvv}
                      onChange={(e) => handleCVVChange(e.target.value)}
                      onBlur={() => handleBlurValidate("cvv")}
                      placeholder="123"
                      className={`h-[42px] ${inputBase} ${errors.cvv && touched.cvv ? inputErr : inputOk
                        }`}
                    />

                    <FieldError message={touched.cvv ? errors.cvv : undefined} />
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Confirmation */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-[22px] h-[22px] text-blue-600" />
                <h2 className="text-[18px] font-bold text-gray-900">Compliance Confirmation:</h2>
              </div>
              <p className="text-gray-500 text-[14.5px] mb-6 leading-relaxed max-w-[95%]">
                Before completing your submission, please confirm you understand the following
                important information about our telemedicine service:
              </p>

              <div className="flex flex-col gap-3 mb-6">
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={complianceConfirmation.agreedToTermsAndPrivacy}
                    onChange={(e) =>
                      setComplianceConfirmation({
                        ...complianceConfirmation,
                        agreedToTermsAndPrivacy: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-blue-600 shrink-0"
                  />
                  <span className="text-gray-700 text-[14px]">
                    I have reviewed and agree to the{" "}
                    <span className="font-bold underline">Terms of Service and Privacy Policy.</span>
                  </span>
                </label>
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={complianceConfirmation.certifiedInfoAccurate}
                    onChange={(e) =>
                      setComplianceConfirmation({
                        ...complianceConfirmation,
                        certifiedInfoAccurate: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-blue-600 shrink-0"
                  />
                  <span className="text-gray-700 text-[14px]">
                    I certify that all information provided is accurate and complete.
                  </span>
                </label>
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={complianceConfirmation.understoodFalseInfoConsequences}
                    onChange={(e) =>
                      setComplianceConfirmation({
                        ...complianceConfirmation,
                        understoodFalseInfoConsequences: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-blue-600 shrink-0"
                  />
                  <span className="text-gray-700 text-[14px]">
                    I understand that providing false or misleading information may result in
                    denial of treatment.
                  </span>
                </label>
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={complianceConfirmation.understoodRecommendationsBasis}
                    onChange={(e) =>
                      setComplianceConfirmation({
                        ...complianceConfirmation,
                        understoodRecommendationsBasis: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-blue-600 shrink-0"
                  />
                  <span className="text-gray-700 text-[14px]">
                    I understand that treatment recommendations are based on the information I
                    have provided.
                  </span>
                </label>
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={complianceConfirmation.understoodAdditionalInfoMayBeRequested}
                    onChange={(e) =>
                      setComplianceConfirmation({
                        ...complianceConfirmation,
                        understoodAdditionalInfoMayBeRequested: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-blue-600 shrink-0"
                  />
                  <span className="text-gray-700 text-[14px]">
                    I understand that additional information may be requested before treatment is
                    approved.
                  </span>
                </label>
              </div>

              <div className="bg-[#EBF1FF] text-[#3B82F6] text-[14px] rounded-lg p-4 font-medium">
                All checkboxes are required. This disclosure is maintained for HIPAA and
                telemedicine compliance purposes.
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Panel */}
          <div className="w-full lg:w-[370px] lg:sticky lg:top-[100px] flex-shrink-0 self-start">
            <div className="rounded-2xl p-5 shadow-sm" style={{ background: "#EEF2FF" }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold text-gray-900">Order Summary</h3>
                {itemCount > 0 && (
                  <span className="bg-[#DEE7FB] text-blue-600 text-[11px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                    {itemCount} ITEM{itemCount !== 1 ? "S" : ""}
                  </span>
                )}
              </div>

              {/* Cart items */}
              {cartLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-7 h-7 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <ShoppingCart className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-gray-400 text-[13px]">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-blue-100 mb-4">
                  {cartItems.map((item) => {
                    const img = item.product?.images?.[0]?.fileUrl ?? "";
                    const isRemoving = removingId === item.id;
                    const isUpdatingInc = updatingId === `${item.id}-inc`;
                    const isUpdatingDec = updatingId === `${item.id}-dec`;

                    return (
                      <div key={item.id} className="py-3.5 flex gap-3">
                        {/* Thumbnail */}
                        <div
                          className="relative w-[56px] h-[56px] flex-shrink-0 rounded-xl overflow-hidden"
                          style={{ backgroundColor: "#1E2224" }}
                        >
                          {img && (
                            <Image
                              src={img}
                              alt={item.product?.name || "Product"}
                              fill
                              unoptimized
                              className="object-contain p-1.5"
                              sizes="56px"
                            />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-gray-900 text-[13px] font-semibold leading-snug">
                              {item.product?.name || "Unknown Product"}
                            </p>
                            <p className="text-gray-900 text-[13px] font-bold flex-shrink-0">
                              ${parseFloat(item.itemTotal).toFixed(2)}
                            </p>
                          </div>

                          {/* Size badge */}
                          {item.size && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[11px] text-gray-500">Size:</span>
                              <span className="bg-blue-100 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                                {item.size}
                              </span>
                            </div>
                          )}

                          {/* Qty + Delete row */}
                          <div className="flex items-center justify-between mt-2">
                            {/* Qty controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                                disabled={isUpdatingDec || item.quantity <= 1}
                                className="w-6 h-6 rounded-full bg-white border border-blue-200 text-gray-600 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-[13px] font-bold transition-colors"
                              >
                                {isUpdatingDec ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  "−"
                                )}
                              </button>
                              <span className="text-gray-800 text-[13px] font-semibold w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                                disabled={isUpdatingInc}
                                className="w-6 h-6 rounded-full bg-white border border-blue-200 text-gray-600 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-[13px] font-bold transition-colors"
                              >
                                {isUpdatingInc ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  "+"
                                )}
                              </button>
                            </div>

                            {/* Delete icon */}
                            <button
                              onClick={() => handleRemove(item.id)}
                              disabled={isRemoving}
                              title="Remove item"
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isRemoving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-blue-200 my-4" />

              {/* Coupon Code */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Tag className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-700 text-[13px] font-semibold">Coupon Code</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 gap-2 focus-within:border-blue-400 transition-colors">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError("");
                        setCouponApplied(false);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-transparent text-[13px] text-gray-700 placeholder-gray-400 outline-none min-w-0"
                    />
                    {couponApplied && !summaryFetching && !summaryError && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={summaryFetching}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 whitespace-nowrap flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-red-500 text-[11px] mt-1.5 ml-1">{couponError}</p>
                )}
                {summaryFetching && couponApplied && (
                  <p className="text-blue-600 text-[11px] mt-1.5 ml-1 font-medium flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Applying coupon...
                  </p>
                )}
                {couponApplied && !summaryFetching && !summaryError && (
                  <p className="text-green-600 text-[11px] mt-1.5 ml-1 font-medium">
                    ✓ Coupon applied successfully!
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-blue-200 my-4" />

              {/* Price Summary */}
              <div className="flex flex-col gap-2.5 mb-4">
                {[
                  {
                    label: "Subtotal",
                    value: summary?.subtotal ? `$${parseFloat(summary.subtotal).toFixed(2)}` : "—",
                  },
                  {
                    label: "Service Duration",
                    value: formatServiceDuration(summary?.serviceDuration),
                  },
                  {
                    label: "Service Fees",
                    value: summary?.serviceFees
                      ? `$${parseFloat(summary.serviceFees).toFixed(2)}`
                      : "—",
                  },
                  {
                    label: "Shipping Charge",
                    value: summary?.shippingCharge
                      ? `$${parseFloat(summary.shippingCharge).toFixed(2)}`
                      : "—",
                  },
                  {
                    label: "Discount",
                    value:
                      summary?.discount && parseFloat(summary.discount) > 0
                        ? `- $${parseFloat(summary.discount).toFixed(2)}`
                        : "$0.00",
                    accent: true,
                  },
                ].map(({ label, value, accent }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500 text-[13px]">{label}</span>
                    <span
                      className={`text-[13px] font-medium ${accent ? "text-red-500" : "text-gray-800"}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-gray-900 text-[15px] font-bold">Total</span>
                  <span className="text-[#2563EB] text-[17px] font-bold">
                    {summary?.total ? `$${parseFloat(summary.total).toFixed(2)}` : "—"}
                  </span>
                </div>
              </div>

              {/* Recurring checkbox */}
              <label className="flex items-start gap-2.5 mb-5 cursor-pointer select-none">
                <div
                  onClick={() => setRecurring((v) => !v)}
                  className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors cursor-pointer ${recurring ? "bg-blue-600 border-blue-600" : "bg-white border-blue-400"
                    }`}
                >
                  {recurring && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-gray-600 text-[12px] leading-relaxed"
                  onClick={() => setRecurring((v) => !v)}
                >
                  Active monthly{" "}
                  <span className="underline font-medium text-gray-700">
                    recurring subscriptions
                  </span>
                </span>
              </label>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-white text-[15px] font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-md block text-center"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Preview & Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scoped overrides so react-phone-number-input matches the form's visual style */}
      <style jsx global>{`
        .checkout-phone-input .PhoneInputInput {
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          color: #374151;
          padding: 0;
          flex: 1;
        }
        .checkout-phone-input .PhoneInputCountry {
          margin-right: 10px;
        }
        .checkout-phone-input .PhoneInputCountrySelect {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}