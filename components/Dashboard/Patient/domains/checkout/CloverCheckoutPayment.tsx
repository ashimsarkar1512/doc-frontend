"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, CreditCard, ChevronDown } from "lucide-react";
import { useGetPaymentCardsQuery } from "@/Redux/api/paymentCardApi";

interface CloverCheckoutPaymentProps {
  onPaymentReady: (paymentData: { cloverToken?: string; savedCardId?: string; cardHolderName?: string; isReady: boolean }) => void;
  cloverInstanceRef: React.MutableRefObject<any>;
}

export default function CloverCheckoutPayment({ onPaymentReady, cloverInstanceRef }: CloverCheckoutPaymentProps) {
  const { data: cardsResponse, isLoading: isLoadingCards } = useGetPaymentCardsQuery();
  const cards = cardsResponse?.data || [];
  const defaultCard = cards.find((c: any) => c.isDefault) || cards[0];

  const [selectedMethod, setSelectedMethod] = useState<string>("new");
  const [cardName, setCardName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  const [cloverReady, setCloverReady] = useState(false);
  const [cloverError, setCloverError] = useState("");
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (cards.length > 0 && !initializedRef.current) {
      setSelectedMethod(defaultCard.id);
      onPaymentReady({ savedCardId: defaultCard.id, isReady: true });
    }
  }, [cards, defaultCard]);

  
  useEffect(() => {
     if (selectedMethod === "new") {
        onPaymentReady({ isReady: true, cardHolderName: cardName });
     }
  }, [selectedMethod, cardName]);

  
  const initCloverElements = useCallback(() => {
    if (typeof window === "undefined" || !(window as any).Clover) return;

    const pakmsKey = process.env.NEXT_PUBLIC_CLOVER_PAKMS_KEY;
    if (!pakmsKey) {
      setCloverError("Missing Clover configuration.");
      return;
    }

    try {
      const merchantId = process.env.NEXT_PUBLIC_CLOVER_MERCHANT_ID;
      document.querySelectorAll("iframe").forEach(iframe => {
        if (iframe.src.includes("checkout.sandbox.dev.clover.com") && iframe.style.height === "1px") {
          iframe.remove();
        }
      });
      if ((window as any)._cloverMessageHandler) {
        window.removeEventListener("message", (window as any)._cloverMessageHandler);
      }
      const clover = new (window as any).Clover(pakmsKey, { merchantId: merchantId || "" });
      cloverInstanceRef.current = clover;

      const elements = clover.elements();

      const styles = {
        body: { fontFamily: "'Quicksand', sans-serif", fontSize: "16px", padding: "0", margin: "0", backgroundColor: "transparent" },
        input: { 
           fontSize: "16px", 
           color: "#3B3B3B", 
           fontFamily: "'Quicksand', sans-serif", 
           width: "100%", 
           height: "100%", 
           padding: "16px 16px", 
           boxSizing: "border-box",
           backgroundColor: "transparent"
        },
        "input::placeholder": { color: "#3B3B3B", opacity: "0.7", fontWeight: "400" },
      };

      const cardNumber = elements.create("CARD_NUMBER", styles);
      const cardDate = elements.create("CARD_DATE", styles);
      const cardCvv = elements.create("CARD_CVV", styles);
      const cardPostal = elements.create("CARD_POSTAL_CODE", styles);

      const ids = ["checkout-clover-card-number", "checkout-clover-card-date", "checkout-clover-card-cvv", "checkout-clover-card-postal"];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = "";
      });

      cardNumber.mount("#checkout-clover-card-number");
      cardDate.mount("#checkout-clover-card-date");
      cardCvv.mount("#checkout-clover-card-cvv");
      cardPostal.mount("#checkout-clover-card-postal");

      [
        { el: cardNumber, name: 'number' },
        { el: cardDate, name: 'date' },
        { el: cardCvv, name: 'cvv' },
        { el: cardPostal, name: 'postal' },
      ].forEach(({ el, name }) => {
        el.addEventListener('focus', () => {
          document.getElementById(`checkout-clover-container-${name}`)?.classList.add('border-blue-500', 'ring-2', 'ring-blue-100');
          document.getElementById(`checkout-clover-container-${name}`)?.classList.remove('border-gray-300');
        });
        el.addEventListener('blur', () => {
          document.getElementById(`checkout-clover-container-${name}`)?.classList.remove('border-blue-500', 'ring-2', 'ring-blue-100');
          document.getElementById(`checkout-clover-container-${name}`)?.classList.add('border-gray-300');
        });
      });

      setCloverReady(true);
      setCloverError("");
    } catch (err: any) {
      setCloverError(err?.message || "Failed to initialize Clover Elements.");
    }
  }, [cloverInstanceRef]);

  
  const waitForCloverAndInit = useCallback(() => {
    let attempts = 0;
    const maxAttempts = 40; 

    pollTimerRef.current = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).Clover) {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        initCloverElements();
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setCloverError("Timeout waiting for Clover SDK.");
        }
      }
    }, 250);
  }, [initCloverElements]);

  useEffect(() => {
    if (selectedMethod === "new") {
        if ((window as any).Clover) {
            setTimeout(initCloverElements, 100);
        } else {
            waitForCloverAndInit();
        }
    }
    
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [selectedMethod, initCloverElements, waitForCloverAndInit]);

  const handleMethodChange = (val: string) => {
    setSelectedMethod(val);
    initializedRef.current = true;
    setDropdownOpen(false);
    
    if (val === "new") {
      onPaymentReady({ isReady: true, cardHolderName: cardName });
    } else {
      onPaymentReady({ savedCardId: val, isReady: true });
    }
  };

  const inputBase = "w-full h-[52px] bg-[#F0F0F0] text-[#3B3B3B] font-[Quicksand] text-[16px] font-normal leading-none rounded-lg outline-none focus-within:bg-white border border-transparent focus-within:border-blue-500 transition-colors overflow-hidden";

  if (isLoadingCards) {
    return (
      <div className="flex items-center justify-center p-5">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  const selectedCard = cards.find((c: any) => c.id === selectedMethod);

  return (
    <div className="flex flex-col gap-4">
      {/* Dropdown for Payment Method */}
      <div ref={dropdownRef} className="relative">
        <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
          Payment Method
        </label>
        
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`w-full h-[52px] bg-[#F0F0F0] text-[#3B3B3B] font-[Quicksand] text-[16px] font-semibold leading-none rounded-lg px-4 flex items-center justify-between cursor-pointer border transition-colors ${dropdownOpen ? 'border-blue-500 bg-white' : 'border-transparent hover:border-gray-300'}`}
        >
          <span>
            {selectedMethod === "new" ? "New Card" : (
              selectedCard ? `${selectedCard.cardHolderName || "Card"} •••• ${selectedCard.last4} (${selectedCard.brand})${selectedCard.isDefault ? " - Default" : ""}` : "Select a card"
            )}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-[82px] left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
            {cards.map((c: any) => (
              <div
                key={c.id}
                onClick={() => handleMethodChange(c.id)}
                className={`px-4 py-3 text-[15px] font-[Quicksand] cursor-pointer transition-colors ${selectedMethod === c.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-[#3B3B3B] hover:bg-gray-50'}`}
              >
                {c.cardHolderName || "Card"} •••• {c.last4} ({c.brand}) {c.isDefault && <span className="text-gray-400 font-normal ml-1">- Default</span>}
              </div>
            ))}
            <div
              onClick={() => handleMethodChange("new")}
              className={`px-4 py-3 text-[15px] font-[Quicksand] cursor-pointer transition-colors ${selectedMethod === "new" ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-[#3B3B3B] hover:bg-gray-50'}`}
            >
              New Card
            </div>
          </div>
        )}
      </div>

      {selectedMethod === "new" ? (
        <div className="flex flex-col gap-4">
          {cloverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              ⚠️ {cloverError}
            </div>
          )}
          
          <div>
            <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
              Card Holder Name
            </label>
            <div className={`relative ${inputBase} border border-transparent focus-within:border-blue-500 focus-within:bg-white`}>
              <input
                 type="text"
                 value={cardName}
                 onChange={(e) => setCardName(e.target.value)}
                 placeholder="e.g. John Doe"
                 className="absolute inset-0 w-full h-full bg-transparent px-4 outline-none placeholder:text-[#3B3B3B] placeholder:opacity-70 text-[16px] text-[#3B3B3B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
              Card Number
            </label>
            <div id="checkout-clover-container-number" className={`relative ${inputBase} border border-transparent focus-within:border-blue-500 focus-within:bg-white`}>
              {!cloverReady && !cloverError && (
                <div className="absolute inset-0 flex items-center px-4">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-400">Loading secure input…</span>
                </div>
              )}
              <div id="checkout-clover-card-number" className="w-full h-full"></div>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
                Expired Date
              </label>
              <div id="checkout-clover-container-date" className={`relative ${inputBase} border border-transparent focus-within:border-blue-500 focus-within:bg-white`}>
                <div id="checkout-clover-card-date" className="w-full h-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
                CVV
              </label>
              <div id="checkout-clover-container-cvv" className={`relative ${inputBase} border border-transparent focus-within:border-blue-500 focus-within:bg-white`}>
                <div id="checkout-clover-card-cvv" className="w-full h-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
                Postal Code
              </label>
              <div id="checkout-clover-container-postal" className={`relative ${inputBase} border border-transparent focus-within:border-blue-500 focus-within:bg-white`}>
                <div id="checkout-clover-card-postal" className="w-full h-full"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 opacity-70 pointer-events-none">
          <div>
            <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
              Card Holder Name
            </label>
            <div className={`${inputBase} px-3 flex items-center`}>
              {selectedCard?.cardHolderName || "—"}
            </div>
          </div>
          <div>
            <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
              Card Number
            </label>
            <div className={`${inputBase} px-3 flex items-center`}>
              •••• •••• •••• {selectedCard?.last4}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
                Expired Date
              </label>
              <div className={`${inputBase} px-3 flex items-center`}>
                 {selectedCard?.expMonth > 0 ? `${String(selectedCard.expMonth).padStart(2, "0")}/${String(selectedCard.expYear).slice(-2)}` : "—"}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[#2B2922] font-[Quicksand] text-[16px] font-semibold leading-[1.2] mb-1.5">
                CVV
              </label>
              <div className={`${inputBase} px-3 flex items-center`}>
                •••
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
