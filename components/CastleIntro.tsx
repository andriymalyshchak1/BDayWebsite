"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import MusicToggle from "./MusicToggle";

interface CastleIntroProps {
  onEnter: () => void;
}

export default function CastleIntro({ onEnter }: CastleIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Background video — replace src with your converted .mp4 */}
      <video
        ref={videoRef}
        src="/assets/castle-intro-compressed.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
      />

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.p
          className="font-serif text-4xl md:text-6xl text-white font-medium tracking-wide drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
        >
          Ify&apos;s Birthday ;)
        </motion.p>

        <motion.p
          className="mt-4 text-white/60 text-sm md:text-base tracking-[0.12em] font-light italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          Happy 21st ur THE goat 🐐
        </motion.p>

        <motion.button
          onClick={onEnter}
          className="mt-12 px-6 md:px-10 py-3 border border-white/30 text-white/80 hover:text-white hover:border-white/60 text-sm tracking-[0.25em] uppercase transition-all duration-500 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          Enter
        </motion.button>
      </div>

      {/* Music toggle — plays /assets/magical-music.mp3 */}
      <MusicToggle src="/assets/magical-music.mp3" />
    </motion.div>
  );
}
