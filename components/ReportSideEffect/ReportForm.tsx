"use client";

import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

const ReportForm = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  const severities = [
    { id: 'mild', label: 'Mild', desc: 'Manageable, not affecting daily life' },
    { id: 'moderate', label: 'Moderate', desc: 'Affecting daily activities' },
    { id: 'severe', label: 'Severe', desc: 'Significant impact, may need medical attention' },
    { id: 'life-threatening', label: 'Life-threatening', desc: 'Requires immediate emergency care' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // form submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Side Effect Report Form</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">First Name</label>
            <input 
              type="text" 
              placeholder="First Name"
              className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-black" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Last Name</label>
            <input 
              type="text" 
              placeholder="Last Name"
              className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-black" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm font-medium text-slate-700">Email Address</label>
          <input 
            type="email" 
            placeholder="you@example.com"
            className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-black" 
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-sm font-medium text-slate-700">Medication</label>
          <select className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-slate-600 appearance-none cursor-pointer">
            <option value="" disabled selected>Select medication</option>
            <option value="glp1">GLP-1 Medication</option>
            <option value="testosterone">Testosterone</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-medium text-slate-700 mb-1">Symptom Severity</label>
          {severities.map((item) => (
            <label 
              key={item.id} 
              className={`flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer transition-colors ${
                selectedSeverity === item.id 
                  ? 'border-blue-500 bg-blue-50/30' 
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center w-4 h-4 rounded-full border border-slate-300 bg-white shrink-0">
                {selectedSeverity === item.id && (
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </div>
              <input 
                type="radio" 
                name="severity" 
                className="hidden"
                checked={selectedSeverity === item.id}
                onChange={() => setSelectedSeverity(item.id)}
              />
              <span className="text-sm text-slate-700">
                <span className="font-medium">{item.label}</span> - {item.desc}
              </span>
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-sm font-medium text-slate-700">Describe Your Symptoms</label>
          <textarea 
            rows={4}
            placeholder="Please describe when symptoms started, how they feel, and any other relevant details..."
            className="px-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none text-black"
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-8">
          <label className="text-sm font-medium text-slate-700">Supporting Documents (optional)</label>
          <div className="border-2 border-dashed border-gray-200 bg-gray-100 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
            <UploadCloud className="w-6 h-6 text-slate-500 mb-2" />
            <p className="text-sm font-medium text-slate-700 mb-1">Upload photos, lab results, or other files</p>
            <p className="text-xs text-slate-400">PNG, JPG, PDF up to 10MB each</p>
          </div>
        </div>

        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-full transition-colors text-sm w-fit"
        >
          Submit Report
        </button>
        
        <p className="text-xs text-slate-500 mt-4">
          Note: Your report is encrypted and HIPAA-protected.
        </p>
      </div>
    </form>
  );
};

export default ReportForm;
