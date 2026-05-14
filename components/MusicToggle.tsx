"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicToggleProps {
  src: string;
  label?: string;
  startTime?: number;
  fadeOutMs?: number;
  /** Pre-created audio element — used when audio must start inside a click
   *  handler (iOS gesture requirement). MusicToggle controls UI only. */
  externalAudio?: HTMLAudioElement | null;
}

export default function MusicToggle({
  src,
  label = "Hozier — Too Sweet",
  startTime = 0,
  fadeOutMs = 0,
  externalAudio,
}: MusicToggleProps) {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // ── External audio path (Hozier) ─────────────────────────────────────
    if (externalAudio) {
      audioRef.current = externalAudio;
      if (!externalAudio.paused) setStarted(true);
      const onPlay = () => setStarted(true);
      externalAudio.addEventListener("play", onPlay);
      // Lifecycle managed by the parent — don't pause/destroy here
      return () => externalAudio.removeEventListener("play", onPlay);
    }

    // ── Self-managed audio path (Gambino) ────────────────────────────────
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    // iOS ignores currentTime seeks before readyState >= HAVE_METADATA.
    // Apply the seek once metadata is available, and re-apply before every play()
    // so it survives a reset (e.g. when autoplay is blocked and user unlocks later).
    const applyStartTime = () => { if (startTime > 0) audio.currentTime = startTime; };
    if (audio.readyState >= 1) {
      applyStartTime();
    } else {
      audio.addEventListener("loadedmetadata", applyStartTime, { once: true });
    }

    // Try immediate autoplay; if blocked, start on first user gesture
    audio.play().then(() => setStarted(true)).catch(() => {
      const unlock = () => {
        applyStartTime(); // re-apply in case iOS reset currentTime
        audio.play().then(() => setStarted(true)).catch(() => {});
      };
      document.addEventListener("click", unlock, { once: true });
      document.addEventListener("touchstart", unlock, { once: true });
    });

    // Pause while easter egg is open; resume when it closes
    const onEggOpen  = () => { if (!audio.paused) audio.pause(); };
    const onEggClose = () => { if (audio.paused && !audio.ended) audio.play().catch(() => {}); };
    window.addEventListener("egg:open",  onEggOpen);
    window.addEventListener("egg:close", onEggClose);

    return () => {
      window.removeEventListener("egg:open",  onEggOpen);
      window.removeEventListener("egg:close", onEggClose);
      if (fadeOutMs > 0 && !audio.paused) {
        const startVol = audio.volume;
        const interval = 50;
        const steps = fadeOutMs / interval;
        const stepSize = startVol / steps;
        let vol = startVol;
        const timer = setInterval(() => {
          vol -= stepSize;
          if (vol <= 0) {
            audio.volume = 0;
            audio.pause();
            audio.src = "";
            clearInterval(timer);
          } else {
            audio.volume = vol;
          }
        }, interval);
      } else {
        audio.pause();
        audio.src = "";
      }
    };
  }, [src, fadeOutMs, externalAudio]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (!started) {
      audioRef.current.play().then(() => setStarted(true)).catch(() => {});
      setMuted(false);
      return;
    }
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const marqueeText = `${label}   ·   ${label}   ·   ${label}   ·   `;

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.7 }}
    >
      {/* Scrolling label — only show when playing */}
      <AnimatePresence>
        {started && !muted && (
          <motion.div
            className="overflow-hidden h-4 flex items-center w-[45vw] md:w-[20rem]"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "min(320px, 45vw)" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              className="text-white/50 text-[10px] tracking-widest uppercase whitespace-nowrap leading-none"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              {marqueeText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute / unmute icon button */}
      <button
        onClick={toggle}
        aria-label={muted || !started ? "Unmute" : "Mute"}
        className="text-white/50 hover:text-white/80 transition-colors duration-300"
      >
        {muted || !started ? (
          // Speaker only — no X
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          </svg>
        ) : (
          // Speaker on with wave
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </motion.div>
  );
}
