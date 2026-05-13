"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── EDIT LETTER CONTENT HERE ────────────────────────────────────────────────
const PARAGRAPHS = [
  "I've known you for so long that it's hard to fit everything into one page.",
  "But I hope this reminds you how many moments, phases, and memories have made you such an important part of my life.",
  "You've shown up in so many different forms — the silly version, the serious version, the version that was figuring everything out with me.",
];
const CLOSING = "I'm grateful to have you in my life.";
const FINAL = "Happy Birthday, bestie.";
// ─────────────────────────────────────────────────────────────────────────────

function WordReveal({ text, className, baseDelay = 0 }: { text: string; className?: string; baseDelay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: baseDelay + i * 0.06, duration: 0.6, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function BirthdayLetter() {
  const finalRef = useRef(null);
  const finalInView = useInView(finalRef, { once: true, margin: "-80px" });

  return (
    <section className="relative bg-[#080808] overflow-hidden">
      {/* Soft radial glow behind the letter */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(242,196,206,0.05) 0%, transparent 70%)" }}
      />

      {/* Letter body */}
      <div className="relative max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-12 text-center space-y-10">
        {/* Greeting */}
        <motion.h2
          className="font-serif text-5xl md:text-6xl text-white/90 font-medium"
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Ify,
        </motion.h2>

        <motion.div
          className="mx-auto w-10 h-px bg-white/15"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        />

        {/* Body paragraphs — word by word */}
        <div className="space-y-7">
          {PARAGRAPHS.map((para, i) => (
            <p key={i} className="text-white/65 text-lg md:text-xl leading-relaxed font-light">
              <WordReveal text={para} baseDelay={i * 0.1} />
            </p>
          ))}
        </div>

        {/* Emotional peak line */}
        <p className="font-serif text-2xl md:text-3xl text-white/75 italic">
          <WordReveal text={CLOSING} baseDelay={0.2} />
        </p>
      </div>

      {/* Final line — full viewport height, centered, large */}
      <div
        ref={finalRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-8 text-center"
      >
        {/* Gold shimmer behind final text */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={finalInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 2 }}
          style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)" }}
        />

        <motion.p
          className="font-serif text-4xl md:text-6xl lg:text-8xl text-white font-semibold tracking-wide leading-tight"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(16px)" }}
          animate={finalInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {FINAL}
        </motion.p>

        {/* Subtitle breath */}
        <motion.p
          className="mt-8 text-white/25 text-xs tracking-[0.4em] uppercase"
          initial={{ opacity: 0 }}
          animate={finalInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 1 }}
        >
          Andriy
        </motion.p>
      </div>
    </section>
  );
}
