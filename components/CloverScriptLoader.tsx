"use client";

import Script from "next/script";

const SDK_URL =
  process.env.NEXT_PUBLIC_CLOVER_ENV === "production"
    ? "https://checkout.clover.com/sdk.js"
    : "https://checkout.sandbox.dev.clover.com/sdk.js";

export function CloverScriptLoader() {
  return (
    <Script
      src={SDK_URL}
      strategy="afterInteractive"
    />
  );
}
