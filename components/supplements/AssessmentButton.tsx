"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Assessment {
  id: string;
  title: string;
}

interface AssessmentButtonProps {
  assessments: Assessment[];
  baseUrl: string;
  className?: string;
  label?: string;
}

export default function AssessmentButton({ assessments, baseUrl, className, label }: AssessmentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    if (!assessments || assessments.length === 0) return;

    if (assessments.length === 1) {
      // Single assessment → navigate directly
      router.push(`${baseUrl}/assessment/${assessments[0].id}`);
    } else {
      // Multiple assessments → toggle popup
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelectAssessment = (id: string) => {
    setIsOpen(false);
    router.push(`/assessment/${id}`);
  };

  if (!assessments || assessments.length === 0) return null;

  const defaultClass = "inline-flex justify-center bg-[#0251D1] hover:bg-[#0241A7] text-white text-[16px] md:text-[18px] font-medium px-10 py-3.5 rounded-full transition-colors shadow-none";

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={className || defaultClass}
      >
        {label || "Get Started"}
      </button>

      {/* Popup for multiple assessments */}
      {isOpen && assessments.length > 1 && (
        <div
          ref={popupRef}
          className="absolute left-full top-0 ml-3 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 min-w-[220px] animate-fade-in"
        >
          {assessments.map((assessment) => (
            <button
              key={assessment.id}
              onClick={() => handleSelectAssessment(assessment.id)}
              className="w-full text-left px-5 py-3 text-[15px] text-gray-700 hover:bg-blue-50 hover:text-[#0251D1] transition-colors font-medium"
            >
              {assessment.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
