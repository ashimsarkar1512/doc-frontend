"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
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
import { useGetCurrentUserQuery } from "@/Redux/api/authApi";
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

import CloverCheckoutPayment from "@/components/Dashboard/Patient/domains/checkout/CloverCheckoutPayment";
import { useCreatePaymentCardMutation } from "@/Redux/api/paymentCardApi";

const inputBase =
  "w-full h-[52px] bg-[#F0F0F0] text-[#3B3B3B] font-[Quicksand] text-[16px] font-normal leading-none rounded-lg px-3 outline-none focus:bg-white border transition-colors placeholder:text-[#3B3B3B] placeholder:font-normal placeholder:opacity-70 flex items-center";
const inputOk = "border-transparent focus:border-blue-500";
const inputErr = "border-red-400 focus:border-red-500 bg-red-50";

export default function CheckoutPage() {
  const router = useRouter();

  // ── Coupon state ──
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // ── Groupon state (dummy) ──
  const [grouponCode, setGrouponCode] = useState("SUMMER2026");
  const [grouponApplied, setGrouponApplied] = useState(false);
  const [showGrouponDropdown, setShowGrouponDropdown] = useState(false);
  const [grouponMessage, setGrouponMessage] = useState("");

  const handleApplyGroupon = () => {
    setGrouponApplied(true);
    setGrouponMessage("");
  };

  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("submissionId");
    if (id) setSubmissionId(id);

    const savedCoupon = localStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      setCouponInput(savedCoupon);
      setCouponApplied(true);
    }
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
      localStorage.removeItem("appliedCoupon");
    }
  }, [summaryError, couponApplied]);

  useEffect(() => {
    if (!summaryFetching) {
      setIsApplyingCoupon(false);
    }
  }, [summaryFetching]);

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

  // ── Pre-fill Shipping Info from Profile ──
  const { data: currentUserData } = useGetCurrentUserQuery();

  useEffect(() => {
    if (currentUserData?.data) {
      const user = currentUserData.data;
      const profile = user.profile;

      setShippingInfo(prev => {
        // The PhoneInput component auto-initializes the state to "+1" (or similar dial code)
        // on mount, so we check if it's practically empty (just a country code).
        const isPhoneEmpty = !prev.contactNumber || prev.contactNumber.length <= 4;

        return {
          ...prev,
          fullName: prev.fullName.trim() === "" ? (profile?.name || "") : prev.fullName,
          contactNumber: isPhoneEmpty && user.phone ? user.phone : prev.contactNumber,
          address: prev.address.trim() === "" ? (profile?.address || "") : prev.address,
          city: prev.city.trim() === "" ? (profile?.city || "") : prev.city,
          state: prev.state.trim() === "" ? (profile?.state || "") : prev.state,
          zip: prev.zip.trim() === "" ? (profile?.zipCode || "") : prev.zip,
        };
      });
    }
  }, [currentUserData]);

  const [paymentPayload, setPaymentPayload] = useState<{ cloverToken?: string; savedCardId?: string; cardHolderName?: string; isReady: boolean }>({ isReady: false });
  const cloverInstanceRef = useRef<any>(null);
  
  const [showSaveCardModal, setShowSaveCardModal] = useState(false);
  const [pendingCheckoutPayload, setPendingCheckoutPayload] = useState<any>(null);
  
  const [createPaymentCard] = useCreatePaymentCardMutation();

  const handleMethodChange = (data: { cloverToken?: string; savedCardId?: string; cardHolderName?: string; isReady: boolean }) => {
    setPaymentPayload(data);
  };

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

  // ── Optimistic UI State ──
  const [optimisticSizes, setOptimisticSizes] = useState<Record<string, string>>({});

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

  const handleVariantChange = async (itemId: string, newSize: string) => {
    setUpdatingId(`${itemId}-size`);
    // Optimistic UI update
    setOptimisticSizes((prev) => ({ ...prev, [itemId]: newSize }));
    try {
      await updateCartItem({ id: itemId, size: newSize }).unwrap();
      toast.success("Size updated successfully");
    } catch (e: unknown) {
      // Revert on failure
      setOptimisticSizes((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      toast.error((e as { data?: { message?: string } })?.data?.message || "Failed to update size");
      console.error("Update size failed:", e);
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
    setIsApplyingCoupon(true);
    setCouponApplied(true);
    setCouponError("");
    localStorage.setItem("appliedCoupon", code);
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
    };

    setErrors(newErrors);
    setTouched({
      fullName: true,
      contactNumber: true,
      address: true,
      city: true,
      state: true,
      zip: true,
    });

    return Object.values(newErrors).every((msg) => !msg);
  };

  const handleSubmit = async () => {
    if (!validateAll()) {
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }

    const allAgreed = Object.values(complianceConfirmation).every((val) => val === true);
    if (!allAgreed) {
      toast.error("You must agree to all compliance confirmations before continuing.");
      return;
    }

    if (!paymentPayload.isReady) {
        toast.error("Please complete your payment details.");
        return;
    }

    const submissionId = localStorage.getItem("submissionId");
    if (!submissionId) {
      toast.error("Valid assessment submission not found. Please complete the assessment.");
      return;
    }

    if (!paymentPayload.savedCardId && cloverInstanceRef.current) {
        // Needs tokenization
        try {
            const result = await cloverInstanceRef.current.createToken({
               name: paymentPayload.cardHolderName || shippingInfo.fullName
            });
            
            if (result.errors || result.error) {
                toast.error("Invalid card details. Please check and try again.");
                return;
            }
            
            const payload = {
              submissionId,
              shippingInfo,
              paymentInfo: { method: "CLOVER", cloverToken: result.token, cardHolderName: paymentPayload.cardHolderName || shippingInfo.fullName },
              complianceConfirmation,
              discountCode: couponApplied ? couponInput.trim() : undefined,
              isRecurring: recurring,
              billingCycle: summary?.serviceDuration || "MONTHLY",
            };

            const cardDetails = {
                last4: result.last4 || result.card?.last4 || "****",
                brand: result.brand || result.card?.brand || "Card",
                expMonth: result.exp_month || result.card?.exp_month || 0,
                expYear: result.exp_year || result.card?.exp_year || 0
            };
            
            setPendingCheckoutPayload({ payload, token: result.token, cardDetails });
            setShowSaveCardModal(true);
            return;
        } catch (e) {
            toast.error("Failed to generate payment token.");
            return;
        }
    } else if (paymentPayload.savedCardId) {
       const payload = {
          submissionId,
          shippingInfo,
          paymentInfo: { method: "CLOVER", savedCardId: paymentPayload.savedCardId },
          complianceConfirmation,
          discountCode: couponApplied ? couponInput.trim() : undefined,
          isRecurring: recurring,
          billingCycle: summary?.serviceDuration || "MONTHLY",
       };
       localStorage.setItem("checkoutPayload", JSON.stringify(payload));
       router.push("/previewdetails");
    }
  };

  const finalizeCheckout = async (saveCard: boolean) => {
      setShowSaveCardModal(false);
      if (!pendingCheckoutPayload) return;
      
      const { payload, token, cardDetails } = pendingCheckoutPayload;
      
      if (saveCard) {
          try {
              await createPaymentCard({ 
                  cloverToken: token, 
                  isDefault: true,
                  cardHolderName: payload.paymentInfo.cardHolderName,
                  last4: cardDetails?.last4,
                  brand: cardDetails?.brand,
                  expMonth: Number(cardDetails?.expMonth || 0),
                  expYear: Number(cardDetails?.expYear || 0)
              }).unwrap();
          } catch (e) {
              console.error("Failed to save card", e);
          }
      }
      
      localStorage.setItem("checkoutPayload", JSON.stringify(payload));
      router.push("/previewdetails");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white pb-20">
      <Navbar variant="dark" />

      <div className="pt-32 pb-16 max-w-[1520px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* LEFT: Checkout Form */}
          <div className="flex-1 min-w-0 w-full lg:pr-4">
            <button
              onClick={() => router.back()}
              className="relative z-50 flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors text-[14px] font-medium mb-6 group w-fit cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            <h1 className="text-[#191B1C] font-[Quicksand] text-[26px] font-bold leading-[1.2] mb-6">
              Checkout
            </h1>
            <h2 className="text-[#272628] font-[Quicksand] text-[30px] font-bold leading-[1.1] mb-8">
              Pay to checkout and submit for approval
            </h2>

            {/* Shipping Info */}
            <div className="mb-10">
              <h2 className="text-[#2B2922] font-[Quicksand] text-[24px] font-bold leading-none mb-4">Shipping Info:</h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
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
                  <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
                    Contact Number
                  </label>
                  {/* International phone input with built-in country selector + format validation */}
                  <div
                    className={`flex items-center h-[52px] w-full bg-[#F0F0F0] rounded-lg border transition-colors ${errors.contactNumber && touched.contactNumber
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
                        height: "52px",
                        fontSize: "16px",
                        fontFamily: "Quicksand",
                        fontWeight: 400,
                        lineHeight: 1,
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#3B3B3B",
                        paddingLeft: "8px",
                        outline: "none"
                      }}
                      countrySelectorStyleProps={{
                        buttonStyle: {
                          height: "52px",
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
                  <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
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
                    <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
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
                    <label className="flex items-center gap-1.5 text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5 relative group cursor-pointer w-fit">
                      State
                      <svg className="w-4 h-4 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[400px] bg-white shadow-[0_4px_25px_rgba(0,0,0,0.12)] border border-gray-100 rounded-[16px] px-5 py-4 text-[15px] text-[#272628] font-normal font-[Inter] leading-[1.6] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        Service is only available in states where our providers hold an active license.{" "}
                        <Link href="/coverage" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] underline underline-offset-4 decoration-[#2563EB]">
                          Learn more.
                        </Link>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[8px] border-transparent border-t-white"></div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[0px] border-[9px] border-transparent border-t-gray-100 -z-10"></div>
                      </div>
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
                    <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
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
                <h2 className="text-[#2B2922] font-[Quicksand] text-[24px] font-bold leading-none">Payment Info:</h2>
                <div className="flex items-center gap-1.5 text-[#3B3B3B] font-[Quicksand] text-[20px] font-normal leading-none">
                  Payment powered by:
                  <div className="flex items-center ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="104" height="25" viewBox="0 0 104 25" fill="none">
                      <path d="M42.3813 16.9356C40.41 19.2654 38.0802 20.1614 35.7505 20.1614C31.3598 20.1614 27.8652 17.0252 27.8652 12.9034C27.8652 8.78152 31.1806 5.64532 35.5713 5.64532C39.962 5.64532 40.2308 6.54138 42.2021 8.87113L39.2451 10.9321C38.1699 9.40876 37.005 8.87113 35.5713 8.87113C33.3311 8.87113 31.4494 10.6632 31.4494 12.9034C31.4494 15.1435 33.4208 16.9356 35.7505 16.9356C38.0802 16.9356 38.4387 16.3084 39.5139 14.9643L42.3813 16.9356Z" fill="#040"/>
                      <path d="M43.9952 6.10352e-05H47.6691V19.8925H43.9952V6.10352e-05Z" fill="#040"/>
                      <path d="M57.3481 5.64532C61.7388 5.64532 65.2334 8.78152 65.2334 12.9034C65.2334 17.0252 61.7388 20.1614 57.3481 20.1614C52.9574 20.1614 49.3732 17.0252 49.3732 12.9034C49.3732 8.78152 52.8678 5.64532 57.3481 5.64532ZM57.3481 17.1148C59.6779 17.1148 61.7388 15.2331 61.7388 12.9034C61.7388 10.5736 59.6779 8.69192 57.3481 8.69192C55.0184 8.69192 52.9574 10.5736 52.9574 12.9034C52.9574 15.2331 55.0184 17.1148 57.3481 17.1148Z" fill="#040"/>
                      <path d="M64.6943 5.91394H68.9954L72.49 13.3512L76.2535 5.91394H80.1961L72.49 20.6989L64.6943 5.91394Z" fill="#040"/>
                      <path d="M92.9216 18.2797C91.4879 19.4446 89.6062 20.1614 87.5453 20.1614C83.1546 20.1614 79.5704 17.0252 79.5704 12.9034C79.5704 8.78152 82.7962 5.64532 87.1868 5.64532C91.5775 5.64532 94.4449 8.78152 94.4449 12.9034V13.9786H83.2442C83.7818 15.8604 85.5739 17.1148 87.5453 17.1148C89.5166 17.1148 89.7854 16.7564 90.7711 15.7708L92.9216 18.3693V18.2797ZM90.6815 11.0217C90.1438 9.76718 88.8893 8.78152 87.2764 8.78152C85.6635 8.78152 84.3195 9.67758 83.6026 11.0217H90.6815Z" fill="#040"/>
                      <path d="M96.3255 12.0967C96.3255 8.78125 98.8344 6.00348 103.046 6.00348V9.22928C101.254 9.22928 99.9993 10.3046 99.9993 12.5447V19.8924H96.3255V12.0967Z" fill="#040"/>
                      <path d="M11.3799 6.54121C11.3799 3.40501 8.87096 0.896057 5.73476 0.896057C2.59856 0.896057 0 3.40501 0 6.54121C0 9.67741 2.50896 12.1864 5.64516 12.1864H11.2903V6.54121H11.3799Z" fill="#040"/>
                      <path d="M12.9021 6.54121C12.9021 3.40501 15.4111 0.896057 18.5473 0.896057C21.6835 0.896057 24.1924 3.40501 24.1924 6.54121C24.1924 9.67741 21.6835 12.1864 18.5473 12.1864H12.9021V6.54121Z" fill="#040"/>
                      <path d="M12.9021 19.3549C12.9021 22.4911 15.4111 25.0001 18.5473 25.0001C21.6835 25.0001 24.1924 22.4911 24.1924 19.3549C24.1924 16.2187 21.6835 13.7098 18.5473 13.7098H12.9021V19.3549Z" fill="#040"/>
                      <path d="M11.3799 19.3549C11.3799 22.4911 8.87096 25.0001 5.73476 25.0001C2.59856 25.0001 0 22.4911 0 19.3549C0 16.2187 2.50896 13.7098 5.64516 13.7098H11.2903V19.3549H11.3799ZM5.64516 23.4768C7.8853 23.4768 9.76701 21.6847 9.76701 19.4445V15.4123H5.64516C3.40501 15.4123 1.5233 17.2044 1.5233 19.4445C1.5233 21.6847 3.31541 23.4768 5.64516 23.4768Z" fill="#040"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <CloverCheckoutPayment onPaymentReady={handleMethodChange} cloverInstanceRef={cloverInstanceRef} />
              </div>
            </div>

            {/* Compliance Confirmation */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-[28px] h-[28px] text-blue-600" />
                <h2 className="text-[#2B2922] font-[Quicksand] text-[24px] font-bold leading-none">Compliance Confirmation:</h2>
              </div>
              <p className="text-[#3B3B3B] font-[Quicksand] text-[20px] font-normal leading-[1.5] mb-6 max-w-[95%]">
                Before completing your submission, please confirm you understand the following
                important information about our telemedicine service:
              </p>

              <div className="flex flex-col gap-[12px] mb-6">
                <div className="flex items-start gap-[12px] border border-[#D1D5DC] rounded-[12px] p-4 transition-colors">
                  <input
                    id="compliance-terms"
                    type="checkbox"
                    checked={complianceConfirmation.agreedToTermsAndPrivacy}
                    onChange={(e) =>
                      setComplianceConfirmation({
                        ...complianceConfirmation,
                        agreedToTermsAndPrivacy: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-[#2563EB] shrink-0 cursor-pointer mt-0.5 border-gray-300 rounded"
                  />
                  <label htmlFor="compliance-terms" className="text-[#272628] font-[Quicksand] text-[20px] font-normal leading-none cursor-pointer">
                    I have reviewed and agree to the{" "}
                    <Link href="/terms-of-service" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-bold underline hover:text-[#2563EB] transition-colors">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-bold underline hover:text-[#2563EB] transition-colors">Privacy Policy</Link>.
                  </label>
                </div>
                <div className="flex items-start gap-[12px] border border-[#D1D5DC] rounded-[12px] p-4 transition-colors">
                  <input
                    id="compliance-accurate"
                    type="checkbox"
                    checked={complianceConfirmation.certifiedInfoAccurate}
                    onChange={(e) =>
                      setComplianceConfirmation({
                        ...complianceConfirmation,
                        certifiedInfoAccurate: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-[#2563EB] shrink-0 cursor-pointer mt-0.5 border-gray-300 rounded"
                  />
                  <label htmlFor="compliance-accurate" className="text-[#272628] font-[Quicksand] text-[20px] font-normal leading-none cursor-pointer">
                    I certify that all information provided is accurate and complete.
                  </label>
                </div>
                <div className="flex items-start gap-[12px] border border-[#D1D5DC] rounded-[12px] p-4 transition-colors">
                  <input
                    id="compliance-false-info"
                    type="checkbox"
                    checked={complianceConfirmation.understoodFalseInfoConsequences}
                    onChange={(e) =>
                      setComplianceConfirmation({
                        ...complianceConfirmation,
                        understoodFalseInfoConsequences: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-[#2563EB] shrink-0 cursor-pointer mt-0.5 border-gray-300 rounded"
                  />
                  <label htmlFor="compliance-false-info" className="text-[#272628] font-[Quicksand] text-[20px] font-normal leading-none cursor-pointer">
                    I understand that providing false or misleading information may result in
                    denial of treatment.
                  </label>
                </div>
                <div className="flex items-start gap-[12px] border border-[#D1D5DC] rounded-[12px] p-4 transition-colors">
                  <input
                    id="compliance-recommendations"
                    type="checkbox"
                    checked={complianceConfirmation.understoodRecommendationsBasis}
                    onChange={(e) =>
                      setComplianceConfirmation({
                        ...complianceConfirmation,
                        understoodRecommendationsBasis: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-[#2563EB] shrink-0 cursor-pointer mt-0.5 border-gray-300 rounded"
                  />
                  <label htmlFor="compliance-recommendations" className="text-[#272628] font-[Quicksand] text-[20px] font-normal leading-none cursor-pointer">
                    I understand that treatment recommendations are based on the information I
                    have provided.
                  </label>
                </div>
                <div className="flex items-start gap-[12px] border border-[#D1D5DC] rounded-[12px] p-4 transition-colors">
                  <input
                    id="compliance-additional-info"
                    type="checkbox"
                    checked={complianceConfirmation.understoodAdditionalInfoMayBeRequested}
                    onChange={(e) =>
                      setComplianceConfirmation({
                        ...complianceConfirmation,
                        understoodAdditionalInfoMayBeRequested: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-[#2563EB] shrink-0 cursor-pointer mt-0.5 border-gray-300 rounded"
                  />
                  <label htmlFor="compliance-additional-info" className="text-[#272628] font-[Quicksand] text-[20px] font-normal leading-none cursor-pointer">
                    I understand that additional information may be requested before treatment is
                    approved.
                  </label>
                </div>
              </div>

              <div className="bg-[#EBF1FF] text-[#3B82F6] text-[14px] rounded-lg p-4 font-medium">
                All checkboxes are required. This disclosure is maintained for HIPAA and
                telemedicine compliance purposes.
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Panel */}
          <div
            className="w-full lg:w-[450px] lg:sticky lg:top-[120px] flex-shrink-0 self-start z-10"
          >
            <div className="rounded-2xl p-7 shadow-sm" style={{ background: "#EAF3FF", fontFamily: "Quicksand, sans-serif" }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#191B1C] font-[Quicksand] text-[26px] font-bold leading-[1.2]">Order Summary</h3>
                {itemCount > 0 && (
                  <span className="bg-[#1D4ED8]/10 text-[#1D4ED8] font-[Inter] text-[12px] font-normal leading-none px-3 py-1 rounded-[50px] uppercase">
                    {itemCount} ITEM{itemCount !== 1 ? "S" : ""}
                  </span>
                )}
              </div>

              <div className="border-b border-[#1D4ED8] mb-5 w-full opacity-80" />

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
                <div className="flex flex-col gap-4 mb-12">
                  {cartItems.map((item) => {
                    const img = item.product?.images?.[0]?.fileUrl ?? "";
                    const isRemoving = removingId === item.id;
                    const isUpdatingInc = updatingId === `${item.id}-inc`;
                    const isUpdatingDec = updatingId === `${item.id}-dec`;

                    return (
                      <div key={item.id} className="flex gap-4">
                        {/* Thumbnail */}
                        <div
                          className="relative w-[70px] h-[70px] flex-shrink-0 rounded-2xl overflow-hidden shadow-sm p-1.5"
                          style={{ backgroundColor: "#292C2D" }}
                        >
                          {img && (
                            <Image
                              src={img}
                              alt={item.product?.name || "Product"}
                              fill
                              unoptimized
                              className="object-contain p-1.5"
                              sizes="70px"
                            />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-gray-900 text-[14px] font-bold leading-snug">
                                {item.product?.name || "Unknown Product"}
                              </p>
                              {item.product?.description && (
                                <p className="text-[#272628] font-[Quicksand] text-[16px] font-normal leading-[1.2] mt-1 line-clamp-1">
                                  {item.product.description.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().substring(0, 35)}...
                                </p>
                              )}
                            </div>
                            <p className="text-[#2563EB] text-[14px] font-bold flex-shrink-0">
                              ${parseFloat(item.itemTotal).toFixed(2)}
                            </p>
                          </div>

                          {/* Variant/Size badge */}
                          {item.product?.variants && item.product.variants.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              <span className="text-[12px] text-gray-600 font-medium mr-1">Size:</span>
                              {item.product.variants.map((v) => {
                                const currentSize = optimisticSizes[item.id] || item.size;
                                const isSelected = currentSize === v.size;
                                const isUpdatingVariant = updatingId === `${item.id}-size` && !isSelected;
                                return (
                                  <button
                                    key={v.id}
                                    onClick={() => !isSelected && handleVariantChange(item.id, v.size!)}
                                    disabled={isUpdatingVariant}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${isSelected
                                        ? "bg-[#2563EB] text-white shadow-sm"
                                        : "bg-[#DEE7FB] text-gray-600 hover:bg-[#D1DFF8]"
                                      } ${isUpdatingVariant ? "opacity-50 cursor-not-allowed" : ""}`}
                                  >
                                    {v.size}
                                  </button>
                                );
                              })}
                            </div>
                          ) : item.size && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="text-[12px] text-gray-600 font-medium">Size:</span>
                              <span className="bg-[#DEE7FB] text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {item.size}
                              </span>
                            </div>
                          )}

                          {/* Qty + Delete row */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                                disabled={isUpdatingDec || item.quantity <= 1}
                                className="w-5 h-5 rounded-full bg-[#DEE7FB] text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-[12px] font-bold transition-colors"
                              >
                                {isUpdatingDec ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : "−"}
                              </button>
                              <span className="text-gray-800 text-[13px] font-semibold w-3 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                                disabled={isUpdatingInc}
                                className="w-5 h-5 rounded-full bg-[#DEE7FB] text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-[12px] font-bold transition-colors"
                              >
                                {isUpdatingInc ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : "+"}
                              </button>
                            </div>
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

              {/* Groupon section (dummy) */}
              <div className="mb-6 mt-12">
                <div className="flex items-center gap-1 mb-4">
                  <span className="text-[#272628] font-[Quicksand] text-[20px] font-semibold leading-none">Discount :</span>
                  <span className="text-[#272628] font-[Quicksand] text-[20px] font-normal leading-none ml-1">Powered by:</span>
                  <div className="ml-1 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="73" height="12" viewBox="0 0 73 12" fill="none">
                      <path d="M11.655 5.27698C11.671 5.53722 11.6876 5.79684 11.6876 6.04089C11.6876 7.34032 11.3671 8.44435 10.7099 9.41862C10.1667 10.2145 9.44086 10.8652 8.59471 11.3148C7.74857 11.7644 6.8074 11.9995 5.85185 12C4.16835 12 2.7413 11.3672 1.61937 10.1651C0.544342 9.01234 0 7.58309 0 5.878C0 4.28649 0.609043 2.82541 1.73097 1.7045C2.85349 0.584194 4.26451 0 5.8833 0C8.32066 0 10.4523 1.51037 11.3665 3.97877H8.19187C7.48665 3.2323 6.74877 2.85846 5.85124 2.85846C4.18437 2.85846 2.86952 4.23841 2.86952 5.89426C2.86952 7.72917 4.27994 9.14155 5.85124 9.14155C6.90962 9.14155 7.85529 8.58982 8.41624 7.58248H5.16205V5.27698H11.655ZM18.0209 7.81028L20.8103 11.7722H17.3632L15.1828 8.05372V11.7722L12.3934 11.7728V0.227187H16.1771C17.3792 0.227187 18.2934 0.308325 19.0627 0.861267C20.073 1.57528 20.6019 2.66373 20.6019 4.09237C20.6025 5.95972 19.6402 7.3553 18.0209 7.81028ZM17.7799 4.15728C17.7799 3.19924 17.1868 2.80918 15.9521 2.80918H15.1828V5.55345H15.7278C17.1067 5.55345 17.7799 5.19584 17.7799 4.15728ZM70.2112 0.227187V6.64128L66.0263 0.227187H63.5098V11.7728H66.2986V5.34309L70.5472 11.7734H73V0.227187H70.2112ZM61.1997 1.72193C62.3542 2.87469 62.9641 4.35261 62.9641 5.92788C62.9641 7.5837 62.386 9.06161 61.3122 10.1825C60.206 11.3515 58.698 11.985 57.1114 11.985C55.4277 11.985 53.9849 11.3684 52.8629 10.1663C51.7885 9.01356 51.243 7.58492 51.243 5.87922C51.243 4.2871 51.852 2.82541 52.9739 1.7051C54.0964 0.584793 55.5068 0.0168287 57.1268 0.0168287C58.6513 0.0168287 60.0935 0.617853 61.1997 1.72193ZM60.0776 5.91107C60.0776 4.22219 58.7468 2.87469 57.1433 2.87469C55.4442 2.87469 54.1131 4.22219 54.1131 5.91107C54.1131 7.72978 55.5403 9.12591 57.112 9.12591C58.7468 9.12591 60.0776 7.79408 60.0776 5.91107ZM30.9913 1.72193C32.1459 2.87469 32.7555 4.35261 32.7555 5.92788C32.7555 7.5837 32.1779 9.06161 31.1041 10.1825C29.9976 11.3515 28.4904 11.985 26.9031 11.985C25.2196 11.985 23.7765 11.3684 22.6546 10.1663C21.5802 9.01356 21.0352 7.58492 21.0352 5.87922C21.0352 4.2871 21.6443 2.82541 22.7668 1.7051C23.8893 0.584793 25.2997 0.0168287 26.9197 0.0168287C28.4424 0.0168287 29.8848 0.617853 30.9913 1.72193ZM29.8688 5.91107C29.8688 4.22219 28.5379 2.87469 26.9346 2.87469C25.2351 2.87469 23.9042 4.22219 23.9042 5.91107C23.9042 7.72978 25.3312 9.12591 26.9025 9.12591C28.5385 9.12591 29.8688 7.79408 29.8688 5.91107ZM50.8755 4.10859C50.8755 5.60271 50.2018 6.83662 49.0638 7.53444C48.342 7.97256 47.4439 8.05372 46.2572 8.05372H45.4552V11.7722L42.6659 11.7728V0.227187H46.4495C47.651 0.227187 48.5652 0.308325 49.3351 0.861267C50.346 1.57528 50.8755 2.66373 50.8755 4.10859ZM48.0529 4.15728C48.0529 3.19924 47.4599 2.80918 46.2252 2.80918H45.4879V5.55345H46.0002C47.3797 5.55345 48.0529 5.19584 48.0529 4.15728ZM39.0721 7.33971C39.0721 8.65473 38.6074 9.30444 37.6291 9.30444C36.6835 9.30444 36.2822 8.63853 36.2822 7.33971V0.227187H33.4762V7.45327C33.4762 10.3442 35.0308 11.9507 37.6125 11.9507C40.1614 11.9507 41.861 10.2787 41.861 7.45327V0.227187H39.0721V7.33971Z" fill="#007C1F" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-stretch gap-2 h-[42px]">
                  <div className="flex-1 flex relative">
                    <input
                      type="text"
                      value={grouponCode}
                      onChange={(e) => { setGrouponCode(e.target.value); setGrouponApplied(false); }}
                      className="flex-1 bg-[#E2E8F0] text-gray-700 text-[13px] px-3 outline-none rounded-l-[12px] border border-transparent focus:border-blue-400"
                    />
                    <button
                      onClick={() => setShowGrouponDropdown(!showGrouponDropdown)}
                      className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white w-[42px] h-[42px] rounded-r-[12px] flex flex-col items-center justify-center gap-[10px] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {showGrouponDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg z-10 overflow-hidden">
                        <div className="text-[13px] text-gray-700 px-3 py-2 hover:bg-gray-50 cursor-pointer" onClick={() => { setGrouponCode("SUMMER2026"); setShowGrouponDropdown(false); setGrouponApplied(false); }}>SUMMER2026</div>
                        <div className="text-[13px] text-gray-700 px-3 py-2 hover:bg-gray-50 cursor-pointer" onClick={() => { setGrouponCode("WINTER2026"); setShowGrouponDropdown(false); setGrouponApplied(false); }}>WINTER2026</div>
                        <div className="text-[13px] text-gray-700 px-3 py-2 hover:bg-gray-50 cursor-pointer" onClick={() => { setGrouponCode("SPRING2026"); setShowGrouponDropdown(false); setGrouponApplied(false); }}>SPRING2026</div>
                      </div>
                    )}
                  </div>
                  {grouponApplied ? (
                    <button
                      disabled
                      className="flex w-[87px] h-[42px] px-[16px] py-[4px] justify-center items-center gap-[5px] rounded-[12px] bg-[#CCD4DE] text-[#272628] font-[Quicksand] text-[16px] font-semibold"
                    >
                      Applied
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyGroupon}
                      className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-[13px] font-bold px-4 rounded-[12px] h-[42px] transition-colors shadow-sm w-[87px]"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {grouponMessage && <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium">{grouponMessage}</p>}
              </div>

              {/* Coupon Code section */}
              <div className="mb-3 mt-4">
                <p className="text-[#272628] font-[Quicksand] text-[20px] font-semibold leading-none mb-3">Coupon Code:</p>
                <div className="flex items-center gap-2 h-[42px]">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError("");
                      setCouponApplied(false);
                      localStorage.removeItem("appliedCoupon");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="Enter coupon"
                    className="flex-1 bg-[#E2E8F0] text-gray-700 text-[13px] px-3 h-full rounded-[12px] outline-none border border-transparent focus:border-blue-400"
                  />

                  {/* Styled apply button to match Groupon's Applied button color pattern */}
                  {couponApplied && !isApplyingCoupon && !summaryError ? (
                    <button
                      disabled
                      className="flex w-[87px] h-[42px] px-[16px] py-[4px] justify-center items-center gap-[5px] rounded-[12px] bg-[#CCD4DE] text-[#272628] font-[Quicksand] text-[16px] font-semibold"
                    >
                      Applied
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-[13px] font-bold px-4 h-[42px] rounded-[12px] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed w-[87px]"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {couponError && (
                  <p className="text-red-500 text-[11px] mt-1.5 ml-1">{couponError}</p>
                )}
                {isApplyingCoupon && (
                  <p className="text-blue-600 text-[11px] mt-1.5 ml-1 font-medium flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Applying coupon...
                  </p>
                )}
                {couponApplied && !isApplyingCoupon && !summaryError && (
                  <p className="text-green-600 text-[11px] mt-1.5 ml-1 font-medium">
                    ✓ Coupon applied successfully!
                  </p>
                )}
              </div>

              <div className="border-b border-[#1D4ED8] opacity-80 mb-6 mt-8 w-full" />

              {/* Price Summary */}
              <div className="flex flex-col gap-4 mb-5">
                {[
                  { label: "Subtotal", value: summary?.subtotal ? `$${parseFloat(summary.subtotal).toFixed(2)}` : "—" },
                  { label: "Service Duration", value: formatServiceDuration(summary?.serviceDuration) },
                  { label: "Service Fees", value: summary?.serviceFees ? `$${parseFloat(summary.serviceFees).toFixed(2)}` : "—" },
                  { label: "Shipping charge", value: summary?.shippingCharge ? `$${parseFloat(summary.shippingCharge).toFixed(2)}` : "—" },
                  { label: "Discount", value: summary?.discount && parseFloat(summary.discount) > 0 ? `- $${parseFloat(summary.discount).toFixed(2)}` : "$0.00", accent: true },
                ].map(({ label, value, accent }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[#272628] font-[Quicksand] text-[20px] font-normal leading-none">{label}</span>
                    <span className={`font-[Quicksand] text-[20px] font-normal leading-none ${accent ? "text-red-500" : "text-[#272628]"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-[#1D4ED8] opacity-80 pt-4 pb-2 flex justify-between items-center mb-4 mt-2">
                <span className="text-[#272628] font-[Quicksand] text-[20px] font-bold leading-none">Total</span>
                <span className="text-[#1D4ED8] font-[Quicksand] text-[20px] font-bold leading-none">
                  {summary?.total ? `$${parseFloat(summary.total).toFixed(2)}` : "—"}
                </span>
              </div>

              {/* Recurring checkbox */}
              <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
                <div
                  onClick={() => setRecurring((v) => !v)}
                  className={`mt-1 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors cursor-pointer ${recurring ? "bg-blue-600 border-blue-600" : "bg-white border-blue-400"
                    }`}
                >
                  {recurring && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
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
                  className="text-[#272628] font-[Quicksand] text-[20px] font-normal leading-tight"
                  onClick={() => setRecurring((v) => !v)}
                >
                  Active monthly{" "}
                  <Link href="/billing-and-cancellation" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-[Quicksand] font-semibold underline underline-offset-4 decoration-solid decoration-[#272628] text-[#272628] hover:text-blue-600 transition-colors">
                    recurring subscriptions
                  </Link>
                </span>
              </label>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex py-[12px] px-[16px] justify-center items-center gap-[15px] self-stretch rounded-[46px] bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-[Quicksand] text-[20px] font-bold transition-colors w-full disabled:opacity-70 disabled:cursor-not-allowed"
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
          font-family: 'Quicksand', sans-serif;
          font-size: 16px;
          color: #3B3B3B;
          padding: 0;
          flex: 1;
        }
        .checkout-phone-input .PhoneInputInput::placeholder {
          color: #3B3B3B;
          opacity: 0.7;
          font-weight: 400;
        }
        .checkout-phone-input .PhoneInputCountry {
          margin-right: 10px;
        }
        .checkout-phone-input .PhoneInputCountrySelect {
          font-size: 16px;
        }
        .checkout-phone-input .PhoneInputInput:focus {
          outline: none;
        }
        
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      </div>
      {/* Save Card Modal */}
      {showSaveCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Save Payment Card
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600">
                Would you like to save this card as your default payment method for future subscriptions and purchases?
              </p>
            </div>
            
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => finalizeCheckout(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                No, just checkout
              </button>
              <button
                onClick={() => finalizeCheckout(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Yes, save it
              </button>
            </div>
          </div>
        </div>
      )}

    </ProtectedRoute>
  );
}