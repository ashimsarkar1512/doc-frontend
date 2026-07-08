"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface FallbackImageProps extends Omit<ImageProps, "onError" | "src"> {
  src: string;
  fallbackSrc: string;
}

export default function FallbackImage({ src, fallbackSrc, ...rest }: FallbackImageProps) {
  const [errorSrc, setErrorSrc] = useState<string | null>(null);

  return (
    <Image
      {...rest}
      src={errorSrc === src ? fallbackSrc : (src || fallbackSrc)}
      onError={() => {
        setErrorSrc(src);
      }}
    />
  );
}
