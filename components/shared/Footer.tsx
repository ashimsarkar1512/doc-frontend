import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from 'react-icons/fa6';
import Logo from '../ui/Logo';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] font-sans p-5 pt-12">
      {/* Office Locations Section (Constrained Width like Figma) */}
      <div className="max-w-7xl mx-auto bg-[#1c1c1c] rounded-t-4xl pt-16 pb-12 px-6 md:px-12">
        <h2 className="text-[2.5rem] font-medium text-center mb-14 text-white tracking-wide">Our office locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
          
          {/* Location 1 */}
          <div className="md:pr-10 py-6 md:py-0">
            <h3 className="font-medium text-white mb-2 text-[17px]">Colorado Springs</h3>
            <p className="text-[15px] text-gray-300 leading-[1.6] font-light">1625 Medical Center Point, Suite 130,<br/>Colorado Springs, CO 80907</p>
          </div>
          
          {/* Location 2 */}
          <div className="md:px-10 py-6 md:py-0">
            <h3 className="font-medium text-white mb-2 text-[17px]">Cherry Creek</h3>
            <p className="text-[15px] text-gray-300 leading-[1.6] font-light">700 E Speer Blvd, Denver, CO 80203</p>
          </div>
          
          {/* Location 3 */}
          <div className="md:px-10 py-6 md:py-0">
            <h3 className="font-medium text-white mb-2 text-[17px]">DTC / Greenwood Village</h3>
            <p className="text-[15px] text-gray-300 leading-[1.6] font-light">8100 E Union Ave, Suite 104, Denver,<br/>CO 80237</p>
          </div>
          
          {/* Location 4 */}
          <div className="md:pl-10 py-6 md:py-0">
            <h3 className="font-medium text-white mb-2 text-[17px]">Boulder</h3>
            <p className="text-[15px] text-gray-300 leading-[1.6] font-light">2425 Canyon Blvd, Suite G, Boulder,<br/>CO 80302</p>
          </div>

        </div>
      </div>

      {/* Main Footer Section (Full Width Image as requested) */}
      <div className="relative w-full overflow-hidden rounded-2xl">
        {/* Background image for the footer (Full Width) */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/footer.png"
            alt="Footer Background"
            fill  
            className="object-cover object-center"
            priority
          />
          {/* Fallback gradient if image doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1b3f3a] via-[#153430] to-[#0f2421] -z-10" />
        </div>

        {/* Constrain content to match the width above */}
        <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12 mb-10">
            
            {/* Brand & Description */}
            <div className="md:col-span-4 pr-0 md:pr-12">
              <div className="flex items-center gap-1 cursor-pointer mb-6">
                <Logo variant='light'/>
              </div>
              <p className="text-[14px] text-gray-200 leading-[1.7] font-light">
                Weight Loss MD is a medical weight loss clinic in Colorado offering GLP-1 Prescription weight loss medications CoolSculpting®, Laser Hair Removal, hormone replacement therapy, men's services, IV Therapy, and more!
              </p>
            </div>

            {/* Links Sections */}
            <div className="md:col-span-2">
              <h4 className="font-medium text-white mb-6 text-[17px]">Quick Links</h4>
              <ul className="space-y-4 text-[15px] text-gray-200 font-light">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Training</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Classes</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Membership</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-medium text-white mb-6 text-[17px]">Popular Services</h4>
              <ul className="space-y-4 text-[15px] text-gray-200 font-light">
                <li><Link href="/" className="hover:text-white transition-colors">Hormone Therapy</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">CoolSculpting®</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Weight Loss</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Sildenafil & Tadalafil</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-medium text-white mb-6 text-[17px]">Legal</h4>
              <ul className="space-y-4 text-[15px] text-gray-200 font-light">
                <li><Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">HIPPA Notice of Privacy</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Marketing and Conditions</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-medium text-white mb-6 text-[17px]">Contact Us</h4>
              <ul className="space-y-4 text-[15px] text-gray-200 font-light">
                <li>Phone: (720) 279-1164</li>
                <li>Email: info@wlmd.net</li>
                <li>Mon - Fri : 9AM - 2PM, 3PM - 6PM</li>
                <li>Sat - Sun : Closed</li>
              </ul>
            </div>
          </div>

          {/* Badges & Payments */}
          <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10 mt-8 mb-8 pl-0 md:pl-[33.33%]">
            
            <div className="flex flex-wrap items-center gap-6 md:gap-10">
              
              {/* LegitScript Certified Hexagon */}
              <div className="relative flex items-center justify-center w-[45px] h-[50px]">
                <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-lg">
                  <polygon points="50,5 95,30 95,80 50,105 5,80 5,30" fill="#0b162c" stroke="#3b82f6" strokeWidth="4"/>
                  <text x="50" y="45" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">LegitScript</text>
                  <text x="50" y="62" fontSize="9" fill="white" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">CERTIFIED</text>
                  <polyline points="40,82 48,90 62,75" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* LegitScript Logo */}
              <div className="flex items-center gap-2">
                <div className="relative w-[32px] h-[32px]">
                  <div className="absolute top-[8px] left-[0px] w-[10px] h-[10px] rounded-full bg-[#00d2ff]"></div>
                  <div className="absolute top-[0px] left-[13px] w-[10px] h-[10px] rounded-full bg-[#00a8ff]"></div>
                  <div className="absolute top-[16px] left-[13px] w-[10px] h-[10px] rounded-full bg-[#0080ff]"></div>
                  <div className="absolute top-[8px] left-[26px] w-[10px] h-[10px] rounded-full bg-[#005cff]"></div>
                </div>
                <span className="text-white font-bold text-[22px] tracking-tight ml-2">LegitScript</span>
              </div>

              {/* HIPAA */}
              <div className="flex items-center gap-2.5">
                <svg width="32" height="38" viewBox="0 0 24 28" fill="white" stroke="white" strokeWidth="1">
                  <path d="M12 2L3 6v8c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" fill="white"/>
                  {/* Caduceus stylized inner */}
                  <path d="M12 7v12M9 11h6M10 15h4" stroke="#000" strokeWidth="1.5" />
                  <circle cx="12" cy="11" r="2" stroke="#000" strokeWidth="1.5" fill="none" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-[11px] leading-tight">HIPAA</span>
                  <span className="text-white font-bold text-[13px] leading-tight">COMPLIANT</span>
                </div>
              </div>
            </div>

            {/* We Support */}
            <div className="flex items-center gap-4 w-full xl:w-auto justify-center xl:justify-end">
              <span className="text-white text-[16px] font-medium mr-2">We Support</span>
              <div className="flex items-center gap-4">
                <div className="flex flex-col leading-[1.1] text-white font-bold text-[10px] tracking-wider text-center">
                  <span>AMERICAN</span>
                  <span>EXPRESS</span>
                </div>
                <div className="flex items-center">
                  <div className="w-[28px] h-[28px] rounded-full bg-[#eb001b] mix-blend-screen opacity-90 relative z-10"></div>
                  <div className="w-[28px] h-[28px] rounded-full bg-[#f79e1b] mix-blend-screen opacity-90 -ml-3 relative z-0"></div>
                </div>
                <div className="text-white font-black text-2xl italic tracking-tighter ml-1">
                  VISA
                </div>
              </div>
            </div>

          </div>
          
          {/* Divider */}
          <div className="relative z-10 w-full h-[1px] bg-white/20 mb-6" />

          {/* Copyright & Socials */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-[14px] text-gray-300 font-light">
            <p>© 2025 Weight Loss MD. All Rights Reserved.</p>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <span className="mr-2">Follow us at:</span>
              <div className="flex gap-4 text-white items-center">
                <Link href="#" className="hover:text-gray-300 transition-colors">
                  <FaFacebookF className="h-[16px] w-[16px]" />
                </Link>
                <Link href="#" className="hover:text-gray-300 transition-colors">
                  <FaInstagram className="h-[16px] w-[16px]" />
                </Link>
                <Link href="#" className="hover:text-gray-300 transition-colors">
                  <FaXTwitter className="h-[16px] w-[16px]" />
                </Link>
                <Link href="#" className="hover:text-gray-300 transition-colors">
                  <FaLinkedinIn className="h-[16px] w-[16px]" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;