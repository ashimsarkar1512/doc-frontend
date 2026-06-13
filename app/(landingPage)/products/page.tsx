"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { Trash2 } from "lucide-react";
import Link from "next/link";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  sizes: string[];
  quantity: number;
};

const PRODUCTS = [
  { id: 1, name: "Ozempic®",                 price: 39.99, image: "/medicine-1.png", sizes: ["0.25mg", "0.5mg", "1mg"] },
  { id: 2, name: "Phentermine",              price: 39.99, image: "/medicine-2.png", sizes: ["15mg", "30mg", "37.5mg"] },
  { id: 3, name: "Phendimetrazine",          price: 39.99, image: "/medicine-2.png", sizes: ["17.5mg", "35mg"] },
  { id: 4, name: "Diethylpropion",           price: 39.99, image: "/medicine-3.png", sizes: ["25mg", "75mg"] },
  { id: 5, name: "Hydroxocobalamin",         price: 39.99, image: "/medicine-4.png", sizes: ["0.5ml", "1ml", "5ml"] },
  { id: 6, name: "Vitamin D Intramuscular",  price: 39.99, image: "/medicine-1.png", sizes: ["1ml", "2ml"] },
  { id: 7, name: "B12 Injections",           price: 39.99, image: "/medicine-3.png", sizes: ["0.5ml", "1ml"] },
  { id: 8, name: "Lipotropic Injections",    price: 39.99, image: "/medicine-4.png", sizes: ["1ml", "2ml"] },
  { id: 9, name: "Vitamin C Ascorbic Acid",  price: 39.99, image: "/medicine-5.png", sizes: ["5ml", "15ml", "30ml"] },
];

const SERVICE_FEE     = 50;
const SHIPPING        = 20;
const BASE_DISCOUNT   = 15;
const PROMO: Record<string, number> = { SUMMER2026: 15, WELCOME10: 10 };


export default function ProductsPage() {
  const [cart, setCart]               = useState<CartItem[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("SUMMER2026");
  const [discount, setDiscount]       = useState(BASE_DISCOUNT);
  const [recurring, setRecurring]     = useState(true);

  /* ── helpers ── */
  const addToCart = (p: (typeof PRODUCTS)[number]) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === p.id);
      if (exists) return prev.map((i) => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: p.price, image: p.image, selectedSize: p.sizes[0], sizes: p.sizes, quantity: 1 }];
    });
  };

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
    <div className="min-h-screen bg-white">
      <Navbar variant="dark" />

      <div className="pt-36 pb-16 max-w-[1300px] mx-auto px-4 sm:px-6">

        {/* ── Page headings — full width, above the two-column layout ── */}
        <h1 className="text-[26px] font-bold text-gray-900 mb-1">Supplements</h1>
        <h2 className="text-[18px] font-semibold text-gray-700 mb-6">Available Weight Loss Medicine</h2>

        {/* ── Two-column layout starts below titles ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ═══════════════════════════════
              LEFT — Product Grid
          ═══════════════════════════════ */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="flex flex-col">
                  {/* Dark image card */}
                  <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#292C2D" }}>
                    <div className="flex items-center justify-center h-[190px] p-5" style={{ backgroundColor: "#292C2D" }}>
                      <div className="relative w-full h-full">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-contain drop-shadow-xl"
                          sizes="220px"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name, price, button — below the dark card */}
                  <div className="pt-3 px-1">
                    <p className="text-gray-900 text-[15px] font-semibold mb-0.5">{p.name}</p>
                    <p className="text-[#2563EB] text-[15px] font-semibold mb-3">${p.price.toFixed(2)}</p>
                    <button
                      onClick={() => addToCart(p)}
                      className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-150 shadow-sm"
                    >
                      <span className="text-[16px] leading-none font-bold">+</span>
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════
              RIGHT — Order Cart Panel
          ═══════════════════════════════ */}
          <div className="w-full lg:w-[360px] lg:sticky lg:top-[100px] flex-shrink-0 self-start">
            <div className="bg-[#EEF2FF] rounded-2xl p-5">

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-gray-900">Order Carts</h3>
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
                <div className="flex flex-col gap-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="py-2 flex gap-3">
                      {/* thumb */}
                      <div className="relative w-[52px] h-[52px] flex-shrink-0 rounded-lg overflow-hidden" style={{ backgroundColor: "#292C2D" }}>
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="52px" />
                      </div>

                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-gray-900 text-[13px] font-semibold leading-tight">{item.name}</p>
                          <p className="text-gray-900 text-[13px] font-bold flex-shrink-0 ml-2">
                            ${(item.price * item.quantity).toFixed(0)}
                          </p>
                        </div>
                        <p className="text-gray-400 text-[11px] mt-0.5">Medium Rare, Bone Marrow Butter</p>

                        {/* sizes */}
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          <span className="text-gray-400 text-[11px]">Size:</span>
                          {item.sizes.map((s) => (
                            <span
                              key={s}
                              className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                                s === item.selectedSize
                                  ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                                  : "bg-gray-50 text-gray-400 border-gray-200"
                              }`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* qty + delete icon */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => changeQty(item.id, -1)}
                              className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-[13px] font-bold"
                            >−</button>
                            <span className="text-gray-800 text-[12px] font-semibold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => changeQty(item.id, 1)}
                              className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-[13px] font-bold"
                            >+</button>
                          </div>

                          {/* ── Delete icon instead of "Remove" text ── */}
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

              {/* Divider */}
              <div className="border-t border-[#1D4ED8] my-4" />

              {/* Discount — Groupon row */}
              <div className="mb-3">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-gray-700 text-[13px] font-medium">Discount :</span>
                  <span className="text-gray-500 text-[12px] ml-1">Powered by</span>
                  <span className="text-[#00A651] text-[13px] font-extrabold tracking-wide ml-1">GROUPON</span>
                </div>

                {/* Coupon dropdown row */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <span className="text-gray-700 text-[13px]">{appliedCoupon}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Coupon code input */}
                <p className="text-gray-700 text-[13px] font-medium mb-1.5">Coupon Code:</p>
                <div className="bg-gray-100 rounded-lg px-3 py-2.5">
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
              <div className="border-t border-[#1D4ED8] my-4" />

              {/* Price rows */}
              <div className="flex flex-col gap-2.5 mb-4">
                {[
                  { label: "Subtotal",         value: `$${subtotal.toFixed(2)}` },
                  { label: "Service Duration", value: "1 month" },
                  { label: "Service Fees",     value: `$${SERVICE_FEE.toFixed(2)}` },
                  { label: "Shipping charge",  value: `$${SHIPPING.toFixed(2)}` },
                  { label: "Discount",         value: `- $${discount.toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-600 text-[13px]">{label}</span>
                    <span className="text-gray-800 text-[13px] font-medium">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-0.5">
                  <span className="text-gray-900 text-[15px] font-bold">Total</span>
                  <span className="text-[#2563EB] text-[16px] font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Recurring checkbox */}
              <label className="flex items-center gap-2 mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 text-[13px]">
                  Active monthly <span className="underline font-medium">recurring subscriptions</span>
                </span>
              </label>

              {/* Submit button */}
              <Link href="/checkout" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-[15px] font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-sm block text-center">
                Proceed to Submission
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
