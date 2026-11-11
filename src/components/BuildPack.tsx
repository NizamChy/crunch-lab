"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Bag from "./Bag";
import { FLAVORS, PACK_PRICE } from "@/lib/flavors";
import { useFly } from "@/store/fly";
import { crunch } from "@/lib/sound";

const SLOTS = [
  { x: "-62%", y: "-6%", r: -12 },
  { x: "0%", y: "-14%", r: 0 },
  { x: "62%", y: "-4%", r: 12 },
];

export default function BuildPack() {
  const [picked, setPicked] = useState<string[]>([]);
  const launch = useFly((s) => s.launch);
  const orbRef = useRef<HTMLDivElement>(null);

  const full = picked.length === 3;
  const full_price = picked.reduce((s, id) => s + FLAVORS.find((f) => f.id === id)!.price, 0) || FLAVORS[0].price * 3;
  const save = Math.max(0, full_price - PACK_PRICE);

  function toggle(id: string) {
    crunch(0.7);
    setPicked((p) => {
      const idx = p.indexOf(id);
      if (idx >= 0) return p.filter((_, i) => i !== idx);
      if (p.length >= 3) return p;
      return [...p, id];
    });
  }

  function checkout() {
    if (!full) return;
    const slots = orbRef.current?.querySelectorAll("[data-slot-bag]") ?? [];
    picked.forEach((id, i) => {
      const el = slots[i] ?? orbRef.current;
      if (el) launch(id, el, { delay: i * 0.12, label: i === picked.length - 1 ? "3-pack added to your basket" : null });
    });
    crunch(1.2);
    setPicked([]);
  }

  return (
    <section className="bg-paper px-4 pb-24 md:px-8">
      <motion.div
        initial={{ clipPath: "inset(12% 6% 12% 6% round 40px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        data-nav-dark
        className="grain relative grid overflow-hidden rounded-[28px] bg-[#17110e] p-6 text-white md:grid-cols-[1fr_1.2fr] md:p-12"
      >
        <div className="relative z-10">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Build a box · concept store</p>
          <h2 className="font-display text-[15vw] leading-[0.86] md:text-[6vw]">
            BUILD YOUR
            <br />
            <span className="mr-2 inline-grid h-[0.9em] w-[0.75em] place-items-center rounded-md bg-white align-[-0.06em] text-[#17110e]">3</span>
            PACK &amp;
            <br />
            <span className="text-outline">SAVE ${save.toFixed(2)}</span>
          </h2>

          <div className="mt-8 grid grid-cols-5 gap-2 md:max-w-[460px]">
            {FLAVORS.map((f) => {
              const count = picked.filter((p) => p === f.id).length;
              const on = count > 0;
              return (
                <motion.button
                  key={f.id}
                  onClick={() => toggle(f.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className="group relative flex flex-col items-center gap-1 rounded-xl p-1.5 text-center transition-colors"
                  style={{ backgroundColor: on ? f.card : "rgba(255,255,255,0.06)" }}
                  aria-pressed={on}
                >
                  <span className="line-clamp-2 h-6 font-display text-[9px] leading-[1.05] tracking-wide">{f.name.toUpperCase()}</span>
                  <Bag lite flavor={f} className={`w-[70%] transition duration-300 ${on || picked.length < 3 ? "" : "opacity-30 grayscale"}`} />
                  <AnimatePresence>
                    {on && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white font-mono text-[10px] text-ink"
                      >
                        {count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {picked.length}/3 picked · tap a flavor again to remove it
          </p>
        </div>

        <div className="relative mt-10 flex min-h-[420px] flex-col items-center justify-center md:mt-0">
          <motion.div
            ref={orbRef}
            className="relative aspect-square w-[88%] max-w-[480px] rounded-full"
            animate={{
              background: full
                ? "radial-gradient(circle at 50% 45%, #c2410c 0%, #7c2d12 45%, rgba(23,17,14,0) 70%)"
                : "radial-gradient(circle at 50% 45%, #7c2d12 0%, #3b1a0d 45%, rgba(23,17,14,0) 70%)",
              scale: full ? [1, 1.06, 1] : 1,
            }}
            transition={{ duration: 0.8 }}
          >
            {SLOTS.map((s, i) => {
              const id = picked[i];
              const f = id ? FLAVORS.find((x) => x.id === id)! : null;
              return (
                <div key={i} className="absolute left-1/2 top-1/2 w-[34%]" style={{ transform: `translate(-50%, -50%) translate(${s.x}, ${s.y})` }}>
                  <AnimatePresence mode="popLayout">
                    {f ? (
                      <motion.div
                        key={f.id + i}
                        initial={{ y: -260, rotate: s.r * 4, opacity: 0, scale: 0.6 }}
                        animate={{ y: 0, rotate: s.r, opacity: 1, scale: 1 }}
                        exit={{ y: 140, opacity: 0, rotate: s.r * -3, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 220, damping: 14 }}
                        className="relative"
                        data-slot-bag
                      >
                        <Bag flavor={f} className="bag-shadow w-full" />
                        <button
                          onClick={() => setPicked((p) => p.filter((_, j) => j !== i))}
                          className="absolute -top-2 left-1/2 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full bg-black/70 text-xs ring-1 ring-white/40"
                          aria-label={`Remove ${f.name}`}
                        >
                          ×
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={"empty" + i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mx-auto grid aspect-[200/285] w-full place-items-center"
                      >
                        <span className="grid h-8 w-8 place-items-center rounded-full border border-dashed border-white/40 font-mono text-xs text-white/50">
                          {i + 1}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>

          <motion.button
            onClick={checkout}
            disabled={!full}
            whileHover={full ? { scale: 1.03 } : {}}
            whileTap={full ? { scale: 0.97 } : {}}
            className="relative mt-4 flex w-full max-w-[380px] items-center justify-between overflow-hidden rounded-2xl px-6 py-4 font-display text-xl tracking-wide transition-colors disabled:cursor-not-allowed"
            style={{ backgroundColor: full ? "#f1efea" : "rgba(255,255,255,0.08)", color: full ? "#0d0d0f" : "rgba(255,255,255,0.5)" }}
          >
            ADD TO BASKET
            <span className="font-mono text-sm">
              <s className="mr-2 opacity-50">${full_price.toFixed(2)}</s>${PACK_PRICE.toFixed(2)}
            </span>
          </motion.button>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">Concept only · nothing is charged</p>
        </div>
      </motion.div>
    </section>
  );
}
