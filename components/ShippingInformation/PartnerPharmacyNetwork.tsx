import React from 'react';

const pharmacies = [
  {
    logo: { text: 'OLYMPIA', style: 'text-[22px] font-black italic tracking-widest text-emerald-500' },
    subtitle: '503B Outsourcing + 503A Pharmacy',
    name: 'Olympia Pharmaceuticals',
  },
  {
    logo: { text: '⚕ Casa Pharma Rx', style: 'text-[15px] font-bold text-blue-900' },
    subtitle: '503A Pharmacy',
    name: 'CasaPharma RX',
  },
  {
    logo: { text: 'Belmar', style: 'text-[22px] font-black italic text-emerald-700' },
    subtitle: 'Compounding Pharmaceuticals',
    name: 'Belmar Pharma Solutions',
  },
  {
    logo: { text: 'AnazaoHealth✦', style: 'text-[15px] font-bold text-cyan-600' },
    subtitle: 'Compounding Pharmacy | United States',
    name: 'AnazaoHealth',
  },
  {
    logo: { text: 'MOS', style: 'text-[28px] font-black tracking-tight text-slate-800' },
    subtitle: '503A Pharmacy',
    name: 'Mos Compounding Pharmacy',
  },
  {
    logo: { text: '⚕ Casa Pharma Rx', style: 'text-[15px] font-bold text-blue-900' },
    subtitle: 'Compounding Pharmacy | United States',
    name: 'AnazoHealth',
  },
];

const PartnerPharmacyNetwork = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-16 mb-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-900 mb-10">
        Partner Pharmacy Network
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {pharmacies.map((pharmacy, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl px-6 py-5 flex flex-col gap-1 transition hover:shadow-sm">
            <span className={pharmacy.logo.style}>{pharmacy.logo.text}</span>
            <p className="text-slate-800 font-semibold text-[13px] mt-1">{pharmacy.name}</p>
            <p className="text-slate-400 text-xs">{pharmacy.subtitle}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-slate-400 text-xs max-w-2xl mx-auto leading-relaxed">
        Pharmacy assignment is based on your state, medication type, and current provider relationships.
      </p>
    </section>
  );
};

export default PartnerPharmacyNetwork;
