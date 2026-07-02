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
        <h2 style={{ color: "#2B2922", textAlign: "center", fontFamily: "Quicksand, sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: "150%" }} className="mb-3">
          You are all set!
        </h2>
        <p style={{ color: "#2B2922", textAlign: "center", fontFamily: "Quicksand, sans-serif", fontSize: "20px", fontWeight: 500, lineHeight: "150%" }}>
          Your assessment is done and ready to submit for review.
          <br />
          Choose the products and add to cart before submission.
        </p>
      </div>
    </div>
  );
}
