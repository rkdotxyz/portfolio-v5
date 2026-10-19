"use client";

import { useSyncExternalStore } from "react";
import { sound } from "@/lib/sound";

export function SoundToggle() {
  const on = useSyncExternalStore(sound.subscribe, sound.isEnabled, () => true);

  return (
    <button
      type="button"
      data-sound="none"
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Sound on" : "Sound off"}
      onClick={() => sound.setEnabled(!on)}
      className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-faint text-muted transition-colors hover:border-foreground hover:text-foreground sm:h-[34px] sm:w-[34px]"
    >
      <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor" stroke="none" />
        {on ? (
          <>
            <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5" />
            <path d="M12.5 3.5a6.3 6.3 0 0 1 0 9" />
          </>
        ) : (
          <path d="M11 6l4 4M15 6l-4 4" />
        )}
      </svg>
    </button>
  );
}
