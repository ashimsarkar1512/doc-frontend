"use client";
import { Edit2, X } from "lucide-react";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CreditCard, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetPaymentCardsQuery,
  useCreatePaymentCardMutation,
  useSetDefaultPaymentCardMutation,
  useUpdatePaymentCardMutation,
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
  const [updateCard, { isLoading: isUpdating }] = useUpdatePaymentCardMutation();
  const [deleteCard, { isLoading: isDeleting }] = useDeletePaymentCardMutation();

  const cards: SavedCard[] = cardsResponse?.data || [];

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [cardHolderName, setCardHolderName] = useState("");
  const [isDefaultCard, setIsDefaultCard] = useState(false);

  // Edit / Delete state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ cardHolderName: "", expMonth: "", expYear: "" });
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  // Clover state
  const [cloverReady, setCloverReady] = useState(false);
  const [cloverError, setCloverError] = useState("");
  const [isTokenizing, setIsTokenizing] = useState(false);

  const cloverInstanceRef = useRef<any>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Clover elements only once when the component mounts
  const initCloverElements = useCallback(() => {
    const pakmsKey = process.env.NEXT_PUBLIC_CLOVER_PAKMS_KEY;
    if (cloverReady) return;

    const CloverSDK = (window as any).Clover;
    if (!CloverSDK) {
      setCloverError("Clover SDK not available yet. Please refresh the page.");
      return;
    }

    try {
      const merchantId = process.env.NEXT_PUBLIC_CLOVER_MERCHANT_ID;

      // CRITICAL FIX: Completely tear down any previous Clover SDK state
      // Clover creates a hidden iframe appended to document.body and attaches message listeners to window.
      // If we don't clean this up, the old hidden iframe swallows the tokenization response!
      document.querySelectorAll("iframe[name^='clover-']").forEach(iframe => iframe.remove());
      // Also remove the hidden messageElement iframe which has no name but has style 'height: 1px'
      document.querySelectorAll("iframe").forEach(iframe => {
        if (iframe.src.includes("checkout.sandbox.dev.clover.com") && iframe.style.height === "1px") {
          iframe.remove();
        }
      });
      if ((window as any)._cloverMessageHandler) {
        window.removeEventListener("message", (window as any)._cloverMessageHandler);
      }

      const clover = new CloverSDK(pakmsKey, { merchantId: merchantId || "" });
      cloverInstanceRef.current = clover;

      const elements = clover.elements();

      const styles = {
        body: {
          fontFamily: "inherit",
          fontSize: "14px",
          padding: "0",
          margin: "0",
        },
        input: {
          fontSize: "14px",
          color: "#111827",
          fontFamily: "inherit",
          width: "100%",
          height: "100%",
          padding: "10px 16px",
          boxSizing: "border-box",
        },
        "input::placeholder": { color: "#9ca3af" },
      };

      const cardNumber = elements.create("CARD_NUMBER", styles);
      const cardDate = elements.create("CARD_DATE", styles);
      const cardCvv = elements.create("CARD_CVV", styles);
      const cardPostalCode = elements.create("CARD_POSTAL_CODE", styles);

      // Clear containers before mounting just in case
      const ids = ["clover-card-number", "clover-card-date", "clover-card-cvv", "clover-card-postal-code"];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = "";
      });

      cardNumber.mount("#clover-card-number");
      cardDate.mount("#clover-card-date");
      cardCvv.mount("#clover-card-cvv");
      cardPostalCode.mount("#clover-card-postal-code");

      // Add event listeners for focus tracking
      [
        { el: cardNumber, name: 'number' },
        { el: cardDate, name: 'date' },
        { el: cardCvv, name: 'cvv' },
        { el: cardPostalCode, name: 'postal' }
      ].forEach(({ el, name }) => {
        el.addEventListener('focus', () => {
          document.getElementById(`clover-container-${name}`)?.classList.add('border-blue-500', 'ring-2', 'ring-blue-100');
          document.getElementById(`clover-container-${name}`)?.classList.remove('border-gray-300');
        });
        el.addEventListener('blur', () => {
          document.getElementById(`clover-container-${name}`)?.classList.remove('border-blue-500', 'ring-2', 'ring-blue-100');
          document.getElementById(`clover-container-${name}`)?.classList.add('border-gray-300');
        });
      });

      // Global message listener to see if iframe is sending errors SDK ignores
      const handleMessage = (e: MessageEvent) => {
        if (e.origin.includes('clover.com') && e.data) {
          try {
            const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
            if (data.type === 'clover_error' || data.error) console.log("[Clover PostMessage Error]", data);
          } catch (_) { }
        }
      };
      window.addEventListener("message", handleMessage);
      (window as any)._cloverMessageHandler = handleMessage;

      setCloverReady(true);
      setCloverError("");
    } catch (err: any) {
      setCloverError(err?.message || "Failed to initialize Clover Elements.");
    }
  }, [cloverReady]);

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
        setCloverError("Clover SDK load timeout. Please check your connection.");
      }
    }, 250);
  }, [initCloverElements]);

  // Mount permanently on component load, but WAIT for isLoading to be false
  // so the DOM elements actually exist and aren't hidden by the loading spinner!
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if ((window as any).Clover) {
        initCloverElements();
      } else {
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
  }, [isLoading, initCloverElements, waitForCloverAndInit]);

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
      const tokenPromise = cloverInstanceRef.current.createToken({ name: cardHolderName.trim() });

      const result: any = await Promise.race([
        tokenPromise,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Token creation timed out. Please check your card details and try again.")),
            15000
          )
        ),
      ]);

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

  const handleDelete = (id: string) => {
    setCardToDelete(id);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;
    try {
      await deleteCard(cardToDelete).unwrap();
      toast.success("Card deleted.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete card.");
    } finally {
      setCardToDelete(null);
    }
  };

  const startEdit = (card: SavedCard) => {
    setEditingCardId(card.id);
    setEditData({
      cardHolderName: card.cardHolderName || "",
      expMonth: card.expMonth ? String(card.expMonth).padStart(2, '0') : "",
      expYear: card.expYear ? String(card.expYear).slice(-2) : "",
    });
  };

  const handleUpdateCard = async () => {
    if (!editingCardId) return;
    try {
      await updateCard({
        id: editingCardId,
        data: {
          cardHolderName: editData.cardHolderName,
          expMonth: parseInt(editData.expMonth || "0", 10),
          expYear: parseInt(editData.expYear ? "20" + editData.expYear : "0", 10),
        },
      }).unwrap();
      toast.success("Card updated successfully.");
      setEditingCardId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update card.");
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5 mt-6">
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

          {cards.map((card) => {
            const isEditing = editingCardId === card.id;

            return (
              <div key={card.id} className="rounded-xl border border-gray-200 p-5 space-y-4">
                {/* Card Holder */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                    Card Holder
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.cardHolderName}
                      onChange={(e) => setEditData(prev => ({ ...prev, cardHolderName: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700">
                      {card.cardHolderName || "—"}
                    </div>
                  )}
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
                      Expiry (MM/YY)
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={
                          (editData.expMonth ? editData.expMonth.padStart(2, '0') : "") +
                          (editData.expYear ? (editData.expMonth ? "/" : "") + editData.expYear.slice(-2) : "")
                        }
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d/]/g, '');
                          const parts = val.split('/');
                          let mm = parts[0] || "";
                          let yy = parts[1] || "";
                          
                          // Auto format MM/YY
                          if (mm.length === 2 && !val.includes('/') && e.target.value.length === 3) {
                              yy = e.target.value[2];
                          }

                          setEditData(prev => ({
                            ...prev,
                            expMonth: mm.slice(0, 2),
                            expYear: yy.slice(0, 2),
                          }));
                        }}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700">
                        {card.expMonth > 0
                          ? `${String(card.expMonth).padStart(2, "0")}/${String(card.expYear).slice(-2)}`
                          : "—"}
                      </div>
                    )}
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
                      disabled={isSettingDefault || card.isDefault || isEditing}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed ${card.isDefault ? "bg-blue-600" : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${card.isDefault ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>
                    {card.isDefault && (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleUpdateCard}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCardId(null)}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(card)}
                          disabled={isDeleting || isSettingDefault || isUpdating}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          disabled={isDeleting || isSettingDefault || isUpdating}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Add Card Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              + Add New Card
            </button>
          )}

          {/* ── Add Card Form (ALWAYS IN DOM to prevent Clover SDK crashes) ─────────────────────────────────────────────── */}
          <div className={`rounded-xl border border-blue-200 bg-blue-50/20 p-5 space-y-4 mt-2 ${showAddForm ? 'block' : 'hidden'}`}>
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
              <div id="clover-container-number" className="relative h-10 w-full rounded-lg border border-gray-300 bg-white overflow-hidden transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                {!cloverReady && !cloverError && (
                  <div className="absolute inset-0 flex items-center px-4">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-400">Loading secure input…</span>
                  </div>
                )}
                <div id="clover-card-number" className="absolute inset-0"></div>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Expiry Date, CVV, Postal Code */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <div id="clover-container-date" className="relative h-10 w-full rounded-lg border border-gray-300 bg-white overflow-hidden transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <div id="clover-card-date" className="absolute inset-0"></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  CVV <span className="text-red-500">*</span>
                </label>
                <div id="clover-container-cvv" className="relative h-10 w-full rounded-lg border border-gray-300 bg-white overflow-hidden transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <div id="clover-card-cvv" className="absolute inset-0"></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  ZIP / Postal Code <span className="text-red-500">*</span>
                </label>
                <div id="clover-container-postal" className="relative h-10 w-full rounded-lg border border-gray-300 bg-white overflow-hidden transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <div id="clover-card-postal-code" className="absolute inset-0"></div>
                </div>
              </div>
            </div>

            {/* Default toggle */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-semibold text-gray-800">Set as default card</span>
              <button
                onClick={() => setIsDefaultCard(!isDefaultCard)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${isDefaultCard ? "bg-blue-600" : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${isDefaultCard ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleAddCard}
                disabled={isSaving || !cloverReady}
                className="flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Saving…" : "Save Payment Card"}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setCardHolderName("");
                }}
                disabled={isSaving}
                className="rounded-full bg-white border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                Delete Payment Card
              </h3>
              <button
                onClick={() => setCardToDelete(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete this payment card? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setCardToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
