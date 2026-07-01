import React from "react";
import Image from "next/image";

export function CompletionStep() {
  return (
    <div
      className="rounded-2xl p-5 mb-7"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <div className="relative w-full rounded-xl overflow-hidden mb-6">
        <Image
          src="/last-step-16.png"
          alt="You are all set"
          width={700}
          height={450}
          className="w-full h-auto object-contain rounded-xl"
        />
      </div>
      <div className="px-1 pb-2 text-center">
        <h2 className="text-gray-900 text-[20px] font-bold mb-3">
          You are all set!
        </h2>
        <p className="text-gray-700 text-[16px] leading-relaxed">
          Your assessment is done and ready to submit for review.
          <br />
          Choose the products and add to cart before submission.
        </p>
      </div>
    </div>
  );
}
