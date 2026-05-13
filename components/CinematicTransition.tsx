"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type TransitionType = "letterbox" | "bloom" | "iris" | "burn";

interface CinematicTransitionProps {
  active: boolean;
  onMidpoint: () => void;
  type?: TransitionType;
}

export default function CinematicTransition({
  active,
  onMidpoint,
  type = "letterbox",
}: CinematicTransitionProps) {
  useEffect(() => {
    if (!active) return;
    const delay = type === "burn" ? 550 : 700;
    const t = setTimeout(onMidpoint, delay);
    return () => clearTimeout(t);
  }, [active, onMidpoint, type]);

  return (
    <AnimatePresence>
      {active && (
        type === "iris"  ? <IrisWipe    key="iris"  /> :
        type === "burn"  ? <FilmBurn    key="burn"  /> :
        type === "bloom" ? <Bloom       key="bloom" /> :
                           <Letterbox   key="lbox"  />
      )}
    </AnimatePresence>
  );
}

// ── Letterbox (gate default) ──────────────────────────────────────────────────
function Letterbox() {
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-[1000] bg-black origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        style={{ height: "52vh" }}
      />
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[1000] bg-black origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        style={{ height: "52vh" }}
      />
    </>
  );
}

// ── Bloom — black fade (gate → fade) ─────────────────────────────────────────
function Bloom() {
  return (
    <motion.div
      className="fixed inset-0 z-[1000] bg-[#080808]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  );
}

// ── Iris wipe — circle closes then opens (fade → castle) ─────────────────────
function IrisWipe() {
  return (
    <motion.div
      className="fixed inset-0 z-[1000] bg-[#080808]"
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ clipPath: "circle(0% at 50% 50%)" }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
    />
  );
}

// ── Film burn — horizontal gold streak sweeps left → right (castle → main) ───
function FilmBurn() {
  return (
    <>
      {/* Dark backdrop fades in behind the streak */}
      <motion.div
        className="fixed inset-0 z-[1000] bg-[#080808]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.38, ease: "easeIn" }}
      />
      {/* Bright streak sweeps left→right */}
      <motion.div
        className="fixed top-0 bottom-0 z-[1001]"
        style={{
          width: "42%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(180,120,255,0.35) 25%, rgba(220,190,255,0.92) 50%, rgba(180,120,255,0.35) 75%, transparent 100%)",
          boxShadow: "0 0 60px 20px rgba(148,80,230,0.22)",
        }}
        initial={{ left: "-42%" }}
        animate={{ left: "105%" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.68, ease: [0.4, 0, 0.6, 1] }}
      />
    </>
  );
}
