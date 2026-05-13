"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface Line {
  text: string;
  delay: number;
  size: string;
  italic: boolean;
}

interface FadeScreenProps {
  onComplete: () => void;
  lines?: Line[];
  duration?: number;
}

const DEFAULT_LINES: Line[] = [
  { text: "Ify's 21!",              delay: 0.2, size: "text-5xl md:text-7xl", italic: false },
  { text: "basically a grandma...", delay: 1.1, size: "text-2xl md:text-3xl", italic: true  },
];

export default function FadeScreen({ onComplete, lines = DEFAULT_LINES, duration = 5200 }: FadeScreenProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, duration);
    return () => clearTimeout(t);
  }, [onComplete, duration]);

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-40 gap-5 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Purple glow — left side, fades in slowly */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 20% 55%, rgba(148,80,230,0.18) 0%, transparent 65%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 2.2 }}
      />
      {/* Purple glow — right side, slightly delayed */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 50% at 82% 45%, rgba(148,80,230,0.12) 0%, transparent 60%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 2.5 }}
      />
      {/* Subtle gold centre bloom behind text */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.8 }}
      />

      {/* Text lines */}
      {lines.map(({ text, delay, size, italic }: Line, i: number) => (
        <motion.p
          key={i}
          className={`relative z-10 font-serif ${size} text-white text-center px-8 ${italic ? "italic text-white/60" : "font-medium"}`}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay, duration: 1.1, ease: "easeOut" }}
        >
          {text}
        </motion.p>
      ))}

      {/* Decorative thin line — purple-gold gradient */}
      <motion.div
        className="relative z-10 w-px"
        style={{
          background: "linear-gradient(to bottom, rgba(148,80,230,0.5), rgba(201,168,76,0.3), rgba(148,80,230,0.5))",
          marginTop: 24,
        }}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 48, opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      />

      {/* Whole-screen fade-out veil */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8, duration: 1.2 }}
      />
    </motion.div>
  );
}
