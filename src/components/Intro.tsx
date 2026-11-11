"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "@/lib/lenis";
import { crunch } from "@/lib/sound";

const ChipField = dynamic(() => import("./ChipField"), { ssr: false });

const LINES = ["Washing the potatoes", "Slicing paper-thin", "Frying till golden", "Seasoning loudly", "Sealing the bag"];

export default function Intro({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(true);
  const closed = useRef(false);

  const close = useCallback(() => {
    if (closed.current) return;
    closed.current = true;
    crunch(1.2);
    setOpen(false);
  }, []);

  useEffect(() => {
    // Stop Lenis once it exists, then stop polling (it is restarted in onExitComplete).
    const lock = setInterval(() => {
      const l = getLenis();
      if (!l) return;
      if (!closed.current) l.stop();
      clearInterval(lock);
    }, 50);
    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(100, p + Math.random() * 2.2 + 0.5);
      setProgress(Math.floor(p));
      if (p >= 100) clearInterval(timer);
    }, 45);
    return () => {
      clearInterval(timer);
      clearInterval(lock);
    };
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const t = setTimeout(close, 900);
    return () => clearTimeout(t);
  }, [progress, close]);

  const stage = Math.min(4, Math.floor(progress / 20));

  return (
    <AnimatePresence
      onExitComplete={() => {
        getLenis()?.start();
        onDone();
      }}
    >
      {open && (
        <motion.div
          key="intro"
          className="grain fixed inset-0 z-[180] overflow-hidden"
          style={{ background: "radial-gradient(120% 90% at 50% 40%, #c2185b 0%, #8e0f45 55%, #4a0423 100%)" }}
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          exit={{ clipPath: "circle(0% at 50% 50%)", transition: { duration: 1.05, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="absolute inset-0">
            <ChipField />
          </div>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-white">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/70"
            >
              Crunch Lab presents
            </motion.p>
            <h1 className="mt-3 overflow-hidden font-display text-[16vw] leading-[0.95] tracking-tight mix-blend-overlay md:text-[11vw]">
              {"CRUNCH".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: "110%", rotate: 8 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              ))}
            </h1>
          </div>

          <button
            onClick={close}
            className="absolute right-5 top-5 rounded-full border border-white/40 bg-black/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white backdrop-blur transition hover:bg-white hover:text-ink"
          >
            Skip intro →
          </button>

          <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
            <AnimatePresence mode="wait">
              <motion.p key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                ● {LINES[stage]}
              </motion.p>
            </AnimatePresence>
            <div className="mt-2 h-px w-48 bg-white/20">
              <div className="h-px bg-white transition-[width] duration-100" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="absolute bottom-4 right-6 font-wide text-5xl tabular-nums text-white md:text-7xl">
            {progress}
            <span className="align-top text-base">%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
