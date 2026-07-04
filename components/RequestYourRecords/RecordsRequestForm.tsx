"use client";

import React, { useState } from 'react';
import { FileText, Link as LinkIcon, CreditCard, Trash2 } from 'lucide-react';

const RecordsRequestForm = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const requestTypes = [
    {
      id: 'medical-records',
      icon: <FileText className="w-5 h-5" />,
      title: 'Medical Records',
      desc: 'Visit notes, assessments, provider communications',
    },
    {
      id: 'prescription-history',
      icon: <LinkIcon className="w-5 h-5" />,
      title: 'Prescription History',
      desc: 'All prescriptions issued through WeightLossMD',
    },
    {
      id: 'billing-records',
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Billing Records',
      desc: 'Payment history, invoices, receipts',
    },
    {
      id: 'account-deletion',
      icon: <Trash2 className="w-5 h-5" />,
      title: 'Account Deletion',
      desc: 'Request deletion of your account and personal data',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 
        style={{ fontFamily: 'Quicksand, sans-serif' }}
        className="text-[30px] font-bold leading-[1.1] tracking-normal text-start text-slate-900 mb-6"
      >
        Records Request Form
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm lg:text-lg md:text-base font-semibold text-[#2B2922]">First Name</label>
          <input 
            type="text" 
            placeholder="First Name"
            className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg text-black" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm lg:text-lg md:text-base font-semibold text-[#2B2922]">Last Name</label>
          <input 
            type="text" 
            placeholder="Last Name"
            className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg text-black" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm lg:text-lg md:text-base font-semibold text-[#2B2922]">Email Address</label>
        <input 
          type="email" 
          placeholder="you@example.com"
          className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg text-black" 
        />
      </div>

      <div className="flex flex-col gap-1.5 mb-2">
        <label className="text-sm lg:text-lg md:text-base font-semibold text-[#2B2922]">Date of Birth</label>
        <input 
          type="date" 
          className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg text-slate-600 appearance-none w-full" 
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm lg:text-lg md:text-base font-semibold text-[#2B2922]">Request Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {requestTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedRequest(type.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-[10px] border transition-all text-center gap-3
                ${selectedRequest === type.id 
                  ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/20' 
                  : 'border-[#D1D5DC] hover:border-blue-200 hover:bg-slate-50'
                }`}
            >
              <div className={`${selectedRequest === type.id ? 'text-blue-600' : 'text-blue-500'}`}>
                {type.icon}
              </div>
              <span 
                className={`text-[20px] leading-none font-medium ${selectedRequest === type.id ? 'text-blue-700' : 'text-slate-800'}`}
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {type.title}
              </span>
              <span 
                className="text-[17px] font-normal leading-[1.2] text-center text-slate-500"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {type.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-4">
        <label className="text-sm lg:text-lg md:text-base font-semibold text-[#2B2922]">Additional Notes</label>
        <textarea 
          rows={4}
          placeholder="Any specific information about your request..."
          className="px-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg resize-none text-black"
        />
      </div>

      <label className="flex items-start gap-3 mt-4 cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5">
          <input 
            type="checkbox" 
            className="peer w-4 h-4 appearance-none border border-slate-300 rounded cursor-pointer checked:bg-blue-600 checked:border-blue-600 transition-colors"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
          <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span 
          className="text-[20px] font-normal text-[#272628] leading-[1.5] group-hover:text-slate-800 transition-colors"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          I confirm this request is for my own records or I have legal authority to request these records. I understand that identity verification may be required.
        </span>
      </label>

      <button 
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-full transition-colors text-[22px] w-fit mt-4"
      >
        Submit Records Request
      </button>
    </form>
  );
};

export default RecordsRequestForm;
