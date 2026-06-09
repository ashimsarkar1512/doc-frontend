import Image from "next/image";
import React from "react";

interface LogoProps {
  variant?: "light" | "dark";
}

const Logo = ({ variant = "dark" }: LogoProps) => {
  return (
    <div className="flex items-center">
      <Image
        src="/logo.png"
        alt="Weight Loss MD"
        width={180}
        height={80}
        priority
        className={`h-9 sm:h-10 md:h-11 w-auto max-w-[132px] sm:max-w-[150px] md:max-w-[180px] object-contain object-left ${
          variant === "light" ? "invert brightness-0 drop-shadow-sm" : ""
        }`}
      />
    </div>
  );
};

export default Logo;