"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export const ScrollRevealText = ({ text, className = "" }: ScrollRevealTextProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 50%"],
  });

  const words = text.split(" ");

  return (
    <h2 ref={containerRef} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </h2>
  );
};

const Word = ({ children, progress, range }: any) => {
  const opacity = useTransform(progress, range, [0.3, 1]);
  const color = useTransform(progress, range, ["#9ca3af", "#111827"]);

  return (
    <span className="relative mr-1.5 md:mr-2 inline-block">
      <span className="absolute opacity-30 text-[#9ca3af]">{children}</span>
      <motion.span style={{ opacity, color }}>{children}</motion.span>
    </span>
  );
};
