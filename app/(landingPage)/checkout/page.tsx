"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { ShieldCheck, ChevronDown, Trash2 } from "lucide-react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  sizes: string[];
  quantity: number;
};

const INITIAL_CART: CartItem[] = [
  { id: 2, name: "Phentermine", price: 48, image: "/medicine-2.png", selectedSize: "37.5mg", sizes: ["20mg", "37.5mg", "45mg"], quantity: 1 },
  { id: 9, name: "Vitamin C Ascorbic Acid", price: 48, image: "/medicine-5.png", selectedSize: "10ml", sizes: ["10ml", "15ml", "30ml"], quantity: 1 },
];

const SERVICE_FEE     = 50;
const SHIPPING        = 20;
const BASE_DISCOUNT   = 15;
const PROMO: Record<string, number> = { SUMMER2026: 15, WELCOME10: 10 };

export default function CheckoutPage() {
  const [cart, setCart]               = useState<CartItem[]>(INITIAL_CART);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("SUMMER2026");
  const [discount, setDiscount]       = useState(BASE_DISCOUNT);
  const [recurring, setRecurring]     = useState(true);

  // compliance checkboxes
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [certifyInfo, setCertifyInfo] = useState(true);
  const [understandFalseInfo, setUnderstandFalseInfo] = useState(true);
  const [understandTreatment, setUnderstandTreatment] = useState(true);
  const [understandAdditional, setUnderstandAdditional] = useState(true);

  const remove = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));
  const changeQty = (id: number, delta: number) =>
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (PROMO[code] !== undefined) { setAppliedCoupon(code); setDiscount(PROMO[code]); }
  };

  const subtotal  = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total     = subtotal + SERVICE_FEE + SHIPPING - discount;
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar variant="dark" />

      <div className="pt-32 pb-16 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* LEFT: Checkout Form */}
          <div className="flex-1 min-w-0 w-full">
            <h1 className="text-[26px] font-bold text-gray-900 mb-1">Checkout</h1>
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-gray-700 mb-8">Pay to checkout and submit for approval</h2>

            {/* Shipping Info */}
            <div className="mb-10">
              <h2 className="text-[18px] font-bold text-gray-900 mb-4">Shipping Info:</h2>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">Full Name:</label>
                  <input type="text" defaultValue="Alan Cattach" className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 outline-none" />
                </div>
                
                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">Contact Number</label>
                  <input type="text" defaultValue="+1 234 567890" className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 outline-none" />
                </div>
                
                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">Address</label>
                  <input type="text" defaultValue="4140 Parker Rd. Allentown" className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 outline-none" />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-800 text-[14px] font-medium mb-1.5">City</label>
                    <input type="text" defaultValue="Allentown" className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-800 text-[14px] font-medium mb-1.5">State</label>
                    <div className="relative">
                      <select className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 appearance-none outline-none">
                        <option>NM</option>
                        <option>NY</option>
                        <option>CA</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-800 text-[14px] font-medium mb-1.5">Zip</label>
                    <input type="text" defaultValue="31134" className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 outline-none" />
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
                      <path d="M12 2C9.5 2 7 4 7 6.5C7 7.5 7.5 8.5 8 9.5C6 9 4 9 2.5 10.5C1.5 11.5 1.5 13.5 3 15C4.5 16.5 6.5 16.5 7.5 15.5C8.5 14.5 9 13.5 9.5 12C9.5 14 9.5 16 9.5 18H14.5C14.5 16 14.5 14 14.5 12C15 13.5 15.5 14.5 16.5 15.5C17.5 16.5 19.5 16.5 21 15C22.5 13.5 22.5 11.5 21.5 10.5C20 9 18 9 16 9.5C16.5 8.5 17 7.5 17 6.5C17 4 14.5 2 12 2Z"/>
                    </svg>
                    clover
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">Payment Method</label>
                  <div className="relative">
                    <select className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 appearance-none outline-none">
                      <option>Default card</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">Card Holder Name</label>
                  <input type="text" defaultValue="Alan Cattach" className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 outline-none" />
                </div>
                
                <div>
                  <label className="block text-gray-800 text-[14px] font-medium mb-1.5">Card Number</label>
                  <input type="text" defaultValue="**** **** **** 3456" className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 outline-none" />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-800 text-[14px] font-medium mb-1.5">Expired Date</label>
                    <input type="text" defaultValue="12/26" className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-800 text-[14px] font-medium mb-1.5">CVV</label>
                    <input type="text" defaultValue="123" className="w-full bg-[#F3F4F6] text-gray-700 text-[14px] rounded-lg px-4 py-3 outline-none" />
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
                Before completing your submission, please confirm you understand the following important information about our telemedicine service:
              </p>

              <div className="flex flex-col gap-3 mb-6">
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} className="w-4 h-4 accent-blue-600 shrink-0" />
                  <span className="text-gray-700 text-[14px]">I have reviewed and agree to the <span className="font-bold underline">Terms of Service and Privacy Policy.</span></span>
                </label>
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={certifyInfo} onChange={(e) => setCertifyInfo(e.target.checked)} className="w-4 h-4 accent-blue-600 shrink-0" />
                  <span className="text-gray-700 text-[14px]">I certify that all information provided is accurate and complete.</span>
                </label>
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={understandFalseInfo} onChange={(e) => setUnderstandFalseInfo(e.target.checked)} className="w-4 h-4 accent-blue-600 shrink-0" />
                  <span className="text-gray-700 text-[14px]">I understand that providing false or misleading information may result in denial of treatment.</span>
                </label>
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={understandTreatment} onChange={(e) => setUnderstandTreatment(e.target.checked)} className="w-4 h-4 accent-blue-600 shrink-0" />
                  <span className="text-gray-700 text-[14px]">I understand that treatment recommendations are based on the information I have provided.</span>
                </label>
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={understandAdditional} onChange={(e) => setUnderstandAdditional(e.target.checked)} className="w-4 h-4 accent-blue-600 shrink-0" />
                  <span className="text-gray-700 text-[14px]">I understand that additional information may be requested before treatment is approved.</span>
                </label>
              </div>

              <div className="bg-[#EBF1FF] text-[#3B82F6] text-[14px] rounded-lg p-4 font-medium">
                All checkboxes are required. This disclosure is maintained for HIPAA and telemedicine compliance purposes.
              </div>
            </div>

          </div>

          {/* RIGHT: Order Summary Panel */}
          <div className="w-full lg:w-[380px] lg:sticky lg:top-[110px] flex-shrink-0 self-start">
            <div className="bg-[#F3F6FA] rounded-2xl p-6">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-5 border-b border-[#1D4ED8] pb-3 border-opacity-30">
                <h3 className="text-[18px] font-bold text-gray-900">Order Summery</h3>
                {itemCount > 0 && (
                  <span className="bg-[#DEE7FB] text-blue-600 text-[11px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                    {itemCount} ITEM{itemCount !== 1 ? "S" : ""}
                  </span>
                )}
              </div>

              {/* Cart items */}
              {cart.length === 0 ? (
                <p className="text-gray-400 text-[13px] text-center py-8">Your cart is empty.</p>
              ) : (
                <div className="flex flex-col gap-4 mb-5">
                  {cart.map((item) => (
                    <div key={item.id} className="py-2 flex gap-3">
                      {/* thumb */}
                      <div className="relative w-[52px] h-[52px] flex-shrink-0 rounded-lg overflow-hidden" style={{ backgroundColor: "#292C2D" }}>
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="52px" />
                      </div>

                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-gray-900 text-[15px] font-bold leading-tight">{item.name}</p>
                          <p className="text-[#2563EB] text-[14px] font-bold flex-shrink-0 ml-2">
                            ${(item.price * item.quantity).toFixed(0)}
                          </p>
                        </div>
                        <p className="text-gray-500 text-[12px] mt-0.5">Medium Rare, Bone Marrow Butter</p>

                        {/* sizes */}
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          <span className="text-gray-500 text-[11px] mr-1">Size:</span>
                          {item.sizes.map((s) => (
                            <span
                              key={s}
                              className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                                s === item.selectedSize
                                  ? "bg-[#2563EB] text-white"
                                  : "bg-[#E2E8F0] text-gray-600"
                              }`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* qty + remove text button */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => changeQty(item.id, -1)}
                              className="w-5 h-5 rounded-full bg-[#E2E8F0] hover:bg-gray-300 text-gray-600 flex items-center justify-center text-[13px] font-bold"
                            >−</button>
                            <span className="text-gray-800 text-[13px] font-semibold w-3 text-center">{item.quantity}</span>
                            <button
                              onClick={() => changeQty(item.id, 1)}
                              className="w-5 h-5 rounded-full bg-[#E2E8F0] hover:bg-gray-300 text-gray-600 flex items-center justify-center text-[13px] font-bold"
                            >+</button>
                          </div>

                          <button
                            onClick={() => remove(item.id)}
                            title="Remove item"
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Discount — Groupon row */}
              <div className="mb-4 mt-6">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-gray-800 text-[14px] font-bold">Discount :</span>
                  <span className="text-gray-500 text-[13px] ml-1">Powered by:</span>
                  <span className="text-[#00A651] text-[13px] font-extrabold tracking-wide ml-1">GROUPON</span>
                </div>

                {/* Coupon dropdown row */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 flex items-center justify-between bg-[#E2E8F0] border border-transparent rounded-lg px-4 py-2.5">
                    <span className="text-gray-700 text-[13px] font-medium">{appliedCoupon}</span>
                    <div className="bg-[#2563EB] rounded px-1.5 py-1">
                      <ChevronDown className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="bg-[#D1D5DB] text-gray-800 text-[13px] font-semibold px-5 py-2.5 rounded-lg"
                  >
                    Applied
                  </button>
                </div>

                {/* Coupon code input */}
                <p className="text-gray-800 text-[14px] font-bold mb-2">Coupon Code:</p>
                <div className="bg-[#E2E8F0] rounded-lg px-4 py-3">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Enter coupon"
                    className="w-full bg-transparent text-[13px] text-gray-600 placeholder-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#1D4ED8] my-4 opacity-40" />

              {/* Price rows */}
              <div className="flex flex-col gap-3 mb-5">
                {[
                  { label: "Subtotal",         value: `$${subtotal.toFixed(2)}` },
                  { label: "Service Duration", value: "1 month" },
                  { label: "Service Fees",     value: `$${SERVICE_FEE.toFixed(2)}` },
                  { label: "Shipping charge",  value: `$${SHIPPING.toFixed(2)}` },
                  { label: "Discount",         value: `- $${discount.toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-600 text-[14px]">{label}</span>
                    <span className="text-gray-800 text-[14px] font-medium">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t border-[#1D4ED8] mt-1 border-opacity-40">
                  <span className="text-gray-900 text-[16px] font-bold mt-1">Total</span>
                  <span className="text-[#2563EB] text-[16px] font-bold mt-1">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Recurring checkbox */}
              <label className="flex items-center gap-2 mb-6 cursor-pointer mt-5">
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <span className="text-gray-700 text-[14px]">
                  Active monthly <span className="underline font-semibold hover:text-blue-600 cursor-pointer">recurring subscriptions</span>
                </span>
              </label>

              {/* Submit button */}
              <Link href="/previewdetails" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-[16px] font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-sm block text-center">
                Preview & Submit
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
