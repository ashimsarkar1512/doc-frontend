/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useGetWebsiteSettingsQuery } from "@/Redux/features/footerData/footerDataApi";
// import Image from "next/image";
// import React from "react";

// interface LogoProps {
//   variant?: "light" | "dark";
//   logoImg?:any
// }

// const Logo = ({ variant  ,}: LogoProps) => {
//     const { data, isLoading } = useGetWebsiteSettingsQuery();
//     console.log(data);
//     const whitelogo = data?.whiteLogo;
//     const blacklogo=data?.blackLogo
//     console.log(blacklogo)
//     // console.log(contactInfoData);
//     // console.log(officeData);
//     console.log(whitelogo)
//   return (
//     <div className="flex items-center">
//       <Image
//         // src="/logo.png"sS
//         src={whitelogo?.fileUrl}
//         alt="Weight Loss MD"
//         width={180}
//         height={80}
//         priority
//         className={`h-9 sm:h-10 md:h-11 w-auto max-w-[132px] sm:max-w-[150px] md:max-w-[180px] object-contain object-left ${
//           variant === "light" ? "invert brightness-0 drop-shadow-sm " : " "
//         }`}
//       />
//     </div>
//   );
// };

// export default Logo;



import { useGetWebsiteSettingsQuery } from "@/Redux/features/footerData/footerDataApi";
import Image from "next/image";
import React from "react";

interface LogoProps {
  variant?: "light" | "dark";
  logoImg?: any
}

const Logo = ({ variant, }: LogoProps) => {
  const { data, isLoading } = useGetWebsiteSettingsQuery();

  const whiteLogo = data?.whiteLogo;
  const blackLogo = data?.blackLogo;

  // 🔥 dynamic src based on variant
  const logoSrc =
    variant === "light"
      ? whiteLogo?.fileUrl
      : blackLogo?.fileUrl;

  if (isLoading) return null;
  return (
    <div className="flex items-center">
      <Image
        // src="/logo.png"sS
        src={logoSrc || "/fallback-logo.png"}
        alt="Weight Loss MD"
        width={250}
        height={100}
        priority
        quality={100}
        unoptimized
        className={`h-11 sm:h-12 md:h-14 w-auto max-w-[180px] sm:max-w-[220px] md:max-w-[260px] object-contain object-left ${variant === "light" ? "invert brightness-0 drop-shadow-sm " : " "
          }`}
      />
    </div>
  );
};

export default Logo;