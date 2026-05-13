"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const WireframePortrait = dynamic(() => import("./WireframePortrait"), { ssr: false });

const PORTRAIT_SRC = "/assets/ify-portrait.png";

// ── Gold particle field ────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 90 }, (_, idx) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.2,
      speed: Math.random() * 0.32 + 0.07,
      baseOpacity: Math.random() * 0.42 + 0.06,
      drift: (Math.random() - 0.5) * 0.22,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.022 + 0.007,
      // ~22 % of particles are purple/violet
      color: idx % 9 < 2 ? "148,80,230" : "201,168,76",
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.phase += p.twinkleSpeed;
        const alpha = p.baseOpacity * (0.45 + 0.55 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${alpha.toFixed(3)})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        else if (p.x > canvas.width + 4) p.x = -4;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// ── Rotating light rays ────────────────────────────────────────────────────────
function LightRays() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ inset: "-60%", zIndex: 2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 3 }}
    >
      <div
        className="w-full h-full"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 52%, transparent 0deg, rgba(201,168,76,0.028) 9deg, transparent 18deg, transparent 38deg, rgba(201,168,76,0.02) 47deg, transparent 56deg, transparent 75deg, rgba(201,168,76,0.035) 84deg, transparent 93deg, transparent 112deg, rgba(201,168,76,0.022) 121deg, transparent 130deg, transparent 149deg, rgba(201,168,76,0.028) 158deg, transparent 167deg, transparent 186deg, rgba(201,168,76,0.018) 195deg, transparent 204deg, transparent 223deg, rgba(201,168,76,0.03) 232deg, transparent 241deg, transparent 260deg, rgba(201,168,76,0.022) 269deg, transparent 278deg, transparent 297deg, rgba(201,168,76,0.028) 306deg, transparent 315deg, transparent 360deg)",
          animation: "rayRotate 32s linear infinite",
        }}
      />
    </motion.div>
  );
}

// ── Screen-edge vignette ───────────────────────────────────────────────────────
function Vignette() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)",
        zIndex: 3,
      }}
    />
  );
}

// ── Cinematic corner marks ─────────────────────────────────────────────────────
function CornerMarks() {
  const S = 36;
  const corners: { style: React.CSSProperties; d: string }[] = [
    { style: { top: 18, left: 18 },    d: `M ${S} 0 L 0 0 L 0 ${S}` },
    { style: { top: 18, right: 18 },   d: `M 0 0 L ${S} 0 L ${S} ${S}` },
    { style: { bottom: 18, left: 18 }, d: `M 0 ${S} L 0 0 L ${S} 0` },
    { style: { bottom: 18, right: 18 },d: `M 0 0 L ${S} 0 M ${S} 0 L ${S} ${S}` },
  ];

  return (
    <>
      {corners.map(({ style, d }, i) => (
        <motion.svg
          key={i}
          className="absolute pointer-events-none"
          style={{ ...style, zIndex: 12 }}
          width={S}
          height={S}
          viewBox={`0 0 ${S} ${S}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
        >
          <motion.path
            d={d}
            fill="none"
            stroke="rgba(201,168,76,0.5)"
            strokeWidth={1.2}
            strokeLinecap="square"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7 + i * 0.12, duration: 1.1, ease: "easeOut" }}
          />
        </motion.svg>
      ))}
    </>
  );
}

// ── Orbital ellipses ──────────────────────────────────────────────────────────
function OrbitalRings({ activating = false }: { activating?: boolean }) {
  const rings = [
    { rx: 310, ry: 125, tilt: 14,  dur: 26, dash: "10 18", opacity: 0.50, color: "201,168,76"  },
    { rx: 248, ry: 96,  tilt: -24, dur: 19, dash: "4 26",  opacity: 0.42, color: "148,80,230"  },
    { rx: 385, ry: 152, tilt: 4,   dur: 40, dash: "18 10", opacity: 0.28, color: "201,168,76"  },
    { rx: 175, ry: 68,  tilt: 38,  dur: 14, dash: "6 14",  opacity: 0.45, color: "148,80,230"  },
  ];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: "50%",
        top: "56%",
        width: 900,
        height: 900,
        marginLeft: -450,
        marginTop: -450,
        zIndex: 5,
      }}
      initial={{ opacity: 0, scale: 1 }}
      animate={activating
        ? { opacity: 0, scale: 0.25 }
        : { opacity: 1, scale: 1 }}
      transition={activating
        ? { duration: 1.0, ease: "easeIn" }
        : { delay: 0.4, duration: 2.0 }}
    >
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ transformOrigin: "450px 450px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: r.dur, repeat: Infinity, ease: "linear" }}
        >
          <svg
            width={900}
            height={900}
            viewBox="-450 -450 900 900"
            style={{ position: "absolute", inset: 0, transform: `rotate(${r.tilt}deg)`, transformOrigin: "450px 450px" }}
          >
            <ellipse
              cx={0} cy={0} rx={r.rx} ry={r.ry}
              fill="none"
              stroke={`rgba(${r.color},${r.opacity})`}
              strokeWidth={1.1}
              strokeDasharray={r.dash}
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Sonar pulse rings ─────────────────────────────────────────────────────────
function PulseRings() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: "50%",
        top: "56%",
        transform: "translate(-50%, -50%)",
        width: 700,
        height: 700,
        zIndex: 4,
      }}
    >
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: `1.5px solid ${i % 2 === 0 ? "rgba(201,168,76,0.55)" : "rgba(148,80,230,0.45)"}` }}
          initial={{ scale: 0.05, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 1.25,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Floating diamond shapes ───────────────────────────────────────────────────
function FloatingDiamonds() {
  const gems = [
    { x: "9%",  y: "18%", s: 10, delay: 0.4, dur: 6.5 },
    { x: "87%", y: "14%", s: 7,  delay: 1.1, dur: 7.2 },
    { x: "6%",  y: "60%", s: 12, delay: 0.7, dur: 5.8 },
    { x: "92%", y: "55%", s: 8,  delay: 1.6, dur: 8.0 },
    { x: "18%", y: "82%", s: 6,  delay: 0.2, dur: 6.0 },
    { x: "80%", y: "78%", s: 9,  delay: 1.9, dur: 7.5 },
    { x: "48%", y: "8%",  s: 7,  delay: 0.9, dur: 9.0 },
    { x: "50%", y: "93%", s: 6,  delay: 2.2, dur: 6.8 },
  ];

  return (
    <>
      {gems.map(({ x, y, s, delay, dur }, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: x, top: y, zIndex: 7 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.75, 0.75, 0], y: [0, -16, 0] }}
          transition={{ duration: dur, repeat: Infinity, delay, ease: "easeInOut" }}
        >
          <svg
            width={s * 2}
            height={s * 2}
            viewBox={`${-s} ${-s} ${s * 2} ${s * 2}`}
            overflow="visible"
          >
            <polygon
              points={`0,${-s} ${s},0 0,${s} ${-s},0`}
              fill="none"
              stroke="rgba(201,168,76,0.85)"
              strokeWidth={1.2}
            />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

// ── Portrait scan line ─────────────────────────────────────────────────────────
// ── Decorative divider ────────────────────────────────────────────────────────
function Divider() {
  return (
    <motion.div
      className="flex items-center justify-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.1, duration: 1.0 }}
    >
      <div className="h-px w-14 bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.38)]" />
      <span
        className="text-[8px] tracking-[0.55em] uppercase font-light"
        style={{ color: "rgba(201,168,76,0.45)" }}
      >
        ✦
      </span>
      <div className="h-px w-14 bg-gradient-to-l from-transparent to-[rgba(201,168,76,0.38)]" />
    </motion.div>
  );
}

// ── Letter-by-letter reveal ────────────────────────────────────────────────────
function LetterByLetter({
  text,
  className,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  startDelay?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: startDelay + i * 0.055, duration: 0.5, ease: "easeOut" }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

// ── Gate screen ────────────────────────────────────────────────────────────────
export default function GateScreen({ onEnter }: { onEnter: () => void }) {
  const [declined,   setDeclined]   = useState(false);
  const [activating, setActivating] = useState(false);

  const handleYes = () => {
    setActivating(true);
    setTimeout(onEnter, 1900);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-[#080808] flex flex-col items-center justify-center z-50 overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Atmosphere */}
      <ParticleField />
      <LightRays />
      <OrbitalRings activating={activating} />
      <PulseRings />
      <FloatingDiamonds />
      <Vignette />
      <CornerMarks />

      {/* Layered ambient glow — gold + purple pulses offset in phase */}
      <div
        aria-hidden
        className="glow-breathe absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background:
            "radial-gradient(ellipse 62% 72% at 50% 56%, rgba(201,168,76,0.13) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background:
            "radial-gradient(ellipse 28% 32% at 50% 52%, rgba(201,168,76,0.11) 0%, transparent 70%)",
          animation: "breathe 5.8s ease-in-out infinite 2s",
        }}
      />
      {/* ── Subtle purple ambient hue ────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background:
            "radial-gradient(ellipse 80% 90% at 20% 50%, rgba(120,50,210,0.10) 0%, transparent 60%), radial-gradient(ellipse 70% 80% at 82% 55%, rgba(100,40,190,0.08) 0%, transparent 55%)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background:
            "radial-gradient(ellipse 50% 60% at 50% 85%, rgba(130,50,220,0.09) 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Question + buttons */}
      <motion.div
        className="relative text-center"
        style={{ zIndex: 22 }}
        animate={{ opacity: activating ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {!declined ? (
            <motion.div
              key="question"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="space-y-7"
            >
              <h1 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
                <LetterByLetter text="Are you, Ify?" startDelay={0.9} />
              </h1>

              <Divider />

              <motion.div
                className="flex gap-8 md:gap-16 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4, duration: 0.8 }}
              >
                {[
                  { label: "Yes", action: handleYes },
                  { label: "No",  action: () => setDeclined(true) },
                ].map(({ label, action }) => (
                  <motion.button
                    key={label}
                    onClick={action}
                    className="relative px-7 py-2.5 text-white/75 hover:text-white text-[11px] tracking-[0.4em] uppercase border border-white/15 hover:border-white/40 transition-colors duration-400 group"
                    whileHover={{ scale: 1.06 }}
                    style={{ backdropFilter: "blur(4px)" }}
                  >
                    {label}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                      style={{ background: "linear-gradient(135deg, rgba(148,80,230,0.08), rgba(201,168,76,0.06))" }} />
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="declined"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <p className="font-serif text-2xl md:text-3xl text-white/70 italic">
                <LetterByLetter text="This magic is only for Ify." startDelay={0.1} />
              </p>
              <motion.button
                onClick={handleYes}
                className="text-white/40 hover:text-white/80 text-xs tracking-[0.3em] uppercase transition-colors duration-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.7 }}
                whileHover={{ scale: 1.06, letterSpacing: "0.4em" }}
              >
                Okay fine, I&apos;m Ify.
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Portrait */}
      <motion.div
        className="relative w-[320px] h-[427px] md:w-[945px] md:h-[1215px] mt-4"
        style={{ zIndex: 16 }}
        initial={{ opacity: 0, scale: 0.88, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.2, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <WireframePortrait src={PORTRAIT_SRC} className="w-full h-full" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, #080808 100%)",
          }}
        />
      </motion.div>

      {/* ── Activation build-up overlays ── */}
      {/* 1. Gold aura surge — intensifies the existing glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 60,
          background:
            "radial-gradient(ellipse 70% 80% at 50% 56%, rgba(180,120,255,0.55) 0%, rgba(148,80,230,0.15) 45%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: activating ? 1 : 0 }}
        transition={{ duration: activating ? 0.7 : 0.2, ease: "easeIn" }}
      />
      {/* 2. White-gold bloom — expands from centre and fills the screen */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 70,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(230,210,255,1) 0%, rgba(180,120,255,0.85) 30%, rgba(148,80,230,0.3) 60%, transparent 80%)",
        }}
        initial={{ opacity: 0, scale: 0.15 }}
        animate={activating
          ? { opacity: 1, scale: 2.8 }
          : { opacity: 0, scale: 0.15 }}
        transition={activating
          ? { duration: 1.7, ease: [0.22, 1, 0.36, 1] }
          : { duration: 0.1 }}
      />
    </motion.div>
  );
}
