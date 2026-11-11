"use client";

import { FLAVORS } from "@/lib/flavors";

export default function Marquee() {
  const items = [...FLAVORS, ...FLAVORS];
  return (
    // x-clip keeps the tilted, scaled strip from widening the page on mobile; y stays visible so the tilt isn't cut
    <div className="relative z-10 overflow-x-clip">
      <div className="-rotate-2 scale-105 overflow-hidden border-y-2 border-ink bg-[#ffd23f] py-3">
        <div className="animate-marquee flex w-max gap-8 whitespace-nowrap font-display text-3xl tracking-wide text-ink md:text-4xl">
          {items.map((f, i) => (
            <span key={i} className="flex items-center gap-8">
              {f.name.toUpperCase()}
              <span className="inline-block h-4 w-6 rounded-[50%] bg-[#e0a800]" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
