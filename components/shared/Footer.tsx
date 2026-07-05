/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaYoutube, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { useGetWebsiteSettingsQuery } from "@/Redux/features/footerData/footerDataApi";
import FooterTop from "./footer/footer-top";
import { WeightLossMDSite } from "./footer/types";
import NewsLetter from "./footer/news-letter";

type QueryData = {
  data: WeightLossMDSite;
  isLoading: boolean;
};

const Footer = () => {
  const { data, isLoading }: QueryData = useGetWebsiteSettingsQuery();
  const contactInfoData = data?.contactInfo;
  const logoImg = data?.whiteLogo;

  return (
    <footer className="w-full bg-[#0a0a0a] font-sans overflow-x-hidden">
      {/* ── Office Locations ── outer bg is black, inner box is 1688px centered ── */}
      <FooterTop data={data?.offices} isLoading={isLoading} />

      {/* ── Main Footer (background image) — max 1880px with 20px side margins ── */}
      <div className="w-full bg-[#0a0a0a] px-[20px]">
        <div className="relative w-full max-w-[1880px] mx-auto overflow-hidden rounded-[40px]">
          {/* Background */}
          <Background />

          {/* Content — flex column, gap 40px, Figma: padding 60/60/40/60 */}
          <div className="relative z-10 flex flex-col items-start gap-[40px] self-stretch px-5 md:px-[60px] pt-10 md:pt-[60px] pb-[40px]">
            {/* ── Row 1: Nav grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_0.85fr_0.85fr_1fr_1.2fr] gap-x-[40px] gap-y-10 w-full">
              {/* Col 1: Logo + Description */}
              <div>
                <div className="mb-4">
                  {logoImg?.fileUrl ? (
                    <Image
                      src={logoImg.fileUrl}
                      alt="WeightLossMD Logo"
                      width={200}
                      height={70}
                      loading="lazy"
                      className="h-[60px] w-auto object-left object-contain"
                    />
                  ) : (
                    <div className="h-[60px] w-[180px] bg-white/10 rounded animate-pulse" />
                  )}
                </div>
                <p className="text-[20px] text-white leading-[150%] font-normal font-[Quicksand]">
                  Weight Loss MD is a medical weight loss clinic in Colorado
                  offering GLP-1 Prescription weight loss medications
                  CoolSculpting®, Laser Hair Removal, hormone replacement
                  therapy, men&apos;s services, IV Therapy, and more!
                </p>
                <div className="lg:hidden w-full mt-6">
                  <NewsLetter />
                </div>
              </div>

              {/* Col 2: Others – left list */}
              <div>
                <h4 className="font-semibold text-white mb-5 text-[24px] leading-[150%] font-[Quicksand]">
                  Others
                </h4>
                <ul className="space-y-[10px] text-[20px] text-white font-normal font-[Quicksand] leading-[150%]">
                  <li>
                    <Link
                      href="/medical-team"
                      className="hover:text-white transition-colors"
                    >
                      Medical Team
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/how-it-works"
                      className="hover:text-white transition-colors"
                    >
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="hover:text-white transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/eligibility"
                      className="hover:text-white transition-colors"
                    >
                      Eligibility
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Others – right list (no heading, aligned with col 2 links) */}
              <div className="mt-[-20px] lg:mt-0">
                <div className="mb-5 h-[36px] hidden lg:block" />
                {/* exact heading height: 24px × 150% = 36px */}
                <ul className="space-y-[10px] text-[20px] text-white font-normal font-[Quicksand] leading-[150%]">
                  <li>
                    <Link
                      href="/coverage"
                      className="hover:text-white transition-colors"
                    >
                      Coverage
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/report-side-effect"
                      className="hover:text-white transition-colors"
                    >
                      Report Side Effect
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/request-your-records"
                      className="hover:text-white transition-colors"
                    >
                      Request Records
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shipping-information"
                      className="hover:text-white transition-colors"
                    >
                      Shipping Information
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 4: Legal Disclaimer */}
              <div>
                <h4 className="font-semibold text-white mb-5 text-[24px] leading-[150%] font-[Quicksand]">
                  Legal Disclaimer
                </h4>
                <ul className="space-y-[10px] text-[20px] text-white font-normal font-[Quicksand] leading-[150%]">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-of-service"
                      className="hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/hipaa-notice"
                      className="hover:text-white transition-colors"
                    >
                      HIPPA Notice of Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/billing-and-cancellation"
                      className="hover:text-white transition-colors"
                    >
                      Billing &amp; Cancellation
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 5: Contact Us */}
              <div>
                <h4 className="font-semibold text-white mb-5 text-[24px] leading-[150%] font-[Quicksand]">
                  Contact Us
                </h4>
                <ul className="space-y-[10px] text-[20px] text-white font-normal font-[Quicksand] leading-[150%]">
                  {isLoading ? (
                    <>
                      {[0, 1, 2, 3].map((i) => (
                        <li key={i}>
                          <div className="h-[14px] w-3/4 bg-white/10 rounded animate-pulse" />
                        </li>
                      ))}
                    </>
                  ) : (
                    <>
                      <li className="whitespace-nowrap">
                        Phone: {contactInfoData?.phone}
                      </li>
                      <li className="whitespace-nowrap">
                        Email: {contactInfoData?.email}
                      </li>
                      <li className="whitespace-nowrap">
                        {contactInfoData?.openHours}
                      </li>
                      <li>{contactInfoData?.closedDays} : Closed</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* ── Row 2: Badges + Payment (same 5-col grid) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_0.85fr_0.85fr_1fr_1.2fr] gap-x-[40px] gap-y-10 lg:gap-y-0 w-full">
              {/* Col 1: Newsletter — aligns with logo column */}
              <div className="hidden lg:flex w-full items-center justify-start h-full">
                <NewsLetter />
              </div>

              {/* Cols 2-4: Badges */}
              <div className="lg:col-span-3 flex flex-wrap lg:flex-nowrap justify-center lg:justify-start items-center gap-3 lg:gap-6 w-full">
                <Image
                  src="/footer1.png"
                  alt="LegitScript Certified"
                  width={53}
                  height={57}
                  className="w-[40px] md:w-[53px] h-auto object-contain"
                />
                <Image
                  src="/footer2.png"
                  alt="LegitScript"
                  width={170}
                  height={52}
                  className="w-[130px] md:w-[170px] h-auto object-contain"
                />
                <Image
                  src="/footer3.png"
                  alt="HIPAA Compliant"
                  width={97}
                  height={39}
                  className="w-[75px] md:w-[97px] h-auto object-contain"
                />
              </div>

              {/* Col 5: We Support + payment icons */}
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 lg:gap-4 justify-center lg:justify-end w-full">
                <span className="text-white text-[18px] md:text-[24px] font-semibold font-[Quicksand] leading-[150%] whitespace-nowrap">
                  We Support
                </span>

                <div className="flex items-center gap-3 lg:gap-4 scale-[0.85] lg:scale-100 origin-center lg:origin-right">
                  {/* American Express SVG — 89×35px */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="89"
                  height="35"
                  viewBox="0 0 89 35"
                  fill="none"
                >
                  <path
                    d="M82.4877 22.7834H80.0656C79.5641 22.7834 79.1462 22.4572 79.1462 22.0493C79.1462 21.5599 79.5641 21.3151 80.0656 21.3151H84.492L85.4949 19.1144H80.0656C77.8106 19.1144 76.5569 20.4179 76.5569 22.1309C76.5569 23.8439 77.8106 24.9842 79.7313 24.9842H82.1534C82.6549 24.9842 83.0728 25.3105 83.0728 25.7183C83.0728 26.1262 82.7385 26.4525 82.1534 26.4525H76.8076V28.6532H82.1534C84.4084 28.6532 85.6621 27.3498 85.6621 25.5552C85.6621 23.7606 84.492 22.7834 82.4877 22.7834ZM72.7156 22.7834H70.2935C69.792 22.7834 69.3741 22.4572 69.3741 22.0493C69.3741 21.5599 69.792 21.3151 70.2935 21.3151H74.7198L75.7228 19.1144H70.2935C68.0385 19.1144 66.7865 20.4179 66.7865 22.1309C66.7865 23.8439 68.0385 24.9842 69.9609 24.9842H72.383C72.8845 24.9842 73.3024 25.3105 73.3024 25.7183C73.3024 26.1262 72.9681 26.4525 72.383 26.4525H67.0372V28.6532H72.383C74.638 28.6532 75.89 27.3498 75.89 25.5552C75.9736 23.7623 74.8052 22.7834 72.7156 22.7834ZM57.2651 28.7331H65.6181V26.5324H59.938V24.9842H65.5345V22.7834H59.938V21.2353H65.6181V19.0345H57.2651V28.7348V28.7331ZM52.0865 23.1913H49.33V21.2353H52.0865C52.8388 21.2353 53.2567 21.7247 53.2567 22.2141C53.2567 22.7851 52.8388 23.193 52.0865 23.193M55.9278 22.1326C55.9278 20.2581 54.5905 19.0345 52.4191 19.0345H46.6554V28.7348H49.3283V25.3938H50.3313L53.3385 28.7348H56.5129L53.2549 25.2306C54.9248 24.8227 55.9278 23.6824 55.9278 22.1326ZM41.6457 23.3561H38.8057V21.237H41.6457C42.398 21.237 42.8159 21.7264 42.8159 22.2974C42.8159 22.8684 42.4815 23.3578 41.6457 23.3578M41.9801 19.0379H36.2164V28.7382H38.8893V25.5586H41.9801C44.235 25.5586 45.5723 24.1736 45.5723 22.2974C45.4888 20.3414 44.1532 19.0362 41.9801 19.0362M35.7166 19.0362H32.2932L29.7875 21.9711L27.1982 19.0362H23.6895L28.1159 23.8456L23.6059 28.7365H27.0293L29.7022 25.6385L32.3751 28.7365H35.882L31.3721 23.764L35.7149 19.0362H35.7166ZM14.9204 28.7365H23.2716V26.5358H17.5079V24.9876H23.1044V22.7868H17.5079V21.2387H23.2716V19.0379H14.9204V28.7382V28.7365ZM81.4847 12.5122L77.3927 6.64407H74.0512V16.2628H76.7241V10.1483L80.8997 16.2611H84.0741V6.64407H81.4847V12.5139V12.5122ZM66.1161 12.1859L67.5353 8.92469L68.9544 12.1859H66.1144H66.1161ZM65.7818 6.64237L61.439 16.3427H64.3626L65.1984 14.3866H69.792L70.6278 16.3427H73.635L69.2086 6.64407H65.7835L65.7818 6.64237ZM57.0962 11.5333V11.3702C57.0962 9.90356 57.932 8.92469 59.6019 8.92469H62.5256V6.5625H59.3512C56.0932 6.5625 54.4233 8.6001 54.4233 11.2903V11.4534C54.4233 14.4699 56.344 16.1812 59.2676 16.1812H60.187L61.2718 13.9805H59.6855C58.0992 14.062 57.0962 13.1647 57.0962 11.535M50.4149 16.2628H53.0878V6.64407H50.4149V16.2628ZM45.2363 10.7193H42.4798V8.76325H45.2363C45.9885 8.76325 46.4064 9.25268 46.4064 9.74211C46.4064 10.3131 45.9885 10.721 45.2363 10.721M49.0776 9.74211C49.0776 7.86765 47.7402 6.64407 45.5706 6.64407H39.8069V16.3443H42.4798V12.9217H43.4828L46.49 16.2645H49.748L46.4082 12.7603C48.0781 12.434 49.081 11.2121 49.081 9.74381M29.7039 16.2645H38.0552V14.0637H32.3751V12.5156H37.888V10.3148H32.3751V8.76665H38.0552V6.64407H29.7039V16.2628V16.2645ZM21.2691 12.677L19.0124 6.64407H14.9204V16.2628H17.5097V9.33425L20.099 16.2628H22.4375L25.0268 9.33425V16.2628H27.6997V6.64407H23.5241L21.2691 12.6753V12.677ZM6.90346 12.1876L8.32262 8.92639L9.74177 12.1876H6.90172H6.90346ZM6.56739 6.64407L2.22461 16.2628H5.14824L5.98406 14.3067H10.5776L11.4134 16.2628H14.4206L9.99251 6.64407H6.56739Z"
                    fill="white"
                  />
                </svg>

                {/* Mastercard — overlapping circles */}
                <div className="flex items-center">
                  <div className="w-[26px] h-[26px] rounded-full bg-[#eb001b] relative z-10" />
                  <div className="w-[26px] h-[26px] rounded-full bg-[#f79e1b] -ml-3 relative z-0" />
                </div>

                {/* Visa SVG — 68×22px */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="69"
                  height="23"
                  viewBox="0 0 69 23"
                  fill="none"
                  style={{ width: "68.018px", height: "22.346px" }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.0053 22.1724H11.1187L6.70452 4.83668C6.49501 4.03924 6.05015 3.33425 5.39577 3.00198C3.76269 2.16698 1.96314 1.50244 0 1.16729V0.499862H9.48277C10.7915 0.499862 11.7731 1.50244 11.9367 2.66683L14.227 15.1716L20.1107 0.499862H25.8337L17.0053 22.1724ZM29.1055 22.1724H23.5461L28.1239 0.499862H33.6833L29.1055 22.1724ZM40.8758 6.50378C41.0394 5.33651 42.0209 4.66908 43.1661 4.66908C44.9657 4.50151 46.9259 4.83666 48.5619 5.66878L49.5434 1.00258C47.9075 0.335157 46.1079 0 44.4749 0C39.0791 0 35.1528 3.00197 35.1528 7.16832C35.1528 10.3379 37.9339 12.0021 39.8971 13.0047C42.0209 14.0044 42.8389 14.6718 42.6753 15.6715C42.6753 17.171 41.0394 17.8384 39.4063 17.8384C37.4431 17.8384 35.48 17.3386 33.6833 16.5036L32.7018 21.1727C34.6649 22.0048 36.7888 22.34 38.7519 22.34C44.8021 22.5046 48.5619 19.5056 48.5619 15.0041C48.5619 9.33528 40.8758 9.00301 40.8758 6.50378ZM68.0182 22.1724L63.604 0.499862H58.8626C57.881 0.499862 56.8994 1.16729 56.5722 2.16698L48.3982 22.1724H54.1212L55.2635 19.0057H62.2952L62.9496 22.1724H68.0182ZM59.6806 6.3363L61.3136 14.5043H56.7358L59.6806 6.3363Z"
                    fill="white"
                  />
                </svg>
                </div>
              </div>
            </div>

            {/* ── Row 3: Divider + Copyright + Socials ── */}
            <div className="w-full">
              <div className="w-full h-[1px] bg-white/20 mb-5" />

              {/* ── Copyright + Socials ── */}
              <div className="flex flex-col lg:flex-row justify-between items-center text-[16px] lg:text-[20px] text-white font-normal font-[Quicksand] leading-[150%] gap-4 lg:gap-0 text-center lg:text-left">
                <p>
                  &copy; {new Date().getFullYear()} Weight Loss MD. All Rights
                  Reserved.
                </p>

                <div className="flex items-center gap-3 mt-3 lg:mt-0">
                  <span className="text-[16px] lg:text-[20px] text-white font-normal font-[Quicksand] leading-[150%] mr-1 whitespace-nowrap">
                    Follow us at:
                  </span>
                  <div className="flex gap-3 text-white items-center">
                    <Link
                      href="https://www.facebook.com/wlmdusa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-[24px] h-[24px] flex items-center justify-center"
                    >
                      <FaFacebookF className="w-[24px] h-[24px] flex-shrink-0" />
                    </Link>
                    <Link
                      href="https://www.tiktok.com/@weightlossmd1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-[24px] h-[24px] flex items-center justify-center"
                    >
                      <FaTiktok className="w-[24px] h-[24px] flex-shrink-0" />
                    </Link>
                    <Link
                      href="https://www.youtube.com/@WeightLoss-MD"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-[24px] h-[24px] flex items-center justify-center"
                    >
                      <FaYoutube className="w-[24px] h-[24px] flex-shrink-0" />
                    </Link>
                    <Link
                      href="https://x.com/weightlossmd_1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-[24px] h-[24px] flex items-center justify-center"
                    >
                      <FaXTwitter className="w-[24px] h-[24px] flex-shrink-0" />
                    </Link>
                    <Link
                      href="https://www.linkedin.com/company/weightlossmd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-[24px] h-[24px] flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.27938 3H18.7194C19.7798 3 20.6394 3.89543 20.6394 5V19C20.6394 20.1046 19.7798 21 18.7194 21H5.27938C4.21899 21 3.35938 20.1046 3.35938 19V5C3.35938 3.89543 4.21899 3 5.27938 3ZM8.15938 18C8.42447 18 8.63938 17.7761 8.63938 17.5V10.5C8.63938 10.2239 8.42447 10 8.15938 10H6.71938C6.45428 10 6.23938 10.2239 6.23938 10.5V17.5C6.23938 17.7761 6.45428 18 6.71938 18H8.15938ZM7.43937 9C6.64408 9 5.99938 8.32843 5.99938 7.5C5.99938 6.67157 6.44408 6 7.43937 6C8.23467 6 8.87938 6.67157 8.87938 7.5C8.87938 8.32843 8.23467 9 7.43937 9ZM17.2794 18C17.5444 18 17.7594 17.7761 17.7594 17.5V12.9C17.7906 11.3108 16.6627 9.95452 15.1482 9.76C14.0893 9.65925 13.0633 10.1744 12.4794 11.1V10.5C12.4794 10.2239 12.2644 10 11.9994 10H10.5594C10.2943 10 10.0794 10.2239 10.0794 10.5V17.5C10.0794 17.7761 10.2943 18 10.5594 18H11.9994C12.2644 18 12.4794 17.7761 12.4794 17.5V13.75C12.4794 12.9216 13.1241 12.25 13.9194 12.25C14.7146 12.25 15.3594 12.9216 15.3594 13.75V17.5C15.3594 17.7761 15.5743 18 15.8394 18H17.2794Z"
                          fill="white"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* ── end Row 3 wrapper ── */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

function Background() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <Image
        src="/footer.png"
        alt="Footer Background"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Figma gradient: transparent top → 70% black bottom, over footer.png */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.70) 100%)",
        }}
      />
    </div>
  );
}
