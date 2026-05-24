import Image from "next/image";
import React from "react";

interface LogoProps {
  variant?: "light" | "dark";
}

const Logo = ({ variant = "dark" }: LogoProps) => {
  return (
    <div>
      <Image
        src="/logo.png"
        alt="logo"
        width={180}
        height={80}
        className={
          variant === "light"
            ? "invert brightness-0"
            : ""
        }
        style={{ width: "auto", height: "auto" }}
      />
    </div>
  );
};

export default Logo;