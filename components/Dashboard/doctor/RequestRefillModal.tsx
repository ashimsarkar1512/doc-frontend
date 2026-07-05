/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useUpdateConsultationStatusMutation } from "@/Redux/features/doctorDashboard/doctorDashboardApi";
import { toast } from "sonner";

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
  const [reason, setReason] = useState("");

  const [updateConsultationStatus, { isLoading }] =
    useUpdateConsultationStatusMutation();

  const formattedDate = submittedDate
    ? new Date(submittedDate)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
        .replace(/ (\d{4})$/, ", $1")
    : "N/A";

  const handleSubmit = async () => {
    try {
      const res = await updateConsultationStatus({
        id: consultationId,
        body: {
          status: "REFIL_REQUESTED",
          doctorNotes: reason,
        },
      }).unwrap();

      if (res?.success) {
        toast.success(res.message || "Updated successfully");
      } else {
        toast.error(res.message || "Something went wrong");
      }

      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to update consultation status"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            Request Refill Information
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Patient Info */}
          <div>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1">
              Patient: {patientName}
            </p>

            <p className="text-sm sm:text-base md:text-lg text-gray-500 flex flex-col sm:flex-row sm:gap-4">
              <span>Consultation id: #{consultationId}</span>
              <span>Submitted: {formattedDate}</span>
            </p>
          </div>

          {/* Refill Reason */}
          <div>
            <label className="block text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
              Refill Reason:
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe reasons..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              resize-none text-sm sm:text-base md:text-xl text-gray-700"
              rows={5}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          
          <button
            onClick={onClose}
            className="w-full sm:flex-1 bg-white border border-gray-300 text-gray-700 
            font-semibold py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-50 
            text-sm sm:text-base md:text-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:flex-1 bg-blue-600 text-white font-semibold 
            py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 
            text-sm sm:text-base md:text-xl disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>

        </div>
      </div>
    </div>
  );
}