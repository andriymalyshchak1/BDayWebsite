"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

interface PauseMomentProps {
  image?: string; // e.g. /assets/pause-photo.jpg — required for full impact
  text?: string;
}

export default function PauseMoment({
  image,
  text = "This one mattered.",
}: PauseMomentProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="relative w-full min-h-[70vh] md:min-h-screen flex items-center justify-center my-12 md:my-20 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* Full-width image — replace with your most impactful photo */}
      {image ? (
        <Image
          src={image}
          alt={text}
          fill
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-midnight/80 via-black to-blush/10" />
      )}

      {/* Heavy overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Centered text — minimal UI, let the moment breathe */}
      <motion.p
        className="relative z-10 font-serif text-2xl md:text-4xl text-white/90 italic text-center px-8 max-w-2xl"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
}
