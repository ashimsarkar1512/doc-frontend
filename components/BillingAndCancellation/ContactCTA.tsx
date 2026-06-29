import React from "react";
import Link from "next/link";
const ContactCTA = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-24">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Abstract glow effect like in the image */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-64 h-64 bg-blue-500/30 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-xl bg-white/10 shrink-0">
            {/* W Logo Placeholder matching the design */}
            <span className="text-white font-bold text-2xl italic tracking-tighter">
              W
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Contact Us at Weight Loss MD Today
          </h2>
        </div>

        {/* <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.open(
              "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
              "_blank",
            );
          }}
          className="relative z-10 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-all shadow-[0_0_20px_-3px_rgba(37,99,235,0.5)] whitespace-nowrap shrink-0"
        >
          Book a consultation
        </Link> */}
        <a
  href="https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434"
  target="_blank"
  rel="noopener noreferrer"
  className="relative z-10 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-all shadow-[0_0_20px_-3px_rgba(37,99,235,0.5)] whitespace-nowrap shrink-0"
>
  Book a consultation
</a>
      </div>
    </section>
  );
};

export default ContactCTA;
