"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GateScreen from "./GateScreen";
import FadeScreen from "./FadeScreen";
import LoadingGate from "./LoadingGate";
import CastleIntro from "./CastleIntro";
import Timeline from "./Timeline";
import BirthdayLetter from "./BirthdayLetter";
import Ending from "./Ending";
import MusicToggle from "./MusicToggle";
import FilmGrain from "./FilmGrain";
import CinematicTransition, { TransitionType } from "./CinematicTransition";
import TimelineTitleCard from "./TimelineTitleCard";
import TimelineReveal from "./TimelineReveal";

type Stage = "loading" | "gate" | "fade" | "fade2" | "fade3" | "castle" | "main";

// ── Main stage: title card → mosaic reveal → scrollable timeline ─────────────
function MainStage({ onReplay, hozierAudio }: { onReplay: () => void; hozierAudio: HTMLAudioElement | null }) {
  const [titleDone,  setTitleDone]  = useState(false);
  const [revealDone, setRevealDone] = useState(false);

  return (
    <motion.div
      key="main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, ease: "easeInOut" }}
      className="min-h-screen bg-[#080808]"
    >
      <Timeline />
      <BirthdayLetter />
      <Ending onReplay={onReplay} />
      <MusicToggle src="/assets/hozier.mp3" label="Hozier — Too Sweet" externalAudio={hozierAudio} />

      {/* 1. Title card */}
      <AnimatePresence>
        {!titleDone && (
          <TimelineTitleCard key="title" onDone={() => setTitleDone(true)} />
        )}
      </AnimatePresence>

      {/* 2. Mosaic reveal — starts after title card dismisses */}
      <AnimatePresence>
        {titleDone && !revealDone && (
          <TimelineReveal key="reveal" onDone={() => setRevealDone(true)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Root experience ───────────────────────────────────────────────────────────
export default function BirthdayExperience() {
  const [stage, setStage]               = useState<Stage>("loading");
  const [transitioning, setTransitioning] = useState(false);
  const [txType, setTxType]             = useState<TransitionType>("letterbox");
  const nextStageRef                    = useRef<Stage>("fade");
  const hozierAudioRef                  = useRef<HTMLAudioElement | null>(null);

  // Pre-create Hozier audio so it buffers early and can be started inside a
  // click handler (required by iOS Safari's autoplay policy).
  useEffect(() => {
    const audio = new Audio("/assets/hozier.mp3");
    audio.loop = true;
    audio.volume = 0.45;
    hozierAudioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  // Pause Hozier whenever we leave the main stage (e.g. replay resets to gate)
  useEffect(() => {
    if (stage !== "main") {
      const a = hozierAudioRef.current;
      if (a && !a.paused) { a.pause(); a.currentTime = 0; }
    }
  }, [stage]);

  const transitionTo = useCallback((next: Stage, type: TransitionType) => {
    nextStageRef.current = next;
    setTxType(type);
    setTransitioning(true);
    setTimeout(() => setTransitioning(false), 1500);
  }, []);

  const handleMidpoint     = useCallback(() => setStage(nextStageRef.current), []);
  const handleGateEnter    = useCallback(() => transitionTo("fade",   "bloom"),    [transitionTo]);
  const handleFadeComplete  = useCallback(() => transitionTo("fade2",  "bloom"),   [transitionTo]);
  const handleFade2Complete = useCallback(() => transitionTo("fade3",  "bloom"),   [transitionTo]);
  const handleFade3Complete = useCallback(() => transitionTo("castle", "iris"),    [transitionTo]);
  const handleCastleEnter  = useCallback(() => {
    const audio = hozierAudioRef.current;
    if (audio) {
      // iOS requires the first .play() to happen inside a gesture handler.
      // We unlock the element here, pause immediately, then resume after
      // Gambino's 1800 ms fade + ~700 ms transition midpoint + 1 s gap ≈ 3.5 s.
      audio.volume = 0;
      audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {});
      setTimeout(() => {
        audio.volume = 0.45;
        audio.play().catch(() => {});
      }, 3500);
    }
    transitionTo("main", "burn");
  }, [transitionTo]);
  const handleReplay       = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => transitionTo("gate", "letterbox"), 600);
  }, [transitionTo]);

  return (
    <>
      <FilmGrain />
      <CinematicTransition active={transitioning} onMidpoint={handleMidpoint} type={txType} />
      {stage !== "main" && (
        <MusicToggle src="/assets/gambino.mp3" label="Childish Gambino" startTime={16} fadeOutMs={1800} />
      )}

      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <LoadingGate key="loading" onReady={() => setStage("gate")} />
        )}
        {stage === "gate" && (
          <GateScreen key="gate" onEnter={handleGateEnter} />
        )}
        {stage === "fade" && (
          <FadeScreen key="fade" onComplete={handleFadeComplete} />
        )}
        {stage === "fade2" && (
          <FadeScreen
            key="fade2"
            onComplete={handleFade2Complete}
            lines={[
              { text: "meanwhile…",                              delay: 0.2, size: "text-3xl md:text-4xl",  italic: true  },
              { text: "Nneoma's been terrorized for 20 years",   delay: 1.2, size: "text-2xl md:text-3xl",  italic: false },
              { text: "Tobenna still my favorite Obinabo",   delay: 1.2, size: "text-2xl md:text-3xl",  italic: false },
            ]}
            duration={5500}
          />
        )}
        {stage === "fade3" && (
          <FadeScreen
            key="fade3"
            onComplete={handleFade3Complete}
            lines={[
              { text: "Just kidding! I'd like to live to see another day",          delay: 0.2, size: "text-2xl md:text-3xl",  italic: false },
              { text: "Super proud of everything you've been able to accomplish",    delay: 1.4, size: "text-xl md:text-2xl",   italic: true  },
              { text: "One of the most gifted people I've ever met",    delay: 1.4, size: "text-xl md:text-2xl",   italic: true  },
            ]}
            duration={6000}
          />
        )}
        {stage === "castle" && (
          <CastleIntro key="castle" onEnter={handleCastleEnter} />
        )}
        {stage === "main" && (
          <MainStage key="main" onReplay={handleReplay} hozierAudio={hozierAudioRef.current} />
        )}
      </AnimatePresence>
    </>
  );
}
