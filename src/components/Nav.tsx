"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import { useCart } from "@/store/cart";
import { scrollToId } from "@/lib/lenis";
import { crunch } from "@/lib/sound";

const LINKS = [
  { id: "flavors", label: "Flavors" },
  { id: "inside", label: "Inside" },
  { id: "shop", label: "Shop" },
  { id: "range", label: "Range" },
  { id: "qa", label: "Q&A" },
  { id: "join", label: "Join" },
];

const DARK_SECTIONS = new Set(["flavors", "inside", "join"]);

export default function Nav() {
  const [active, setActive] = useState("flavors");
  const count = useCart((s) => s.items.length);
  const sound = useCart((s) => s.sound);
  const toggleSound = useCart((s) => s.toggleSound);

  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onDark = DARK_SECTIONS.has(active);

  return (
    <header className={clsx("fixed inset-x-0 top-0 z-[100] transition-colors duration-500", onDark ? "text-white" : "text-ink")}>
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-7">
        <button onClick={() => scrollToId("flavors")} className="flex items-center gap-2" aria-label="Crunch Lab home">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffc300] text-[9px] font-black text-[#d90429] shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)]">
            <span className="-rotate-12 font-wide">CL</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] sm:block">Crunch Lab</span>
        </button>

        <nav
          className={clsx(
            "hidden items-center gap-0.5 rounded-full p-1 backdrop-blur-md md:flex",
            onDark ? "bg-black/15 ring-1 ring-white/15" : "bg-white/60 ring-1 ring-black/10"
          )}
        >
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                crunch(0.5);
                scrollToId(l.id);
              }}
              className="relative rounded-full px-3.5 py-1.5 text-[12px] font-medium"
            >
              {active === l.id && (
                <motion.span
                  layoutId="nav-pill"
                  className={clsx("absolute inset-0 rounded-full", onDark ? "bg-white" : "bg-ink")}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className={clsx("relative transition-colors", active === l.id && (onDark ? "text-ink" : "text-white"))}>{l.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toggleSound();
              setTimeout(() => crunch(1), 0);
            }}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest"
            aria-pressed={sound}
          >
            <span className="flex h-3 items-end gap-[2px]">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="w-[2px] rounded bg-current"
                  animate={sound ? { height: [3, 12, 5, 10, 3] } : { height: 3 }}
                  transition={sound ? { duration: 0.9, repeat: Infinity, delay: i * 0.12 } : {}}
                />
              ))}
            </span>
            {sound ? "On" : "Off"}
          </button>

          <div
            id="basket-icon"
            className={clsx("relative flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px]", onDark ? "bg-white/10" : "bg-black/5")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 9h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 9Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            <AnimatePresence mode="popLayout">
              <motion.span key={count} initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}>
                {String(count).padStart(3, "0")}
              </motion.span>
            </AnimatePresence>
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-hot" />}
          </div>

          <button
            onClick={() => scrollToId("shop")}
            className="group relative overflow-hidden rounded-full bg-hot px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:text-ink"
          >
            <span className="relative z-10">First dibs</span>
            <span className="absolute inset-0 translate-y-full bg-lime transition-transform duration-300 group-hover:translate-y-0" />
          </button>
        </div>
      </div>
    </header>
  );
}
