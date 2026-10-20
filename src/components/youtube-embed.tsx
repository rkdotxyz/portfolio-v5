"use client";

import Image from "next/image";
import { useState } from "react";

// YouTube video shown as its thumbnail with a play button; the player only
// loads once clicked, so pages don't pull in YouTube until it is wanted.
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group/play absolute inset-0 h-full w-full"
    >
      <Image
        src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 768px) 960px, 100vw"
        className="object-cover"
      />
      <span className="absolute inset-0 bg-black/20 transition-colors group-hover/play:bg-black/5" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover/play:scale-105">
        <svg aria-hidden viewBox="0 0 16 16" className="ml-1 h-6 w-6" fill="currentColor">
          <path d="M4 2.5v11l9-5.5z" />
        </svg>
      </span>
    </button>
  );
}
