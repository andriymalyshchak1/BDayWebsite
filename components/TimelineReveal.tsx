"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Same order as Timeline chapters
const TILES = [
  { label: "DroneWork",  src: "/media/droneWork/cover1.mp4"  },
  { label: "Rockets",    src: "/media/rockets/cover1.mp4"    },
  { label: "DECA",       src: "/media/deca/cover1.mp4"       },
  { label: "NailArt",    src: "/media/nailArt/cover1.mp4"    },
  { label: "Baking",     src: "/media/baking/cover1.mp4"     },
  { label: "Alabama",    src: "/media/alabama/cover1.mp4"    },
  { label: "Planes",     src: "/media/planes/cover1.mp4"     },
  { label: "Graduation", src: "/media/graduation/cover1.mp4" },
  { label: "Skiing",     src: "/media/skiing/cover1.mp4"     },
];

// Scattered reveal order — center-outward, feels alive not mechanical
const REVEAL_ORDER = [4, 0, 8, 2, 6, 1, 7, 3, 5];
const STAGGER_MS   = 3500;
const HOLD_MS      = 2500;
const FADE_MS      = 1100;
// Show "tap to continue" 3 s before the sequence auto-advances
const HINT_DELAY_S = (REVEAL_ORDER.length * STAGGER_MS + 300 + HOLD_MS - 3000) / 1000;

export default function TimelineReveal({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const [exiting, setExiting] = useState(false);

  const finish = () => {
    if (exiting) return;
    setExiting(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(onDone, FADE_MS);
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    REVEAL_ORDER.forEach((tileIdx, i) => {
      timers.push(setTimeout(() => {
        setVisible(prev => new Set(prev).add(tileIdx));
      }, i * STAGGER_MS + 300));
    });

    // Auto-advance after all revealed + hold
    timers.push(setTimeout(finish, REVEAL_ORDER.length * STAGGER_MS + 300 + HOLD_MS));

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[180] bg-[#080808] overflow-hidden cursor-pointer"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      onClick={finish}
    >
      {/* Equal 3×3 grid */}
      <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-[3px] p-[3px]">
        {TILES.map((tile, i) => (
          <motion.div
            key={tile.label}
            className="relative overflow-hidden bg-[#0e0e0e]"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={visible.has(i)
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Only mount the video element when the tile reveals — avoids
                loading all 9 videos simultaneously and saturating bandwidth */}
            {visible.has(i) && (
              <video
                className="absolute inset-0 w-full h-full object-contain"
                src={tile.src}
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
                disablePictureInPicture
                onCanPlay={(e) => { e.currentTarget.muted = true; e.currentTarget.play().catch(() => {}); }}
                onStalled={(e) => { e.currentTarget.muted = true; e.currentTarget.play().catch(() => {}); }}
                onWaiting={(e) => { e.currentTarget.muted = true; e.currentTarget.play().catch(() => {}); }}
              />
            )}
            {/* Bottom gradient + label */}
            <div
              className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }}
            />
            <p className="absolute bottom-2 left-3 text-white/50 text-[7px] tracking-[0.45em] uppercase pointer-events-none">
              {tile.label}
            </p>

            {/* Purple-tinted flash on entry */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "rgba(148,80,230,0.25)" }}
              initial={{ opacity: 1 }}
              animate={visible.has(i) ? { opacity: 0 } : { opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Skip hint */}
      <motion.p
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/25 text-[9px] tracking-[0.5em] uppercase pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: HINT_DELAY_S, duration: 0.8 }}
      >
        tap to continue
      </motion.p>
    </motion.div>
  );
}
