"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Bag from "./Bag";
import { FLAVORS, wrapIndex } from "@/lib/flavors";
import { crunch } from "@/lib/sound";
import { scrollToId } from "@/lib/lenis";

const N = FLAVORS.length;

function offset(i: number, active: number) {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

export default function Hero({ ready }: { ready: boolean }) {
  const [active, setActive] = useState(4);
  const [autoplay, setAutoplay] = useState(true);
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(800);
  const flavor = FLAVORS[active];
  const dragStart = useRef<number | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const ringX = useTransform(sx, (v) => v * 30);
  const ringY = useTransform(sy, (v) => v * 30);
  const tiltY = useTransform(sx, (v) => v * 10);
  const tiltX = useTransform(sy, (v) => v * -8);

  useEffect(() => {
    const r = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  useEffect(() => {
    if (!autoplay || !ready) return;
    const t = setInterval(() => setActive((a) => wrapIndex(a + 1, N)), 3200);
    return () => clearInterval(t);
  }, [autoplay, ready]);

  const go = (dir: number) => {
    crunch(0.6);
    setActive((a) => wrapIndex(a + dir, N));
  };

  const spacing = vw < 768 ? vw * 0.3 : Math.min(vw * 0.13, 210);
  const bagW = Math.min(vw < 768 ? 120 : Math.min(vw * 0.11, 170), vh * 0.2);

  return (
    <section
      id="flavors"
      className="grain relative h-[100svh] min-h-[640px] overflow-hidden"
      onPointerMove={(e) => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      onPointerDown={(e) => (dragStart.current = e.clientX)}
      onPointerUp={(e) => {
        if (dragStart.current === null) return;
        const dx = e.clientX - dragStart.current;
        dragStart.current = null;
        if (Math.abs(dx) > 60) {
          setAutoplay(false);
          go(dx < 0 ? 1 : -1);
        }
      }}
    >
      {/* background colour */}
      <motion.div className="absolute inset-0" animate={{ backgroundColor: flavor.bg }} transition={{ duration: 0.9, ease: "easeInOut" }} />

      {/* concentric rings */}
      <motion.div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2" style={{ x: ringX, y: ringY }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{ width: `${(7 - i) * 34}vmax`, height: `${(7 - i) * 34}vmax`, x: "-50%", y: "-50%" }}
            animate={{
              backgroundColor: i % 2 === 0 ? flavor.ring : flavor.bg,
              scale: [1, 1.03, 1],
            }}
            transition={{
              backgroundColor: { duration: 0.9, delay: i * 0.06 },
              scale: { duration: 4, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" },
            }}
          />
        ))}
      </motion.div>

      {/* top-left meta */}
      <div className="absolute left-5 top-20 z-10 hidden gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 md:flex">
        <span>Made in small batches</span>
        <span>· Sliced to 1.4mm</span>
        <span>· {N} flavors and counting</span>
      </div>

      {/* bag carousel */}
      <motion.div className="absolute inset-0 z-10" style={{ perspective: 1200, rotateX: tiltX, rotateY: tiltY }}>
        {FLAVORS.map((f, i) => {
          const d = offset(i, active);
          const ad = Math.abs(d);
          const visible = ad <= 4;
          return (
            <motion.button
              key={f.id}
              aria-label={`Show ${f.name}`}
              onClick={() => {
                if (d !== 0) {
                  setAutoplay(false);
                  crunch(0.6);
                  setActive(i);
                }
              }}
              className="absolute left-1/2 top-[44%]"
              style={{ width: bagW, marginLeft: -bagW / 2, marginTop: (-bagW * 1.42) / 2, zIndex: 20 - ad }}
              initial={{ opacity: 0, y: 300 }}
              animate={
                ready
                  ? {
                      x: d * spacing,
                      y: ad * ad * 9 + (d === 0 ? -20 : 0),
                      scale: d === 0 ? 1.55 : 1 - ad * 0.06,
                      rotateZ: d * 7,
                      rotateY: d * -14,
                      opacity: visible ? 1 : 0,
                      filter: d === 0 ? "blur(0px)" : `blur(${Math.max(0, ad - 2) * 1.5}px)`,
                    }
                  : { opacity: 0, y: 300 }
              }
              transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9, delay: ready ? 0 : 0 }}
            >
              <div className={d === 0 ? "animate-float" : ""}>
                <Bag flavor={f} className="bag-shadow w-full" />
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* flavor name */}
      <div className="absolute inset-x-0 bottom-[13%] z-20 flex flex-col items-center text-center text-white">
        <AnimatePresence mode="wait">
          <motion.h2
            key={flavor.id}
            className="max-w-[90vw] font-wide text-[9vw] leading-[0.9] tracking-tight drop-shadow-[0_6px_0_rgba(0,0,0,0.18)] md:text-[4.6vw]"
          >
            {flavor.name.toUpperCase().split(" ").map((word, wi) => (
              <span key={wi} className="mx-[0.12em] inline-block overflow-hidden whitespace-nowrap align-bottom">
                {word.split("").map((ch, ci) => (
                  <motion.span
                    key={ci}
                    className="inline-block"
                    initial={{ y: "105%", rotateX: -80 }}
                    animate={{ y: "0%", rotateX: 0 }}
                    exit={{ y: "-105%", rotateX: 80 }}
                    transition={{ duration: 0.45, delay: (wi * 4 + ci) * 0.018, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h2>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p
            key={flavor.id + "n"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/85"
          >
            {flavor.note}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* controls */}
      <div className="absolute bottom-6 left-5 z-30 flex items-center gap-2">
        {[-1, 1].map((dir) => (
          <button
            key={dir}
            onClick={() => {
              setAutoplay(false);
              go(dir);
            }}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink transition hover:scale-110 hover:bg-white"
            aria-label={dir < 0 ? "Previous flavor" : "Next flavor"}
          >
            {dir < 0 ? "←" : "→"}
          </button>
        ))}
        <button
          onClick={() => setAutoplay((a) => !a)}
          className="ml-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full border border-white/60">{autoplay ? "❚❚" : "▶"}</span>
          <span className="hidden sm:inline">Autoplay</span>
        </button>
      </div>

      {/* progress dots */}
      {/* mobile: right-aligned beside the controls so they don't collide; desktop: centred */}
      <div className="absolute bottom-[42px] right-5 z-30 flex gap-1.5 md:bottom-8 md:right-auto md:left-1/2 md:-translate-x-1/2">
        {FLAVORS.map((f, i) => (
          <button
            key={f.id}
            onClick={() => {
              setAutoplay(false);
              setActive(i);
            }}
            aria-label={f.name}
            className="relative h-1 overflow-hidden rounded-full bg-white/30 transition-all"
            style={{ width: i === active ? 32 : 10 }}
          >
            {i === active && autoplay && (
              <motion.span
                key={active}
                className="absolute inset-y-0 left-0 bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.2, ease: "linear" }}
              />
            )}
            {i === active && !autoplay && <span className="absolute inset-0 bg-white" />}
          </button>
        ))}
      </div>

      {/* big index number */}
      <div className="pointer-events-none absolute bottom-0 right-4 z-0 hidden overflow-hidden font-wide text-[13vw] leading-[0.8] text-white/50 md:block">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={active}
            className="text-outline inline-block"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {String(active + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>

      <button
        onClick={() => scrollToId("inside")}
        className="absolute bottom-24 right-6 z-30 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-white md:block"
      >
        Scroll to open ↓
      </button>
    </section>
  );
}
