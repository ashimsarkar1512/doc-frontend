/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useUpdateConsultationStatusMutation } from "@/Redux/features/doctorDashboard/doctorDashboardApi";
import { toast } from "sonner";

interface ApproveConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  consultationId: string;
  submittedDate: string;
}

export default function ApproveConsultationModal({
  isOpen,
  onClose,
  patientName,
  consultationId,
  submittedDate,
}: ApproveConsultationModalProps) {
  const [consultationNote, setConsultationNote] = useState("");
  const [updateConsultationStatus, { isLoading }] =
    useUpdateConsultationStatusMutation();


const formattedDate = submittedDate
  ? new Date(submittedDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).replace(/ (\d{4})$/, ", $1")
  : "N/A";


const handleSubmit = async () => {
  try {
    const res = await updateConsultationStatus({
      id: consultationId,
      body: {
        status: "ACCEPTED",
        doctorNotes: consultationNote,
      },
    }).unwrap();

    console.log("Success:", res);

    if (res?.success) {
      toast.success(res.message || "Updated successfully");
    } else {
      toast.error(res.message || "Something went wrong");
    }

    onClose();
  } catch (error: any) {
    console.error("Error:", error);

    toast.error(
      error?.data?.message || "Failed to update consultation status"
    );
  }
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Approve & Provide Consultation
          </h2>
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
            <p className="text-gray-900 font-semibold mb-1">
              Patient: {patientName}
            </p>
            <p className="text-sm text-gray-500 space-x-4">
              <span>Consultation id: #{consultationId}</span>
              <span>Submitted: {formattedDate}</span>
            </p>
          </div>

          {/* Consultation Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Consultation Notes:
            </label>
            <textarea
              value={consultationNote}
              onChange={(e) => setConsultationNote(e.target.value)}
              placeholder="Write consultation for patient..."
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
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
