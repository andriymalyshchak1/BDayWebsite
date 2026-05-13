"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

export interface TimelineEntry {
  era: string;
  title: string;
  caption: string;
  note?: string;
  image?: string;
  side?: "left" | "right";
}

interface TimelineItemProps extends TimelineEntry {
  index: number;
}

export default function TimelineItem({ era, title, caption, note, image, side = "left", index }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isRight = side === "right";

  // 3D tilt on hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-80, 80], [6, -6]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-120, 120], [-8, 8]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-0 md:gap-8 ${isRight ? "md:flex-row-reverse" : "md:flex-row"} flex-col mb-4 md:mb-8`}
    >
      {/* Desktop timeline dot */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-8 z-10">
        <motion.div
          className="w-2 h-2 rounded-full bg-white/30 ring-4 ring-white/5"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.4 }}
        />
      </div>

      {/* Mobile era tag */}
      <div className="flex md:hidden items-center gap-3 mb-4 pl-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
        <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase">{era}</span>
      </div>

      {/* Card */}
      <motion.div
        className={`w-full md:w-[calc(50%-3rem)] ${isRight ? "md:mr-[calc(50%+3rem)]" : "md:ml-[calc(50%+3rem)]"} pl-4 md:pl-0`}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ delay: index * 0.04 + 0.1, duration: 0.85, ease: "easeOut" }}
      >
        {/* Era — desktop */}
        <motion.span
          className="hidden md:block text-white/25 text-[10px] tracking-[0.35em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.04 + 0.3, duration: 0.5 }}
        >
          {era}
        </motion.span>

        {/* Image */}
        <motion.div
          className="relative w-full aspect-[4/3] overflow-hidden mb-5 bg-white/[0.03] rounded-sm"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: index * 0.04 + 0.2, duration: 1, ease: "easeOut" }}
        >
          {image ? (
            <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px)100vw,45vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/10 text-xs tracking-[0.3em] uppercase">[ photo ]</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Subtle shimmer on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.04 + 0.4, duration: 0.7 }}
        >
          <h3 className="font-serif text-xl md:text-2xl text-white/90 font-medium mb-2 leading-snug">
            {title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed">{caption}</p>
          {note && <p className="mt-3 text-white/28 text-xs leading-relaxed italic">{note}</p>}
        </motion.div>
      </motion.div>
    </div>
  );
}
