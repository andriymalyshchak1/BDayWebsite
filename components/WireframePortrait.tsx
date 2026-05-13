"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Image from "next/image";

// ─── Shaders ──────────────────────────────────────────────────────────────────
const vert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */`
  uniform sampler2D uTex;
  uniform vec2      uT;      // texel size (1/width, 1/height)
  varying vec2 vUv;

  vec4  px(vec2 uv)  { return texture2D(uTex, uv); }
  float lm(vec4 c)   { return dot(c.rgb, vec3(0.299, 0.587, 0.114)); }

  // Detect white / transparent background pixels
  bool isBg(vec4 c) {
    if (c.a < 0.42) return true;
    float hi  = max(c.r, max(c.g, c.b));
    float lo  = min(c.r, min(c.g, c.b));
    float sat = (hi - lo) / max(hi, 0.001);
    return hi > 0.93 && sat < 0.08;
  }

  // Sobel magnitude at a given texel-scale multiplier
  float sobel(float sc) {
    vec2 t = uT * sc;
    vec4 nw=px(vUv+vec2(-t.x, t.y)), n=px(vUv+vec2(0.0,t.y)), ne=px(vUv+vec2(t.x, t.y));
    vec4 w =px(vUv+vec2(-t.x, 0.0)),                            e =px(vUv+vec2(t.x, 0.0));
    vec4 sw=px(vUv+vec2(-t.x,-t.y)), s=px(vUv+vec2(0.0,-t.y)),se=px(vUv+vec2(t.x,-t.y));

    vec4 c0 = px(vUv);
    float cl = lm(c0);
    float lnw=isBg(nw)?cl:lm(nw), ln=isBg(n)?cl:lm(n), lne=isBg(ne)?cl:lm(ne);
    float lw =isBg(w )?cl:lm(w ),                         le =isBg(e )?cl:lm(e );
    float lsw=isBg(sw)?cl:lm(sw), ls=isBg(s)?cl:lm(s),  lse=isBg(se)?cl:lm(se);

    float gx = -lnw + lne - 2.0*lw + 2.0*le - lsw + lse;
    float gy =  lnw + 2.0*ln + lne - lsw - 2.0*ls - lse;
    return sqrt(gx*gx + gy*gy);
  }

  void main() {
    vec4 col = px(vUv);
    if (isBg(col)) discard;

    // Silhouette: pixel borders the removed background
    vec4 n=px(vUv+vec2(0.0, uT.y)), s=px(vUv-vec2(0.0, uT.y));
    vec4 e=px(vUv+vec2(uT.x,0.0)), w=px(vUv-vec2(uT.x,0.0));
    float sil = (isBg(n)||isBg(s)||isBg(e)||isBg(w)) ? 1.0 : 0.0;

    // Multi-scale Sobel: fine detail + coarser feature lines
    float e1 = smoothstep(0.06, 0.50, sobel(1.0));
    float e2 = smoothstep(0.04, 0.38, sobel(3.0)) * 1.35;
    float edge = max(e1, e2);

    float alpha = clamp(edge + sil * 1.15, 0.0, 1.0);
    if (alpha < 0.04) discard;

    // Lavender purple wire — silhouette rim slightly lighter
    vec3 lavender = vec3(0.698, 0.588, 0.902);
    lavender = mix(lavender, vec3(0.82, 0.74, 0.97), sil * 0.45);

    gl_FragColor = vec4(lavender, alpha * 0.92);
  }
`;

// ─── Inner mesh ───────────────────────────────────────────────────────────────
function Portrait({ src }: { src: string }) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    new THREE.TextureLoader().load(src, (t) => setTex(t));
  }, [src]);

  const { mat, geo } = useMemo(() => {
    if (!tex) return { mat: null, geo: null };

    const img = tex.image as (HTMLImageElement & ImageBitmap) | null;
    const imgW = img?.naturalWidth ?? img?.width ?? 512;
    const imgH = img?.naturalHeight ?? img?.height ?? 512;
    const aspect = imgW / imgH;

    const ph = 9.0;
    const pw = ph * aspect;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: tex },
        uT:   { value: new THREE.Vector2(1 / imgW, 1 / imgH) },
      },
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const geo = new THREE.PlaneGeometry(pw, ph);
    return { mat, geo };
  }, [tex]);

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.45) * 0.18;
  });

  if (!mat || !geo) return null;
  return <mesh ref={meshRef} geometry={geo} material={mat} />;
}

// ─── Export ────────────────────────────────────────────────────────────────────
export default function WireframePortrait({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const [ready, setReady] = useState(false);

  return (
    <div className={`relative ${className}`} aria-hidden>
      {/* Static portrait shows immediately while Three.js initialises */}
      <Image
        src={src}
        alt=""
        fill
        priority
        className="object-contain"
        style={{ opacity: ready ? 0 : 0.35, transition: "opacity 0.8s" }}
      />
      <Canvas
        frameloop="always"
        camera={{ position: [0, 0, 11.25], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", position: "absolute", inset: 0 }}
        onCreated={() => setReady(true)}
      >
        <Portrait src={src} />
      </Canvas>
    </div>
  );
}
