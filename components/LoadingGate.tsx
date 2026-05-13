"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function LoadingGate({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    let resolved = false;
    const resolve = () => { if (!resolved) { resolved = true; onReady(); } };

    let imgDone = false;
    let minTimeDone = false;
    const tryResolve = () => { if (imgDone && minTimeDone) resolve(); };

    // Preload the portrait so the wireframe has its texture ready
    const img = new window.Image();
    img.onload  = () => { imgDone = true; tryResolve(); };
    img.onerror = () => { imgDone = true; tryResolve(); };
    img.src = "/assets/ify-portrait.png";

    // Minimum 1 s so the screen doesn't flash in/out on fast connections
    const minTimer = setTimeout(() => { minTimeDone = true; tryResolve(); }, 1000);

    // Hard cap — fail open after 5 s so a slow network never blocks forever
    const maxTimer = setTimeout(resolve, 5000);

    return () => { clearTimeout(minTimer); clearTimeout(maxTimer); resolved = true; };
  }, [onReady]);

  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-[#080808] flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <motion.span
        className="font-serif text-xl select-none"
        style={{ color: "rgba(201,168,76,0.4)" }}
        animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.92, 1.08, 0.92] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        ✦
      </motion.span>

      <motion.div
        className="mt-7 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.28), transparent)" }}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 72, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
      />
    </motion.div>
  );
}
