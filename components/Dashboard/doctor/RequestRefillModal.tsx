"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface RequestRefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  consultationId: string;
  submittedDate: string;
}

export default function RequestRefillModal({
  isOpen,
  onClose,
  patientName,
  consultationId,
  submittedDate,
}: RequestRefillModalProps) {
  const [refillType, setRefillType] = useState<{
    assessment: boolean;
    products: boolean;
  }>({
    assessment: true,
    products: false,
  });
  const [reason, setReason] = useState("");

  const handleRefillChange = (type: "assessment" | "products") => {
    setRefillType((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSubmit = () => {
    console.log("Refill Information:", { refillType, reason });
    // Handle submit logic here
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Request Refill Information</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div>
            <p className="text-gray-900 font-semibold mb-1">Patient: {patientName}</p>
            <p className="text-xs text-gray-500 space-x-4">
              <span>Consultation id: #{consultationId}</span>
              <span>Submitted: {submittedDate}</span>
            </p>
          </div>

          {/* What to refill */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              What to refill:
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={refillType.assessment}
                  onChange={() => handleRefillChange("assessment")}
                  className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  Assessment
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={refillType.products}
                  onChange={() => handleRefillChange("products")}
                  className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  Products
                </span>
              </label>
            </div>
          </div>

          {/* Refill Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Refill Reason:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe reasons..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-700"
              rows={6}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
