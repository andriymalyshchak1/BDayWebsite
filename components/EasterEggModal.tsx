"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CORRECT   = "michelle";
const SONG_SRC  = "/media/easterEgg/Down.mp3";
const EGG_IMG   = "/media/easterEgg/IfyLol.png";
const START_SEC = 10;

function EggMusic() {
  const [started, setStarted] = useState(false);
  const [muted,   setMuted]   = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(SONG_SRC);
    audio.loop   = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    const applyStart = () => { audio.currentTime = START_SEC; };
    if (audio.readyState >= 1) applyStart();
    else audio.addEventListener("loadedmetadata", applyStart, { once: true });

    audio.play().then(() => setStarted(true)).catch(() => {
      const unlock = () => { applyStart(); audio.play().then(() => setStarted(true)).catch(() => {}); };
      document.addEventListener("click",      unlock, { once: true });
      document.addEventListener("touchstart", unlock, { once: true });
    });

    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (!started) { a.play().then(() => setStarted(true)).catch(() => {}); setMuted(false); return; }
    a.muted = !muted;
    setMuted(!muted);
  };

  const marquee = "Down   ·   Down   ·   Down   ·   ";

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-[300] flex items-center gap-3"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.7 }}
    >
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
              {marquee}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggle}
        aria-label={muted || !started ? "Unmute" : "Mute"}
        className="text-white/50 hover:text-white/80 transition-colors duration-300"
      >
        {muted || !started ? (
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          </svg>
        ) : (
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

export default function EasterEggModal({ onClose }: { onClose: () => void }) {
  const [input,  setInput]  = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");

  // Pause all other site music while the egg is open; resume on close
  useEffect(() => {
    window.dispatchEvent(new Event("egg:open"));
    return () => { window.dispatchEvent(new Event("egg:close")); };
  }, []);

  const submit = () => {
    if (input.trim().toLowerCase() === CORRECT) setStatus("correct");
    else setStatus("wrong");
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#080808] flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back — always on top */}
      <motion.button
        onClick={onClose}
        className="fixed top-6 left-6 z-[310] text-white/35 hover:text-white/75 text-[10px] tracking-[0.35em] uppercase transition-colors duration-300 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        ← Back
      </motion.button>

      <AnimatePresence mode="wait">
        {status !== "correct" ? (
          <motion.div
            key="question"
            className="flex flex-col items-center gap-8 text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-serif text-2xl md:text-3xl text-white/80 tracking-wide">
              What&apos;s ur middle name?
            </p>

            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="..."
              autoFocus
              className="bg-transparent border-b border-white/20 focus:border-white/50 outline-none text-white text-center text-lg tracking-[0.2em] w-52 pb-1 transition-colors duration-300 placeholder:text-white/20"
            />

            <AnimatePresence>
              {status === "wrong" && (
                <motion.p
                  key="wrong"
                  className="text-white/40 text-[10px] tracking-[0.45em] uppercase"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  Try Again
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              onClick={submit}
              className="px-8 py-2.5 border border-white/15 hover:border-white/40 text-white/55 hover:text-white/90 text-[10px] tracking-[0.4em] uppercase transition-all duration-400"
              whileHover={{ scale: 1.04 }}
            >
              Submit
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            className="fixed inset-0 bg-[#000000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative w-[90vw] h-[90vh]"
              initial={{ scale: 0.88, filter: "blur(10px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={EGG_IMG}
                alt="Easter egg"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {status === "correct" && <EggMusic />}
    </motion.div>
  );
}
