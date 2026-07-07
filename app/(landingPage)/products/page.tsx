"use client";

import { useState, Suspense, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Trash2, ShoppingCart, Tag, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import FadeIn from "@/components/shared/animations/FadeIn";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useGetProductsByCategoryIdQuery,
  useGetProductByIdQuery,
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
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // ── Groupon state (dummy) ──
  const [grouponCode, setGrouponCode] = useState("SUMMER2026");
  const [grouponApplied, setGrouponApplied] = useState(false);
  const [showGrouponDropdown, setShowGrouponDropdown] = useState(false);
  const [grouponMessage, setGrouponMessage] = useState("");

  const handleApplyGroupon = () => {
    setGrouponMessage("Groupon Coming Soon!");
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

  useEffect(() => {
    if (!summaryFetching) {
      setIsApplyingCoupon(false);
    }
  }, [summaryFetching]);

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

  // ── Optimistic UI State ──
  const [optimisticSizes, setOptimisticSizes] = useState<Record<string, string>>({});

  // ── View Details State ──
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { data: productDetailsData, isLoading: detailsLoading } = 
    useGetProductByIdQuery(selectedProduct?.id ?? "", { skip: !selectedProduct?.id });
    
  // Handle case where API response is either wrapped in 'data' or is the direct object
  const displayProduct = productDetailsData?.data || productDetailsData || selectedProduct;

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

  return (
    <div className="min-h-screen" style={{ background: "#F4F7FF" }}>
      <Navbar variant="dark" />

      <div className="pt-36 pb-16 max-w-[1520px] mx-auto px-4 sm:px-6">

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ══ LEFT — Product Grid ══ */}
          <div className="flex-1 min-w-0 w-full">
            <FadeIn>
            {selectedProduct ? (
              <>
                <div className="mb-8 flex items-center gap-2">
                  <button onClick={() => setSelectedProduct(null)} className="text-[#191B1C] font-[Quicksand] text-[24px] font-bold flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    {(displayProduct?.title || displayProduct?.name)} details
                  </button>
                  {detailsLoading && <Loader2 className="w-5 h-5 animate-spin text-blue-600 ml-2" />}
                </div>
                
                <div className="w-[348px] h-[246px] rounded-[20px] overflow-hidden flex items-center justify-center p-4 mb-6 shadow-sm flex-shrink-0" style={{ backgroundColor: "#292C2D" }}>
                  <Image 
                    src={displayProduct?.image?.fileUrl || displayProduct?.image || "/medicine-1.png"} 
                    alt={displayProduct?.title || displayProduct?.name || "Product"} 
                    width={300} 
                    height={300} 
                    unoptimized 
                    className="w-full h-full object-contain p-6 drop-shadow-xl" 
                  />
                </div>

                <div className="mb-8 text-[#3B3B3B] font-[Quicksand] text-[20px] font-semibold leading-none">
                  Available size:{" "}
                  <span className="font-normal">
                    {displayProduct?.variants && displayProduct.variants.length > 0 
                      ? displayProduct.variants.map((v: any) => v.size).filter(Boolean).join(" / ")
                      : "Standard"}
                  </span>
                </div>

                <div className="w-full">
                  <div 
                    className="product-description quill-content" 
                    dangerouslySetInnerHTML={{ __html: (displayProduct?.description || "").replace(/&nbsp;/g, " ") }} 
                  />
                </div>
              </>
            ) : (
              <>
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
                      className="flex flex-col gap-3"
                    >
                      {/* Image */}
                      <div
                        className="relative w-full rounded-[16px] overflow-hidden flex items-center justify-center p-4"
                        style={{ backgroundColor: "#292C2D", aspectRatio: "113/80" }}
                      >
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          unoptimized
                          className="object-contain p-6 drop-shadow-xl"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-[10px] mt-1">
                        <h3 style={{ color: "#272628", fontFamily: "Quicksand, sans-serif", fontSize: "20px", fontWeight: 700, lineHeight: "100%" }} className="truncate">
                          {p.name}
                        </h3>
                        <p style={{ color: "#1D4ED8", fontFamily: "Quicksand, sans-serif", fontSize: "20px", fontWeight: 700, lineHeight: "100%" }}>
                          ${parseFloat(p.price).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-4 mt-1">
                          <button
                            onClick={() => handleAddToCart(p)}
                            disabled={isAdding}
                            style={{ background: "#1D4ED8", height: "34px" }}
                            className="flex items-center justify-center gap-[5px] px-4 py-1 rounded-[50px] disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 text-white transition-all shadow-sm"
                          >
                            {isAdding ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <span className="text-[16px] font-bold leading-none mb-[2px]">+</span>
                            )}
                            <span className="text-[14px] font-semibold font-[Quicksand]">Add to cart</span>
                          </button>
                          
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="text-[#1D4ED8] font-[Quicksand] text-[14px] font-semibold underline underline-offset-4 decoration-solid hover:text-blue-800 transition-colors"
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            </>
            )}
            </FadeIn>
          </div>

          {/* ══ RIGHT — Order Cart Panel ══ */}
          <div className="w-full lg:w-[450px] lg:sticky lg:top-[140px] flex-shrink-0 self-start">
            <FadeIn delay={0.2} yOffset={20}>
            <div className="rounded-2xl p-7 shadow-sm" style={{ background: "#EAF3FF", fontFamily: "Quicksand, sans-serif" }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#191B1C] font-[Quicksand] text-[26px] font-bold leading-[1.2]">Order Carts</h3>
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
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-2">
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

              <div className="border-b border-[#1D4ED8] opacity-80 mb-3 mt-4 w-full" />

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


              {/* Recurring checkbox — controlled state so checkmark works */}
              <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
                <div
                  onClick={() => setRecurring((v) => !v)}
                  className={`mt-1 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors cursor-pointer ${recurring
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-blue-400"
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
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

              {/* Submit */}
              <Link
                href="/checkout"
                className="flex py-[12px] px-[16px] justify-center items-center gap-[15px] self-stretch rounded-[46px] bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-[Quicksand] text-[20px] font-bold transition-colors w-full disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Proceed to Submission
              </Link>
            </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page export ───────────────────────────────────────────────────────────────

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F4F7FF] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ProductsInner />
      </Suspense>
    </ProtectedRoute>
  );
}
