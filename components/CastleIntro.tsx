"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CastleIntroProps {
  onEnter: () => void;
}

export default function CastleIntro({ onEnter }: CastleIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true; // set as JS property — more reliable than the HTML attribute alone
    video.play().catch(() => {});
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <video
        ref={videoRef}
        src="/assets/castle-intro-compressed.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop
        onCanPlay={(e) => { e.currentTarget.muted = true; e.currentTarget.play().catch(() => {}); }}
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
    </motion.div>
  );
}
