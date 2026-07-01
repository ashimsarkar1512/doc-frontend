"use client";

import { useState, Suspense, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { Trash2, ShoppingCart, Tag, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useGetProductsByCategoryIdQuery,
  useAddToCartMutation,
  useGetMyCartQuery,
  useGetCartSummaryQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from "@/Redux/features/patient/assesmentcategory";
import type { Product } from "@/Redux/features/patient/assesmentcategory";

// ─── Inner page ───────────────────────────────────────────────────────────────

function ProductsInner() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? "";

  // ── Coupon state ──
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

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
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsByCategoryIdQuery(categoryId, { skip: !categoryId });

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
      setCouponApplied(false);
      localStorage.removeItem("appliedCoupon");
    }
  }, [summaryError, couponApplied]);

  // ── API mutations ──
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  // ── Derived data ──
  const categoryName = productsData?.data?.[0]?.categoryName ?? "";
  const products: Product[] = productsData?.data?.[0]?.products ?? [];
  const cartItems = cartData?.data?.items ?? [];
  const itemCount = cartData?.data?.totalItem ?? 0;
  const summary = summaryData?.data;

  // ── Local loading states (per-item, no full-page reload) ──
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ── Checkbox state (controlled so checkmark works) ──
  const [recurring, setRecurring] = useState(true);

  // ── Handlers ──
  const handleAddToCart = async (p: Product) => {
    if (addingId) return; // prevent double-click while another is in flight
    setAddingId(p.id);
    try {
      await addToCart({ productId: p.id }).unwrap();
      toast.success("Added to cart");
      // RTK Query tag invalidation auto-refetches cart & summary
    } catch (e: unknown) {
      toast.error((e as { data?: { message?: string } })?.data?.message || "Failed to add to cart");
      console.error("Add to cart failed:", e);
    } finally {
      setAddingId(null);
    }
  };

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
    setUpdatingId(`${itemId}-${delta > 0 ? 'inc' : 'dec'}`);
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
    localStorage.setItem("appliedCoupon", code);
  };

  const formatServiceDuration = (sd?: string) => {
    if (!sd) return "—";
    return sd
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="min-h-screen" style={{ background: "#F4F7FF" }}>
      <Navbar variant="dark" />

      <div className="pt-36 pb-16 max-w-[1320px] mx-auto px-4 sm:px-6">

        {/* ── Page headings ── */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-gray-900 mb-1">
            Supplements
          </h1>
          <p className="text-[15px] text-gray-500">
            {categoryName
              ? `Available — ${categoryName}`
              : "Available Weight Loss Medicine"}
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ══ LEFT — Product Grid ══ */}
          <div className="flex-1 min-w-0">
            {productsLoading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !categoryId ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                  <ShoppingCart className="w-9 h-9 text-blue-400" />
                </div>
                <p className="text-gray-600 text-[15px] font-medium">
                  Complete an assessment to see recommended products.
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-gray-400 text-[15px]">
                  No products available for this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((p) => {
                  const isAdding = addingId === p.id;
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
                    >
                      {/* Image */}
                      <div
                        className="flex items-center justify-center h-[200px] p-6"
                        style={{ backgroundColor: "#1E2224" }}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            unoptimized
                            className="object-contain drop-shadow-xl"
                            sizes="240px"
                          />
                        </div>
                      </div>

                      {/* Info — NO description */}
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-gray-900 text-[15px] font-semibold mb-1 line-clamp-2">
                          {p.name}
                        </p>
                        <p className="text-[#2563EB] text-[16px] font-bold mb-4">
                          ${parseFloat(p.price).toFixed(2)}
                        </p>

                        {/* Add to Cart — only THIS button shows spinner */}
                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={isAdding}
                          className="mt-auto flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 text-white text-[13px] font-medium px-5 py-2.5 rounded-full transition-all duration-150 shadow-sm"
                        >
                          {isAdding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <span className="text-[15px] font-bold leading-none">+</span>
                          )}
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ══ RIGHT — Order Cart Panel ══ */}
          <div className="w-full lg:w-[370px] lg:sticky lg:top-[100px] flex-shrink-0 self-start">
            <div className="rounded-2xl p-5 shadow-sm" style={{ background: "#EEF2FF" }}>

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold text-gray-900">Order Carts</h3>
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
                              alt={item.product.name}
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
                              {item.product.name}
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
                                onClick={() =>
                                  handleQtyChange(item.id, item.quantity, -1)
                                }
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
                                onClick={() =>
                                  handleQtyChange(item.id, item.quantity, 1)
                                }
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
                  <span className="text-gray-700 text-[13px] font-semibold">
                    Coupon Code
                  </span>
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
                        localStorage.removeItem("appliedCoupon");
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
                    value: summary?.subtotal
                      ? `$${parseFloat(summary.subtotal).toFixed(2)}`
                      : "—",
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
                      className={`text-[13px] font-medium ${
                        accent ? "text-red-500" : "text-gray-800"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-gray-900 text-[15px] font-bold">Total</span>
                  <span className="text-[#2563EB] text-[17px] font-bold">
                    {summary?.total
                      ? `$${parseFloat(summary.total).toFixed(2)}`
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Recurring checkbox — controlled state so checkmark works */}
              <label className="flex items-start gap-2.5 mb-5 cursor-pointer select-none">
                <div
                  onClick={() => setRecurring((v) => !v)}
                  className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors cursor-pointer ${
                    recurring
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-blue-400"
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
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

              {/* Submit */}
              <Link
                href="/checkout"
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-[15px] font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-md block text-center"
              >
                Proceed to Submission
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page export ───────────────────────────────────────────────────────────────

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F7FF] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsInner />
    </Suspense>
  );
}
