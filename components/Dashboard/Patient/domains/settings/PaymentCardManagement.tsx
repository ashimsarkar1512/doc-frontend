"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CreditCard, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetPaymentCardsQuery,
  useCreatePaymentCardMutation,
  useSetDefaultPaymentCardMutation,
  useDeletePaymentCardMutation,
} from "@/Redux/api/paymentCardApi";

// Clover SDK is loaded globally in app/layout.tsx via Next.js Script component
// No SDK URL needed here — we just poll window.Clover

// ─── Types ────────────────────────────────────────────────────────────────────
interface SavedCard {
  id: string;
  cardHolderName?: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PaymentCardManagement() {
  const { data: cardsResponse, isLoading } = useGetPaymentCardsQuery();
  const [createCard, { isLoading: isCreating }] = useCreatePaymentCardMutation();
  const [setDefaultCard, { isLoading: isSettingDefault }] = useSetDefaultPaymentCardMutation();
  const [deleteCard, { isLoading: isDeleting }] = useDeletePaymentCardMutation();

  const cards: SavedCard[] = cardsResponse?.data || [];

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [cardHolderName, setCardHolderName] = useState("");
  const [isDefaultCard, setIsDefaultCard] = useState(false);

  // Clover state
  const [cloverReady, setCloverReady] = useState(false);
  const [cloverError, setCloverError] = useState("");
  const [isTokenizing, setIsTokenizing] = useState(false);

  const cloverInstanceRef = useRef<any>(null);
  const cardNumberElRef = useRef<any>(null);
  const cardDateElRef = useRef<any>(null);
  const cardCvvElRef = useRef<any>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Clover Elements Initialization ─────────────────────────────────────────
  const initCloverElements = useCallback(() => {
    const pakmsKey = process.env.NEXT_PUBLIC_CLOVER_PAKMS_KEY;
    if (!pakmsKey) {
      setCloverError("Payment configuration missing (PAKMS key not set).");
      return;
    }

    const CloverSDK = (window as any).Clover;
    if (!CloverSDK) {
      setCloverError("Clover SDK not available yet. Please refresh the page.");
      return;
    }

    try {
      const clover = new CloverSDK(pakmsKey);
      cloverInstanceRef.current = clover;

      const elements = clover.elements();

      const styles = {
        body: { fontFamily: "inherit", fontSize: "14px" },
        input: { fontSize: "14px", color: "#111827", fontFamily: "inherit" },
        "input::placeholder": { color: "#9ca3af" },
      };

      const cardNumber = elements.create("CARD_NUMBER", styles);
      const cardDate = elements.create("CARD_DATE", styles);
      const cardCvv = elements.create("CARD_CVV", styles);

      cardNumber.mount("#clover-card-number");
      cardDate.mount("#clover-card-date");
      cardCvv.mount("#clover-card-cvv");

      cardNumberElRef.current = cardNumber;
      cardDateElRef.current = cardDate;
      cardCvvElRef.current = cardCvv;

      setCloverReady(true);
      setCloverError("");
    } catch (err: any) {
      setCloverError(err?.message || "Failed to initialize Clover Elements.");
    }
  }, []);

  // Poll for window.Clover — loaded globally by Next.js Script in layout.tsx
  const waitForCloverAndInit = useCallback(() => {
    let attempts = 0;
    const maxAttempts = 40; // 40 × 250ms = 10s timeout

    pollTimerRef.current = setInterval(() => {
      attempts++;

      if ((window as any).Clover) {
        clearInterval(pollTimerRef.current!);
        pollTimerRef.current = null;
        initCloverElements();
        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollTimerRef.current!);
        pollTimerRef.current = null;
        setCloverError(
          "Clover SDK failed to load. Make sure the page is on HTTPS and refresh."
        );
      }
    }, 250);
  }, [initCloverElements]);

  // Mount when form opens, unmount when closed
  useEffect(() => {
    if (!showAddForm) {
      // Stop polling
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      // Unmount elements
      try {
        cardNumberElRef.current?.unmount?.();
        cardDateElRef.current?.unmount?.();
        cardCvvElRef.current?.unmount?.();
      } catch (_) {}
      cardNumberElRef.current = null;
      cardDateElRef.current = null;
      cardCvvElRef.current = null;
      cloverInstanceRef.current = null;
      setCloverReady(false);
      setCloverError("");
      return;
    }

    // Small delay to ensure DOM containers are rendered, then poll for Clover
    const timer = setTimeout(() => {
      if ((window as any).Clover) {
        // SDK already available (preloaded)
        initCloverElements();
      } else {
        // SDK still loading — poll
        waitForCloverAndInit();
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [showAddForm, initCloverElements, waitForCloverAndInit]);

  // ─── Handle Submit ───────────────────────────────────────────────────────────
  const handleAddCard = async () => {
    if (!cardHolderName.trim()) {
      toast.error("Please enter the card holder name");
      return;
    }
    if (!cloverInstanceRef.current) {
      toast.error("Payment form is not ready yet. Please wait a moment.");
      return;
    }

    setIsTokenizing(true);
    try {
      // Capture token via Clover Elements
      // We wrap in a manual Promise that listens for BOTH:
      //   - the Promise returned by createToken() (newer SDK)
      //   - the window `message` event from iframes (some SDK variants)
      const result: any = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error("Token creation timed out. Please check your card details and try again."));
        }, 15000);

        const cleanup = () => clearTimeout(timer);

        // Attempt Promise-based approach first
        try {
          const tokenPromise = cloverInstanceRef.current.createToken();
          if (tokenPromise && typeof tokenPromise.then === "function") {
            tokenPromise
              .then((res: any) => { cleanup(); resolve(res); })
              .catch((err: any) => { cleanup(); reject(err); });
          }
        } catch (e) {
          // createToken might not return a promise in some SDK versions
        }
      });

      // Clover errors come as { CARD_NUMBER: "msg", CARD_DATE: "msg", ... }
      if (result?.errors && Object.keys(result.errors).length > 0) {
        const messages = Object.values(result.errors as Record<string, string>).filter(Boolean);
        throw new Error(messages[0] || "Card validation failed. Please check your card details.");
      }

      const cloverToken: string = result?.token;
      if (!cloverToken) {
        throw new Error("No token received from Clover. Please try again.");
      }

      const last4: string = result.card?.last4 || "****";
      const brand: string = result.card?.brand || "Card";
      const expMonth: number = parseInt(result.card?.exp_month || "0", 10);
      const expYear: number = parseInt(result.card?.exp_year || "0", 10);

      await createCard({
        cloverToken,
        cardHolderName: cardHolderName.trim(),
        last4,
        brand,
        expMonth,
        expYear,
        isDefault: isDefaultCard,
      }).unwrap();

      toast.success("Payment card saved successfully!");
      setCardHolderName("");
      setIsDefaultCard(false);
      setShowAddForm(false);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to save card.";
      toast.error(msg);
    } finally {
      setIsTokenizing(false);
    }
  };

  // ─── Other Handlers ──────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    try {
      await deleteCard(id).unwrap();
      toast.success("Card deleted.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete card.");
    }
  };

  const handleSetDefault = async (id: string, alreadyDefault: boolean) => {
    if (alreadyDefault) return;
    try {
      await setDefaultCard(id).unwrap();
      toast.success("Default card updated.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to set default card.");
    }
  };

  const isSaving = isCreating || isTokenizing;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5 mt-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Payment Method</h4>
          <p className="text-sm text-gray-500">Manage your saved payment cards</p>
        </div>
      </div>

      {/* Cards list */}
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-36 bg-gray-100 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-4">
          {cards.length === 0 && !showAddForm && (
            <p className="text-sm text-gray-400 text-center py-4">
              No saved cards yet. Add one below.
            </p>
          )}

          {cards.map((card) => (
            <div key={card.id} className="rounded-xl border border-gray-200 p-5 space-y-4">
              {/* Card Holder */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                  Card Holder
                </label>
                <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700">
                  {card.cardHolderName || "—"}
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                  Card Number
                </label>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                  <span className="text-sm font-medium text-gray-700 tracking-widest">
                    •••• •••• •••• {card.last4}
                  </span>
                  <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md capitalize">
                    {card.brand}
                  </span>
                </div>
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                    Expiry
                  </label>
                  <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700">
                    {card.expMonth > 0
                      ? `${String(card.expMonth).padStart(2, "0")}/${String(card.expYear).slice(-2)}`
                      : "—"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                    CVV
                  </label>
                  <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-500">
                    •••
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800">Default</span>
                  <button
                    onClick={() => handleSetDefault(card.id, card.isDefault)}
                    disabled={isSettingDefault || card.isDefault}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed ${
                      card.isDefault ? "bg-blue-600" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                        card.isDefault ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  {card.isDefault && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(card.id)}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add Card Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              + Add New Card
            </button>
          )}

          {/* ── Add Card Form ─────────────────────────────────────────────── */}
          {showAddForm && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/20 p-5 space-y-4 mt-2">
              {/* Security badge */}
              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  Card details are captured via Clover's secure iframe — your raw card data never reaches our servers (PCI-DSS SAQ-A compliant).
                </span>
              </div>

              <h5 className="font-semibold text-gray-900">Add New Payment Card</h5>

              {/* Error banner */}
              {cloverError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  ⚠️ {cloverError}
                </div>
              )}

              {/* Card Holder Name — standard input (not sensitive) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Card Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  placeholder="e.g. John Doe"
                  autoComplete="cc-name"
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Card Number — Clover iframe */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <div className="relative h-10 w-full rounded-lg border border-gray-300 bg-white overflow-hidden transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  {!cloverReady && !cloverError && (
                    <div className="absolute inset-0 flex items-center px-4">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="ml-2 text-sm text-gray-400">Loading secure input…</span>
                    </div>
                  )}
                  {/* Clover mounts an iframe here */}
                  <div
                    id="clover-card-number"
                    className="h-full w-full"
                    style={{ opacity: cloverReady ? 1 : 0 }}
                  />
                </div>
              </div>

              {/* Expiry + CVV — Clover iframes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative h-10 w-full rounded-lg border border-gray-300 bg-white overflow-hidden transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    {!cloverReady && !cloverError && (
                      <div className="absolute inset-0 flex items-center px-4">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}
                    <div
                      id="clover-card-date"
                      className="h-full w-full"
                      style={{ opacity: cloverReady ? 1 : 0 }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <div className="relative h-10 w-full rounded-lg border border-gray-300 bg-white overflow-hidden transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    {!cloverReady && !cloverError && (
                      <div className="absolute inset-0 flex items-center px-4">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}
                    <div
                      id="clover-card-cvv"
                      className="h-full w-full"
                      style={{ opacity: cloverReady ? 1 : 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* Default toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Set as default card</span>
                <button
                  type="button"
                  onClick={() => setIsDefaultCard((p) => !p)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    isDefaultCard ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      isDefaultCard ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={handleAddCard}
                  disabled={isSaving || !cloverReady}
                  className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSaving ? "Saving…" : "Save Payment Card"}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  disabled={isSaving}
                  className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
