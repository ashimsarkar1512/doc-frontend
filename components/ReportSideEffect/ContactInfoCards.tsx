'use client';

import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { useGetWebsiteSettingsQuery } from '@/Redux/features/footerData/footerDataApi';

const ContactInfoCards = () => {
  const { data, isLoading } = useGetWebsiteSettingsQuery();
  const contactInfo = data?.contactInfo;

  return (
    <div className="flex flex-col gap-4">
      {/* Emergency Line */}
      <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
          <Phone className="w-4 h-4 text-red-500" />
          Emergency Line
        </h3>
        <p className="text-red-600 font-bold mb-1 text-sm">911</p>
        <p className="text-slate-500 text-xs">For life-threatening emergencies</p>
      </div>

      {/* Clinical Support — phone from API */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
          <Phone className="w-4 h-4 text-blue-500" />
          Clinical Support
        </h3>
        {isLoading ? (
          <div className="space-y-1.5">
            <div className="h-3.5 w-1/2 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-slate-900 font-medium mb-1 text-sm">
              {contactInfo?.phone || '1-800-555-0199'}
            </p>
            <p className="text-slate-500 text-xs">
              {contactInfo?.openHours || 'Mon-Sun, 7AM-10PM CT'}
            </p>
          </>
        )}
      </div>

      {/* Secure Message — email from API */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
          <Mail className="w-4 h-4 text-blue-500" />
          Secure Message
        </h3>
        {isLoading ? (
          <div className="space-y-1.5">
            <div className="h-3.5 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-slate-900 font-medium mb-1 text-sm">
              {contactInfo?.email || 'safety@weightlossmd.com'}
            </p>
            <p className="text-slate-500 text-xs">Monitored 7 days a week</p>
          </>
        )}
      </div>

      {/* FDA Reporting — static */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">FDA Reporting</h3>
        <p className="text-slate-600 text-xs leading-relaxed mb-3">
          You may also report adverse events directly to the FDA&apos;s MedWatch program.
        </p>
        <p className="text-slate-900 font-medium text-xs mb-1">
          FDA MedWatch: <span className="font-semibold">1-800-FDA-1088</span>
        </p>
        <p className="text-slate-500 text-xs">fda.gov/safety/medwatch</p>
      </div>
    </div>
  );
};

export default ContactInfoCards;
