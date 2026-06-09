import React from 'react';
import { Phone, Mail, AlertCircle } from 'lucide-react';

const ContactInfoCards = () => {
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

      {/* Clinical Support */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
          <Phone className="w-4 h-4 text-blue-500" />
          Clinical Support
        </h3>
        <p className="text-slate-900 font-medium mb-1 text-sm">1-800-555-0199</p>
        <p className="text-slate-500 text-xs">Mon-Sun, 7AM-10PM CT</p>
      </div>

      {/* Secure Message */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
          <Mail className="w-4 h-4 text-blue-500" />
          Secure Message
        </h3>
        <p className="text-slate-900 font-medium mb-1 text-sm">safety@weightlossmd.com</p>
        <p className="text-slate-500 text-xs">Monitored 7 days a week</p>
      </div>

      {/* FDA Reporting */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">FDA Reporting</h3>
        <p className="text-slate-600 text-xs leading-relaxed mb-3">
          You may also report adverse events directly to the FDA's MedWatch program.
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
