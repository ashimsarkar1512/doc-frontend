"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, User, Activity } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Weight Loss');

  const tabs = ['Weight Loss', 'Hormone Therapy', 'Regrow Hair', 'Men\'s Services', 'Skin Services'];

  const servicesData = {
    'Weight Loss': {
      left: ['GLP-1 Medications', 'Phentermine', 'Phendimetrazine (Bontril)', 'Diethylpropion', 'B12 Injections', 'Lipotropic Injections'],
      right: ['Vitamin C Ascorbic Acid', 'Glutathione Intramuscular Injections', 'B-Complex Intramuscular Injections', 'Vitamin D Intramuscular Injections', 'Hydroxocobalamin']
    },
    'Hormone Therapy': { left: ['Testosterone Therapy', 'Estrogen Therapy'], right: ['Thyroid Management'] },
    'Regrow Hair': { left: ['PRP Therapy', 'Minoxidil'], right: ['Finasteride'] },
    'Men\'s Services': { left: ['ED Treatment', 'Testosterone Check'], right: ['Prostate Health'] },
    'Skin Services': { left: ['Botox', 'Dermal Fillers'], right: ['Chemical Peels'] }
  };

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  return (
    <nav className="absolute top-0 w-full z-50 text-white pt-6 px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo placeholder */}
        <div className="flex items-center gap-2 cursor-pointer">
          <Activity className="h-8 w-8 text-white" />
          <div className="flex flex-col">
            <span className="font-bold text-2xl tracking-tighter leading-none">WEIGHTLOSSMD</span>
            <span className="text-sm font-light italic text-right leading-none pr-1">& Wellness</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 relative">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          
          <div className="relative">
            <div 
              className="flex items-center gap-1 cursor-pointer hover:text-gray-300 transition-colors select-none"
              onClick={toggleServices}
            >
              <span>Our Services</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            
            {/* Mega Menu Dropdown */}
            {isServicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[800px] bg-white rounded-2xl shadow-2xl p-6 text-black">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Medical Weight Management Program</h3>
                
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(tab);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTab === tab 
                          ? 'bg-[#1D4ED8] text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="flex gap-8">
                  <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3">
                    {/* Left Column */}
                    <ul className="space-y-3">
                      {(servicesData as any)[activeTab]?.left.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className={`w-1 h-1 rounded-full ${i === 0 && activeTab === 'Weight Loss' ? 'bg-blue-600' : 'bg-gray-400'}`}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    {/* Right Column */}
                    <ul className="space-y-3">
                      {(servicesData as any)[activeTab]?.right.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Image Placeholder */}
                  <div className="w-[200px] h-[200px] bg-[#2A2B2E] rounded-xl flex items-center justify-center relative overflow-hidden">
                     <div className="text-white text-center text-sm p-4 opacity-50">
                       [Pills Image Placeholder]
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 border-l border-white/20 pl-4">
          <Link href="/login" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
            <User className="h-4 w-4" />
            <span>Login</span>
          </Link>
          <button className="px-5 py-2 rounded-full border border-white hover:bg-white hover:text-black transition-colors font-medium">
            Start Consultation
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;