"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function TimelineTitleCard({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#080808] flex flex-col items-center justify-center gap-0 overflow-hidden"
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 1.4, ease: "easeInOut" }}
    >
      {/* Purple glow — lower left */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 55% at 18% 68%, rgba(148,80,230,0.14) 0%, transparent 65%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2.0 }}
      />
      {/* Purple glow — upper right */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 45% at 80% 30%, rgba(148,80,230,0.10) 0%, transparent 60%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 2.5 }}
      />
      {/* Gold centre glow behind name */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 35% 30% at 50% 50%, rgba(201,168,76,0.09) 0%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.8 }}
      />

      {/* Small descriptor */}
      <motion.p
        className="text-[9px] tracking-[0.65em] uppercase font-light mb-10"
        style={{ color: "rgba(201,168,76,0.55)" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9 }}
      >
        A story in chapters
      </motion.p>

      {/* Top line draws down — purple → gold */}
      <motion.div
        className="w-px mb-10"
        style={{ background: "linear-gradient(to bottom, rgba(148,80,230,0.5), rgba(201,168,76,0.35))" }}
        initial={{ height: 0 }}
        animate={{ height: 56 }}
        transition={{ delay: 0.55, duration: 0.8, ease: "easeOut" }}
      />

      {/* The name — blurs into focus */}
      <motion.h1
        className="font-serif text-[48px] md:text-[80px] lg:text-[110px] text-white font-light tracking-[0.06em] leading-none"
        initial={{ opacity: 0, scale: 0.94, filter: "blur(18px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 1.0, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      >
        Ify
      </motion.h1>

      {/* Bottom line draws up — gold → purple */}
      <motion.div
        className="w-px mt-10"
        style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.35), rgba(148,80,230,0.5))" }}
        initial={{ height: 0 }}
        animate={{ height: 56 }}
        transition={{ delay: 1.9, duration: 0.8, ease: "easeOut" }}
      />

      {/* Subtitle */}
      <motion.p
        className="mt-9 text-white/35 text-[11px] tracking-[0.45em] uppercase font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.0 }}
      >
        The Timeline
      </motion.p>

      {/* Year / occasion */}
      <motion.p
        className="mt-3 text-[8px] tracking-[0.55em] uppercase"
        style={{ color: "rgba(148,80,230,0.5)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.9 }}
      >
        Happy Birthday
      </motion.p>
    </motion.div>
  );
}
