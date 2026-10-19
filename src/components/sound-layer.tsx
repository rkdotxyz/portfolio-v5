"use client";

import { useEffect } from "react";
import { play, type SoundName } from "@/lib/sound";

const HOVERABLE = "a, button, [role=tab], [data-sound-hover]";
const CLICKABLE = "a, button, [data-sound]";

// Site-wide sound hooks via event delegation, so components only opt in with
// attributes: data-sound="<name>" picks a click sound ("none" silences it),
// data-sound-hover adds a hover tick to non-interactive elements.
export function SoundLayer() {
  useEffect(() => {
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = (e.target as Element).closest?.(HOVERABLE);
      // Only when entering the element, not when moving between its children.
      if (el && !el.contains(e.relatedTarget as Node | null)) play("hover");
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest?.(CLICKABLE) as HTMLElement | null;
      if (!el) return;
      const name = el.dataset.sound ?? "click";
      if (name !== "none") play(name as SoundName);
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
