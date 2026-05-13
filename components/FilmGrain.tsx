"use client";

// Subtle film grain overlay — pointer-events:none so it never blocks clicks.
// The SVG feTurbulence generates static noise; the div translates randomly
// via CSS animation to create the flickering grain illusion.
export default function FilmGrain() {
  return (
    <>
      <svg className="hidden">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div
        aria-hidden
        className="grain-overlay pointer-events-none fixed inset-0 z-[9999] opacity-[0.045]"
        style={{ filter: "url(#grain-filter)" }}
      />
    </>
  );
}
