import React from 'react';
import { Clock, Shield } from 'lucide-react';

const InfoCards = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Processing Time */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-4">
          <Clock className="w-4 h-4 text-blue-500" />
          Processing Time
        </h3>
        <ul className="space-y-3">
          <li className="text-sm text-slate-600 flex justify-between gap-4">
            <span>Medical Records:</span>
            <span className="font-semibold text-slate-800 text-right">Up to 30 days</span>
          </li>
          <li className="text-sm text-slate-600 flex justify-between gap-4">
            <span>Prescription History:</span>
            <span className="font-semibold text-slate-800 text-right">3-5 business days</span>
          </li>
          <li className="text-sm text-slate-600 flex justify-between gap-4">
            <span>Billing Records:</span>
            <span className="font-semibold text-slate-800 text-right">1-3 business days</span>
          </li>
          <li className="text-sm text-slate-600 flex justify-between gap-4">
            <span>Account Deletion:</span>
            <span className="font-semibold text-slate-800 text-right">Up to 45 days</span>
          </li>
        </ul>
      </div>

      {/* HIPAA Rights */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-4">
          <Shield className="w-4 h-4 text-blue-500" />
          HIPAA Rights
        </h3>
        <ul className="space-y-2.5">
          <li className="text-sm text-slate-600 flex items-start gap-2">
            <span className="text-slate-400 mt-1">•</span>
            Right to access your medical records
          </li>
          <li className="text-sm text-slate-600 flex items-start gap-2">
            <span className="text-slate-400 mt-1">•</span>
            Right to request corrections
          </li>
          <li className="text-sm text-slate-600 flex items-start gap-2">
            <span className="text-slate-400 mt-1">•</span>
            Right to receive an accounting of disclosures
          </li>
          <li className="text-sm text-slate-600 flex items-start gap-2">
            <span className="text-slate-400 mt-1">•</span>
            Right to restrict certain uses
          </li>
          <li className="text-sm text-slate-600 flex items-start gap-2">
            <span className="text-slate-400 mt-1">•</span>
            Right to receive records in electronic format
          </li>
        </ul>
      </div>

      {/* Need Help? */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Need Help?</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Contact our Privacy Officer for assistance with records requests.
        </p>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">privacy@weightlossmd.com</p>
          <p className="text-sm font-semibold text-slate-900">1-800-555-0177</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
