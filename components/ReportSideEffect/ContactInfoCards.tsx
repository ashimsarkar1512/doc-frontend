'use client';

import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { useGetWebsiteSettingsQuery } from '@/Redux/features/footerData/footerDataApi';
import { useGetReportSideEffectContentQuery } from '@/Redux/features/sideEffect/sideEffectAPi';

const ContactInfoCards = () => {
  const { data: footerData, isLoading: isFooterLoading } = useGetWebsiteSettingsQuery();
  const contactInfo = footerData?.contactInfo;

  const { data: contentData, isLoading: isContentLoading } = useGetReportSideEffectContentQuery();
  const emergencyWidget = contentData?.data?.emergencyWidget;
  const contacts = emergencyWidget?.contacts ? [...emergencyWidget.contacts].sort((a, b) => a.order - b.order) : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Dynamic Emergency Contacts */}
      {isContentLoading ? (
        <div className="space-y-4">
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 shadow-sm space-y-1.5 animate-pulse">
            <div className="h-4 w-1/2 bg-red-200/50 rounded mb-2" />
            <div className="h-5 w-1/3 bg-red-200/50 rounded mb-1" />
            <div className="h-4 w-2/3 bg-red-100/50 rounded" />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1.5 animate-pulse">
            <div className="h-4 w-1/2 bg-slate-200 rounded mb-2" />
            <div className="h-5 w-1/3 bg-slate-200 rounded mb-1" />
            <div className="h-4 w-2/3 bg-slate-100 rounded" />
          </div>
        </div>
      ) : contacts.length > 0 ? (
        contacts.map((contact) => {
          const isEmergency = contact.title.toLowerCase().includes('emergency');
          return (
            <div key={contact.id} className={`${isEmergency ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-200'} border rounded-xl p-5 shadow-sm`}>
              <h3 className={`flex items-center gap-2 text-xl font-bold ${isEmergency ? 'text-slate-800' : 'text-slate-800'} mb-2`}>
                <Phone className={`w-4 h-4 ${isEmergency ? 'text-red-500' : 'text-blue-500'}`} />
                {contact.title}
              </h3>
              <p className={`${isEmergency ? 'text-[#E7000B]' : 'text-[#3B3B3B]'} font-bold mb-1 text-lg`}>
                {contact.contact}
              </p>
              <p className={`${isEmergency ? 'text-[#3B3B3B]' : 'text-slate-500'} text-lg`}>
                {contact.notes}
              </p>
            </div>
          );
        })
      ) : (
        <>
          {/* Emergency Line (Fallback) */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-2">
              <Phone className="w-4 h-4 text-red-500" />
              Emergency Line
            </h3>
            <p className="text-[#E7000B] font-bold mb-1 text-lg">911</p>
            <p className="text-[#3B3B3B] text-lg">For life-threatening emergencies</p>
          </div>

          {/* Clinical Support (Fallback) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-2">
              <Phone className="w-4 h-4 text-blue-500" />
              Clinical Support
            </h3>
            <p className="text-[#3B3B3B] font-medium mb-1 text-lg">
              {contactInfo?.phone || '1-800-555-0199'}
            </p>
            <p className="text-slate-500 text-lg">
              {contactInfo?.openHours || 'Mon-Sun, 7AM-10PM CT'}
            </p>
          </div>
        </>
      )}

      {/* Secure Message — email from API */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-[26px] text-[#272628] mb-2">
          <Mail className="w-4 h-4 text-blue-500" />
          Secure Message
        </h3>
        {isFooterLoading ? (
          <div className="space-y-1.5">
            <div className="h-3.5 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-[#272628] font-semibold mb-1 text-lg">
              {contactInfo?.email || 'safety@weightlossmd.com'}
            </p>
            <p className="text-[#3B3B3B] text-lg">Monitored 7 days a week</p>
          </>
        )}
      </div>

      {/* FDA Reporting — static */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-[26px] text-[#272628] mb-3">FDA Reporting</h3>
        <p className="text-slate-600 text-lg leading-relaxed mb-3">
          You may also report adverse events directly to the FDA&apos;s MedWatch program.
        </p>
        <p className="text-slate-900 font-bold text-lg mb-1">
          FDA MedWatch: <span className="font-semibold">1-800-FDA-1088</span>
        </p>
        <p className="text-slate-500 text-lg">fda.gov/safety/medwatch</p>
      </div>
    </div>
  );
};

export default ContactInfoCards;
