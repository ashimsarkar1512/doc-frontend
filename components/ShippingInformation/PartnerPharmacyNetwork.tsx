"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { useGetShippingInfoQuery } from '@/Redux/features/shipping/shippingApi';

// ─── Known logos map  (key = lowercase fragment of partner name) ──────────────
// Only include files that physically exist in /public
const KNOWN_LOGOS: Record<string, string> = {
  vios: '/VIOS.png',
  anazao: '/AHC.png',
};

function getLogoPath(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [key, path] of Object.entries(KNOWN_LOGOS)) {
    if (lower.includes(key)) return path;
  }
  return null;
}

// ─── Logo display sub-component with error fallback ──────────────────────────
function PharmacyLogo({ src, name }: { src: string; name: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) return <DefaultLogo name={name} />;

  return (
    <Image
      src={src}
      alt={name}
      width={160}
      height={55}
      className="object-contain object-left h-full w-auto"
      unoptimized
      onError={() => setErrored(true)}
    />
  );
}

// ─── Default placeholder shown when no logo is available ─────────────────────
function DefaultLogo({ name }: { name: string }) {
  // Show first 2 initials in a styled pill
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-[10px] bg-[#E2E8F0] flex items-center justify-center flex-shrink-0">
        <Building2 className="w-5 h-5 text-[#94A3B8]" />
      </div>
      <span
        className="text-[18px] font-bold text-[#475569]"
        style={{ fontFamily: 'Quicksand, sans-serif' }}
      >
        {initials}
      </span>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-[16px] px-[24px] py-[24px] flex flex-col gap-3 animate-pulse">
    <div className="h-[44px] w-[140px] bg-slate-200 rounded" />
    <div className="h-5 w-[60%] bg-slate-200 rounded mt-2" />
    <div className="h-4 w-[80%] bg-slate-200 rounded" />
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const PartnerPharmacyNetwork = () => {
  const { data, isLoading } = useGetShippingInfoQuery();
  const section = data?.partnerPharmacySection;

  const title = section?.title ?? 'Partner Pharmacy Network';
  const description =
    section?.description ??
    'Pharmacy assignment is based on your state, medication type, and current provider relationships.';

  // Use API partners if they have a name, otherwise fall back to static list
  const apiPartners = section?.partners?.filter((p) => p.name) ?? [];
  const staticFallback = [
    { id: 'f1', name: 'Olympia Pharmaceuticals', address: '503B Outsourcer + 503A Pharmacy', logo: null },
    { id: 'f2', name: 'CasaPharma RX', address: '503A Pharmacy', logo: null },
    { id: 'f3', name: 'Belmar Pharma Solutions', address: 'Compounding Pharmaceuticals', logo: null },
    { id: 'f4', name: 'AnazaoHealth', address: 'Compounding Pharmacy | United States', logo: null },
    { id: 'f5', name: 'Vios Compounding Pharmacy', address: '503A Pharmacy', logo: null },
    { id: 'f6', name: 'CasaPharma RX', address: 'Compounding Pharmacy | United States', logo: null },
  ];
  const partners = apiPartners.length > 0 ? apiPartners : staticFallback;

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 mt-16 mb-4 flex flex-col items-center">
      {/* Heading */}
      <h2
        className="text-[54px] font-semibold text-[#272628] text-center mb-3"
        style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '110%' }}
      >
        {title}
      </h2>
      <p
        className="text-center text-[#272628] text-[20px] font-normal mb-10 max-w-3xl mx-auto"
        style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
      >
        {description}
      </p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] w-full">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : partners.map((partner) => {
              // Prefer API logo URL, then known static file, then default placeholder
              const apiLogoUrl = partner.logo?.url ?? null;
              const knownPath = getLogoPath(partner.name);
              const logoSrc = apiLogoUrl ?? knownPath;

              return (
                <div
                  key={partner.id}
                  className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-[16px] px-[24px] py-[24px] flex flex-col transition hover:shadow-sm"
                >
                  {/* Logo area — 55px tall */}
                  <div className="h-[55px] flex items-center mb-[16px]">
                    {logoSrc ? (
                      <PharmacyLogo src={logoSrc} name={partner.name} />
                    ) : (
                      <DefaultLogo name={partner.name} />
                    )}
                  </div>

                  {/* Name */}
                  <p
                    className="text-[#0D2137] font-bold text-[22px] mb-[8px]"
                    style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '27px' }}
                  >
                    {partner.name}
                  </p>

                  {/* Address / subtitle */}
                  <p
                    className="text-[#3B3B3B] text-[20px] font-normal"
                    style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
                  >
                    {partner.address}
                  </p>
                </div>
              );
            })}
      </div>
    </section>
  );
};

export default PartnerPharmacyNetwork;
