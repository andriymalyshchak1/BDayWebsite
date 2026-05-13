"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface EndingProps {
  onReplay: () => void;
}

// Tiny floating dust particles rendered on a canvas
function DustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.35 + 0.05,
      drift: (Math.random() - 0.5) * 0.2,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,240,232,${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />;
}

export default function Ending({ onReplay }: EndingProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 bg-[#080808] overflow-hidden"
    >
      <DustCanvas />

      <motion.p
        className="font-serif text-2xl md:text-3xl text-white/50 italic text-center relative z-10"
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Thanks for being part of my story.
      </motion.p>

      <motion.button
        onClick={onReplay}
        className="relative z-10 mt-14 px-6 md:px-10 py-3 border border-white/15 text-white/35 hover:text-white/70 hover:border-white/30 text-[10px] tracking-[0.4em] uppercase transition-all duration-500"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.8 }}
        whileHover={{ scale: 1.03, letterSpacing: "0.5em" }}
      >
        Replay
      </motion.button>
    </section>
  );
}
