"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ROMAN = ["I", "II", "III", "IV", "V"];

interface ChapterCardProps {
  index: number;   // 0-based
  title: string;
}

export default function ChapterCard({ index, title }: ChapterCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center py-32 md:py-44 overflow-hidden select-none"
    >
      {/* Giant faint numeral behind everything */}
      <motion.span
        aria-hidden
        className="absolute font-serif text-[22vw] md:text-[18vw] text-white/[0.025] pointer-events-none leading-none"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        {ROMAN[index] ?? index + 1}
      </motion.span>

      {/* Chapter label */}
      <motion.span
        className="text-white/30 text-[10px] tracking-[0.45em] uppercase mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Chapter {ROMAN[index] ?? index + 1}
      </motion.span>

      {/* Chapter title */}
      <motion.h2
        className="font-serif text-2xl md:text-4xl text-white/80 text-center max-w-lg px-6 italic"
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
      >
        {title}
      </motion.h2>

      {/* Decorative line */}
      <motion.div
        className="mt-10 w-px bg-gradient-to-b from-white/20 to-transparent"
        initial={{ height: 0 }}
        animate={inView ? { height: 56 } : {}}
        transition={{ delay: 0.8, duration: 0.7 }}
      />
    </div>
  );
}
