import React, { useState, useRef } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAcceptProposalMutation } from '@/Redux/api/messageApi';
import CloverCheckoutPayment from '../checkout/CloverCheckoutPayment';

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
  
  const [paymentPayload, setPaymentPayload] = useState<{ cloverToken?: string; savedCardId?: string; cardHolderName?: string; isReady: boolean }>({ isReady: false });
  const cloverInstanceRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    agreed: true
  });

  const [isTokenizing, setIsTokenizing] = useState(false);

  if (!isOpen || !proposal) return null;

  const handleMethodChange = (data: { cloverToken?: string; savedCardId?: string; cardHolderName?: string; isReady: boolean }) => {
    setPaymentPayload(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreed) {
      toast.error('You must agree to the privacy policy and terms of service.');
      return;
    }

    if (!paymentPayload.isReady) {
        toast.error("Please complete your payment details.");
        return;
    }

    try {
      setIsTokenizing(true);
      let payloadToSubmit: any = {
        paymentMethod: 'CLOVER',
      };

      if (!paymentPayload.savedCardId && cloverInstanceRef.current) {
          const result = await cloverInstanceRef.current.createToken({
             name: paymentPayload.cardHolderName || ""
          });
          
          if (result.errors || result.error) {
              toast.error("Invalid card details. Please check and try again.");
              setIsTokenizing(false);
              return;
          }
          
          payloadToSubmit.cloverToken = result.token;
          payloadToSubmit.cardholderName = paymentPayload.cardHolderName;
      } else if (paymentPayload.savedCardId) {
          payloadToSubmit.savedCardId = paymentPayload.savedCardId;
      } else {
          toast.error("Please provide valid payment details.");
          setIsTokenizing(false);
          return;
      }

      await acceptProposal({
        proposalId: proposal.id,
        paymentData: payloadToSubmit
      }).unwrap();

      toast.success('Proposal accepted and payment successful!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setIsTokenizing(false);
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
          <div className="flex-1 p-6 h-[500px] overflow-y-auto custom-scrollbar">
            <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
               <CloverCheckoutPayment onPaymentReady={handleMethodChange} cloverInstanceRef={cloverInstanceRef} />

              <div className="flex items-center gap-2 mt-4 pt-2">
                <input 
                  type="checkbox" 
                  id="agreed"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="agreed" className="text-sm text-gray-600 font-[Quicksand] cursor-pointer">
                  I agree to the <span className="underline hover:text-gray-900">privacy policy</span> & <span className="underline hover:text-gray-900">terms of service</span>.
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
                disabled={isLoading || isTokenizing}
                className="px-6 py-2.5 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white font-medium font-[Quicksand] shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isLoading || isTokenizing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
