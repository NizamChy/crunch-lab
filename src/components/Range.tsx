"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity, type MotionValue } from "motion/react";
import Bag from "./Bag";
import { FLAVORS, type Flavor } from "@/lib/flavors";
import { crunch } from "@/lib/sound";

function Hanger({ flavor, swing, i }: { flavor: Flavor; swing: MotionValue<number>; i: number }) {
  const [spin, setSpin] = useState(0);
  const local = useSpring(0, { stiffness: 120, damping: 6 });
  const rotate = useTransform([swing, local] as MotionValue<number>[], ([a, b]: number[]) => a * (0.8 + (i % 3) * 0.15) + b);

  return (
    <div className="relative flex w-[44vw] shrink-0 flex-col items-center md:w-[17vw]">
      <motion.div
        style={{ rotate, transformOrigin: "50% -60px" }}
        onHoverStart={() => local.set((i % 2 ? 1 : -1) * 14)}
        onHoverEnd={() => local.set(0)}
        className="relative mt-[60px]"
      >
        {/* hook + string */}
        <div className="absolute -top-[60px] left-1/2 h-[60px] w-px -translate-x-1/2 bg-ink/40" />
        <div className="absolute -top-[14px] left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ink/50" />
        <motion.button
          data-cursor
          onClick={() => {
            crunch(0.8);
            setSpin((s) => s + 360);
          }}
          animate={{ rotateY: spin }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          style={{ perspective: 800 }}
          className="block w-[30vw] md:w-[11vw]"
          aria-label={`Spin ${flavor.name}`}
        >
          <Bag flavor={flavor} className="bag-shadow w-full" />
        </motion.button>
      </motion.div>
      <p className="mt-6 text-center font-display text-lg leading-none tracking-wide md:text-xl">{flavor.name.toUpperCase()}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{flavor.note}</p>
    </div>
  );
}

export default function Range() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(0);
  const x = useMotionValue(0);
  const vel = useVelocity(x);
  const swing = useSpring(useTransform(vel, [-3000, 0, 3000], [22, 0, -22], { clamp: true }), { stiffness: 140, damping: 8 });
  const progress = useTransform(x, (v) => (limit ? Math.min(1, Math.max(0, -v / limit)) : 0));
  const progressW = useTransform(progress, (p) => `${p * 100}%`);

  useEffect(() => {
    const m = () => {
      if (wrap.current && track.current) setLimit(Math.max(0, track.current.scrollWidth - wrap.current.clientWidth));
    };
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  return (
    <section id="range" className="relative overflow-hidden bg-paper pb-24 pt-24">
      <div className="flex flex-col justify-between gap-4 px-4 md:flex-row md:items-end md:px-8">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">The rack · {FLAVORS.length} flavors</p>
          <h2 className="font-wide text-[13vw] leading-[0.85] md:text-[5.4vw]">
            PICK YOUR
            <br />
            CRUNCH
          </h2>
        </div>
        <p className="max-w-[260px] text-[13px] leading-relaxed text-ink/60 md:text-right">
          Drag the rail to browse. Run your cursor through the bags. Tap one to spin it on its hook.
        </p>
      </div>

      <div ref={wrap} className="relative mt-10 cursor-grab active:cursor-grabbing" data-cursor>
        {/* the rod */}
        <div className="absolute inset-x-0 top-0 h-[6px] bg-gradient-to-b from-[#d4d1ca] to-[#9c9890] shadow-[0_3px_6px_rgba(0,0,0,0.15)]" />
        <motion.div
          ref={track}
          drag="x"
          dragConstraints={{ left: -limit, right: 0 }}
          dragElastic={0.08}
          style={{ x }}
          className="flex w-max gap-2 px-[6vw] pb-4"
        >
          {[...FLAVORS].reverse().map((f, i) => (
            <Hanger key={f.id} flavor={f} swing={swing} i={i} />
          ))}
        </motion.div>
      </div>

      <div className="mx-4 mt-8 flex items-center gap-4 md:mx-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">Drag the rail</span>
        <div className="relative h-px flex-1 bg-ink/15">
          <motion.div className="absolute inset-y-0 left-0 bg-ink" style={{ width: progressW }} />
        </div>
        <span className="font-mono text-[10px] text-ink/50">→</span>
      </div>
    </section>
  );
}
