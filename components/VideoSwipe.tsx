"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoSwipeProps {
  cover1?: string;  // path like "/media/rockets/cover1.mp4"
  cover2?: string;
  label: string;    // chapter label shown top-left
  placeholder?: boolean;
}

export default function VideoSwipe({ cover1, cover2, label, placeholder }: VideoSwipeProps) {
  const [active, setActive]       = useState(0); // 0 = cover1, 1 = cover2
  const [dragging, setDragging]   = useState(false);
  const vid0 = useRef<HTMLVideoElement>(null);
  const vid1 = useRef<HTMLVideoElement>(null);

  // Play whichever video is active, pause the other
  useEffect(() => {
    const refs = [vid0, vid1];
    refs.forEach((r, i) => {
      if (!r.current) return;
      if (i === active) {
        r.current.play().catch(() => {});
      } else {
        r.current.pause();
        r.current.currentTime = 0;
      }
    });
  }, [active]);

  const advance = (dir: 1 | -1) => {
    setActive(prev => (prev + dir + 2) % 2);
  };

  if (placeholder) {
    return (
      <div className="relative w-full aspect-[3/4] md:aspect-[4/3] bg-[#111] flex items-center justify-center rounded-sm overflow-hidden border border-white/8">
        <div className="text-center space-y-2">
          <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase">{label}</p>
          <p className="text-white/12 text-xs italic">work on this</p>
        </div>
      </div>
    );
  }

  const videos = [cover1!, cover2!].filter(Boolean);
  const hasBoth = videos.length === 2;

  return (
    <div className="relative w-full aspect-[3/4] md:aspect-[4/3] rounded-sm overflow-hidden bg-black select-none">
      {/* Video layers — stack both, show active via opacity */}
      {[cover1, cover2].map((src, i) => src && (
        <motion.video
          key={src}
          ref={i === 0 ? vid0 : vid1}
          className="absolute inset-0 w-full h-full object-contain"
          src={src}
          autoPlay={i === 0}
          muted
          playsInline
          loop
          animate={{ opacity: active === i ? 1 : 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        />
      ))}

      {/* Swipe / drag handler — invisible overlay */}
      {hasBoth && (
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            if (Math.abs(info.offset.x) < 40) return;
            advance(info.offset.x < 0 ? 1 : -1);
          }}
          onClick={() => { if (!dragging) advance(1); }}
        />
      )}

      {/* Chapter label — top left */}
      <div className="absolute top-3 left-4 z-20 pointer-events-none">
        <p className="text-white/50 text-[9px] tracking-[0.45em] uppercase">{label}</p>
      </div>

      {/* Dot indicator — bottom centre */}
      {hasBoth && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
          {[0, 1].map(i => (
            <motion.div
              key={i}
              className="rounded-full bg-white"
              animate={{ width: active === i ? 18 : 6, opacity: active === i ? 0.9 : 0.35 }}
              transition={{ duration: 0.3 }}
              style={{ height: 4 }}
            />
          ))}
        </div>
      )}

      {/* Subtle gradient overlay at bottom for readability */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-[5]"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}
      />
    </div>
  );
}
