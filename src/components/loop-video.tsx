"use client";

import { useEffect, useRef } from "react";

// A silent looping video. For visitors who ask for reduced motion it stays
// paused on an early frame instead of playing.
export function LoopVideo({ src, className }: { src: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (reduce.matches) {
        v.pause();
        if (v.currentTime === 0) v.currentTime = 0.5;
      } else {
        v.play().catch(() => {});
      }
    };
    apply();
    reduce.addEventListener("change", apply);
    return () => reduce.removeEventListener("change", apply);
  }, []);

  return <video ref={ref} src={src} muted loop playsInline preload="metadata" draggable={false} aria-hidden className={className} />;
}
