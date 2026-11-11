"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Bag from "./Bag";
import { FLAVORS } from "@/lib/flavors";
import { scrollToId } from "@/lib/lenis";
import { crunch } from "@/lib/sound";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["18%", "-14%"]);
  const bagY = useTransform(scrollYProgress, [0, 1], [220, -20]);
  const bagR = useTransform(scrollYProgress, [0, 1], [30, -14]);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer
      id="join"
      ref={ref}
      className="grain relative overflow-hidden px-4 pb-8 pt-28 text-white md:px-8"
      style={{ background: "radial-gradient(90% 70% at 50% 0%, #b80d1f 0%, #5e0410 45%, #120204 100%)" }}
    >
      <div className="relative z-10 grid gap-10 md:grid-cols-2">
        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">Newsletter · drops, new flavors, no spam</p>
          <h2 className="font-wide text-[10vw] leading-[0.88] md:text-[4.4vw]">
            BE FIRST
            <br />
            TO THE BAG.
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^\S+@\S+\.\S+$/.test(email)) return;
              crunch(1.2);
              setDone(true);
            }}
            className="relative mt-8 max-w-[440px]"
          >
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div key="form" exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 border-b border-white/30 pb-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent py-2 text-lg outline-none placeholder:text-white/35"
                  />
                  <button className="rounded-full bg-white px-5 py-2 text-[12px] font-semibold text-ink transition hover:bg-lime">Join</button>
                </motion.div>
              ) : (
                <motion.p key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-3 font-mono text-sm uppercase tracking-[0.2em] text-lime">
                  ✓ You&apos;re on the list. Stay crunchy.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-6 self-end font-mono text-[11px] md:justify-self-end">
          {[
            { h: "Explore", l: [["Flavors", "flavors"], ["Inside", "inside"], ["Range", "range"], ["Build a box", "shop"]] },
            { h: "Help", l: [["Q&A", "qa"], ["Newsletter", "join"]] },
            { h: "Follow", l: [["Instagram", ""], ["TikTok", ""], ["YouTube", ""]] },
          ].map((col) => (
            <div key={col.h}>
              <p className="mb-3 uppercase tracking-[0.25em] text-white/40">{col.h}</p>
              <ul className="space-y-1.5">
                {col.l.map(([label, id]) => (
                  <li key={label}>
                    <button onClick={() => id && scrollToId(id)} className="group relative text-white/85 hover:text-white">
                      {label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform group-hover:scale-x-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* giant word */}
      <div className="relative mt-16 h-[34vw] md:h-[22vw]">
        <motion.div style={{ x }} className="absolute whitespace-nowrap font-wide text-[30vw] leading-none md:text-[20vw]">
          <span className="text-outline-white">STAY </span>
          <span>CRUNCHY</span>
        </motion.div>
        <motion.div style={{ y: bagY, rotate: bagR }} className="absolute right-[8%] top-0 w-[22vw] md:w-[11vw]">
          <Bag flavor={FLAVORS[4]} className="bag-shadow w-full" />
        </motion.div>
      </div>

      <div className="relative z-10 mt-6 flex flex-col justify-between gap-3 border-t border-white/15 pt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45 md:flex-row">
        <span>© 2026 Crunch Lab · a design concept · not a real store</span>
        <button onClick={() => scrollToId("flavors")} className="text-left hover:text-white">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
