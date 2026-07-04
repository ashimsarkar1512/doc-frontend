import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useAcceptProposalMutation } from '@/Redux/api/messageApi';

interface AcceptProposalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: any;
  onSuccess?: () => void;
}

export default function AcceptProposalPaymentModal({
  isOpen,
  onClose,
  proposal,
  onSuccess
}: AcceptProposalPaymentModalProps) {
  const [acceptProposal, { isLoading }] = useAcceptProposalMutation();

  const [formData, setFormData] = useState({
    paymentMethod: 'CARD',
    cardHolderName: 'Alan Cattach',
    cardNumber: '4111111111111111',
    expiryDate: '12/26',
    cvv: '123',
    agreed: true
  });

  if (!isOpen || !proposal) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) {
      toast.error('You must agree to the privacy policy and terms of service.');
      return;
    }

    try {
      const paymentData = {
        paymentMethod: formData.paymentMethod,
        cardholderName: formData.cardHolderName,
        cardNumber: formData.cardNumber.replace(/\s+/g, ''),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv
      };

      await acceptProposal({
        proposalId: proposal.id,
        paymentData
      }).unwrap();

      toast.success('Proposal accepted and payment successful!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to process payment. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[20px] w-full max-w-[850px] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[20px] font-bold text-gray-900 font-[Quicksand]">Payment Info:</h2>
            <div className="flex items-center text-gray-500 text-[15px] font-[Quicksand]">
              Payment powered by: 
              <div className="ml-2 flex items-center text-emerald-600 font-bold text-xl tracking-tight">
                {/* Clover Mock Logo */}
                <svg className="w-6 h-6 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h-2zm0 6h2v2h-2z" />
                </svg>
                clover
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row border-t border-gray-100">
          
          {/* Left: Form */}
          <div className="flex-1 p-6">
            <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5 font-[Quicksand]">Payment Method</label>
                <select 
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full bg-[#f4f4f4] border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 rounded-lg px-4 py-2.5 text-gray-700 outline-none transition-colors"
                >
                  <option value="CARD">Default card</option>
                  <option value="BANK">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5 font-[Quicksand]">Card Holder Name</label>
                <input 
                  type="text" 
                  name="cardHolderName"
                  value={formData.cardHolderName}
                  onChange={handleChange}
                  placeholder="Alan Cattach"
                  className="w-full bg-[#f4f4f4] border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 rounded-lg px-4 py-2.5 text-gray-700 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5 font-[Quicksand]">Card Number</label>
                <input 
                  type="text" 
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="**** **** **** 3456"
                  className="w-full bg-[#f4f4f4] border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 rounded-lg px-4 py-2.5 text-gray-700 outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1.5 font-[Quicksand]">Expired Date</label>
                  <input 
                    type="text" 
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="12/26"
                    className="w-full bg-[#f4f4f4] border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 rounded-lg px-4 py-2.5 text-gray-700 outline-none transition-colors"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1.5 font-[Quicksand]">CVV</label>
                  <input 
                    type="text" 
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className="w-full bg-[#f4f4f4] border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 rounded-lg px-4 py-2.5 text-gray-700 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-2">
                <input 
                  type="checkbox" 
                  id="agreed"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="agreed" className="text-sm text-gray-600 font-[Quicksand]">
                  I agree to the <span className="underline cursor-pointer hover:text-gray-900">privacy policy</span> & <span className="underline cursor-pointer hover:text-gray-900">terms of service</span>.
                </label>
              </div>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="flex-1 bg-[#f0f4f8] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-800 font-semibold text-[17px] font-[Quicksand]">Payment Summary</h3>
                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  1 ITEM
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600 font-[Quicksand]">
                  <span>Consultation Fees</span>
                  <span>${Number(proposal?.fee || 0).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-blue-200 pt-4 flex justify-between font-bold text-[17px] text-gray-900 font-[Quicksand]">
                  <span>Total</span>
                  <span className="text-blue-600">${Number(proposal?.fee || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-12">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium font-[Quicksand] transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="payment-form"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white font-medium font-[Quicksand] shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
