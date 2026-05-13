"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import VideoSwipe from "./VideoSwipe";

// ─── Chapter definitions — order: DroneWork, Rockets, DECA, DressProm,
//     Graduation, Alabama, Baking ─────────────────────────────────────────────
const CHAPTERS = [
  {
    label:  "DroneWork",
    title:  "MVP at work",
    cover1: "/media/droneWork/cover1.mp4",
    cover2: "/media/droneWork/cover2.mp4",
  },
  {
    label:  "Rockets",
    title:  "I think this one might've blown up?",
    cover1: "/media/rockets/cover1.mp4",
    cover2: "/media/rockets/cover2.mp4",
  },
  {
    label:  "DECA",
    title:  "Corporate weapon...wow!!",
    cover1: "/media/deca/cover1.mp4",
    cover2: "/media/deca/cover2.mp4",
  },
  {
    label:  "NailArt",
    title:  "Amazing very very impressive idk how you do it",
    cover1: "/media/nailArt/cover1.mp4",
    cover2: "/media/nailArt/cover2.mp4",
  },
  {
    label:  "Graduation",
    title:  "Dk how they let you graduate jkjk",
    cover1: "/media/graduation/cover1.mp4",
    cover2: "/media/graduation/cover2.mp4",
  },
  {
    label:  "Alabama",
    title:  "My favorite Texas game in 4 years can't believe we won",
    cover1: "/media/alabama/cover1.mp4",
    cover2: "/media/alabama/cover2.mp4",
  },
  {
    label:  "Planes",
    title:  "We didn't crash lol still surprises me sometimes",
    cover1: "/media/planes/cover1.mp4",
    cover2: "/media/planes/cover2.mp4",
  },
  {
    label:  "Baking",
    title:  "Literal goat or just metaphoric? probably literal...also very impressive",
    cover1: "/media/baking/cover1.mp4",
    cover2: "/media/baking/cover2.mp4",
  },
  {
    label:  "Skiing",
    title:  "We didn't die! Everyone did so well I still keep thinking about that.",
    cover1: "/media/skiing/cover1.mp4",
    cover2: "/media/skiing/cover2.mp4",
  },
] as const;

// Scroll-driven background tint
const BG_STOPS = [
  "rgba(8,8,8,1)",
  "rgba(10,12,22,1)",
  "rgba(8,8,8,1)",
  "rgba(14,8,10,1)",
  "rgba(8,8,8,1)",
  "rgba(10,14,8,1)",
  "rgba(8,8,8,1)",
];

function ScrollBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const background = useTransform(
    scrollYProgress,
    BG_STOPS.map((_, i) => i / (BG_STOPS.length - 1)),
    BG_STOPS,
  );
  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ background }}
    />
  );
}

// Single chapter block
function ChapterBlock({
  chapter,
  index,
}: {
  chapter: (typeof CHAPTERS)[number];
  index: number;
}) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // even index: text left, video right — odd index: video left, text right
  const textLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col md:flex-row ${textLeft ? "" : "md:flex-row-reverse"} items-center gap-8 md:gap-12 mb-24 md:mb-36`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 * index }}
    >
      {/* Text — 15% */}
      <div className={`w-full md:w-[15%] ${textLeft ? "md:text-left" : "md:text-right"} text-center`}>
        <p className="text-[9px] tracking-[0.5em] uppercase mb-4" style={{ color: "rgba(201,168,76,0.55)" }}>
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="font-serif text-lg md:text-2xl lg:text-3xl text-white/80 font-light leading-snug">
          {chapter.title}
        </h3>
        <motion.div
          className={`h-px mt-5 mx-auto ${textLeft ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"}`}
          style={{ background: "rgba(201,168,76,0.3)", width: 0 }}
          animate={inView ? { width: 48 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
        />
      </div>

      {/* Video — 85% */}
      <div className="w-full md:w-[85%]">
        {"placeholder" in chapter && chapter.placeholder ? (
          <VideoSwipe label={chapter.label} placeholder />
        ) : (
          <VideoSwipe
            label={chapter.label}
            cover1={"cover1" in chapter ? chapter.cover1 : undefined}
            cover2={"cover2" in chapter ? chapter.cover2 : undefined}
          />
        )}
      </div>
    </motion.div>
  );
}

export default function Timeline() {
  const headerRef = useRef(null);
  const inView    = useInView(headerRef, { once: true });

  return (
    <section className="relative bg-[#080808] overflow-hidden">
      <ScrollBackground />

      {/* Section header */}
      <div ref={headerRef} className="relative text-center pt-28 pb-16 px-6">
        <motion.p
          className="text-white/25 text-[10px] tracking-[0.45em] uppercase mb-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          The Story So Far
        </motion.p>

        <motion.h2
          className="font-serif text-4xl md:text-5xl lg:text-7xl text-white font-medium"
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ delay: 0.2, duration: 1.1, ease: "easeOut" }}
        >
          Moments Timeline
        </motion.h2>

        <motion.p
          className="mt-5 text-white/35 text-sm tracking-[0.2em] uppercase italic font-light"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Swipe each chapter to see more.
        </motion.p>

        <motion.div
          className="mx-auto mt-12 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent"
          initial={{ height: 0 }}
          animate={inView ? { height: 80 } : {}}
          transition={{ delay: 0.9, duration: 0.9 }}
        />
      </div>

      {/* Chapters */}
      <div className="relative max-w-5xl mx-auto px-6 pb-32">
        {CHAPTERS.map((ch, i) => (
          <ChapterBlock key={ch.label} chapter={ch} index={i} />
        ))}
      </div>
    </section>
  );
}
