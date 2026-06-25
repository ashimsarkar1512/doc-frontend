'use client';

import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentData: any) => void;
  amount?: string;
}

export default function StripeCheckoutModal({ isOpen, onClose, onSuccess, amount }: StripeCheckoutModalProps) {
  const [formData, setFormData] = useState({
    paymentMethod: 'CREDIT_CARD',
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4 animate-in fade-in duration-150">
      
      {/* Modal Card wrapper */}
      <div className="bg-white rounded-3xl border border-gray-100 max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-gray-900 leading-tight">Payment Info</h4>
            <span className="text-[10px] text-gray-400 font-light mt-0.5 leading-none">
              Payment processed by <strong className="text-blue-500 font-semibold">Stripe</strong>
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-all"
            aria-label="Close billing modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left side card detail forms (col-span-7) */}
            <div className="md:col-span-7 flex flex-col gap-4">
              
              {/* Payment Method Option */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Payment Method</label>
                <div className="w-full flex items-center gap-3 p-3 bg-gray-50 border border-blue-500/20 rounded-xl">
                  <CreditCard className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-gray-800">Credit / Debit Card</span>
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Card Holder Name</label>
                <input
                  type="text"
                  required
                  value={formData.cardholderName}
                  onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                  placeholder="Alan Cattoch"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
                />
              </div>

              {/* Card Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Card Number</label>
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
                />
              </div>

              {/* Expired Date & CVC row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Expired Date</label>
                  <input
                    type="text"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    placeholder="12/28"
                    maxLength={5}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">CVC</label>
                  <input
                    type="password"
                    required
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={4}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Save Card Checkbox Option */}
              <label className="flex items-center gap-2.5 py-1 select-none cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px] text-gray-500 font-light">
                  Save card details for future treatment cycles.
                </span>
              </label>

            </div>

            {/* Right side Invoice Summary Panel (col-span-5) */}
            <div className="md:col-span-5 bg-gray-50/50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
              <div className="border-b border-gray-200/60 pb-2">
                <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Payment Summary</h5>
                <span className="text-[10px] text-gray-400 font-light mt-0.5 leading-none">2 Items Selected</span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 font-light">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">$96.00</span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 font-light pb-2 border-b border-gray-200/40">
                <span>Consultation Fees</span>
                <span className="font-semibold text-gray-800">$50.00</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-xs font-bold text-gray-800">Total payable</span>
                <span className="text-xl font-black text-blue-600">${amount || '148.00'}</span>
              </div>

              <div className="bg-blue-50 border border-blue-100/50 rounded-xl p-3 flex gap-2 text-blue-700">
                <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed font-light">
                  SSL secured transaction processing. Your card details are fully encrypted.
                </p>
              </div>
            </div>

          </div>

          {/* Action Buttons footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold rounded-xl text-xs transition-all text-center"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/10 text-center"
            >
              Confirm Payment
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
