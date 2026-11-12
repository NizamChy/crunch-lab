"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Bag from "./Bag";
import { FLAVORS } from "@/lib/flavors";
import { scrollToId } from "@/lib/lenis";
import { crunch } from "@/lib/sound";

const SOCIALS = [
  {
    label: "Portfolio",
    href: "https://nizam-chy.web.app",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 6h-2.95a15.6 15.6 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14a8.2 8.2 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26Zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.07 16Zm2.95-8H5.07a7.99 7.99 0 0 1 4.33-3.56A15.6 15.6 0 0 0 8.02 8ZM12 19.96A14.1 14.1 0 0 1 10.09 16h3.82A14.1 14.1 0 0 1 12 19.96ZM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4Zm.26 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56ZM16.36 14a16.5 16.5 0 0 0 0-4h3.38a8.2 8.2 0 0 1 0 4h-3.38Z",
  },
  {
    label: "GitHub",
    href: "https://github.com/NizamChy",
    icon: "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nizam-chowdhury",
    icon: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/nizam.chowdhury.cs",
    icon: "M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z",
  },
];

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

      {/* credit */}
      <div className="relative z-10 mt-10 flex flex-col gap-5 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Designed &amp; developed by</p>
          <a
            href="https://nizam-chy.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-1 inline-flex items-baseline gap-2 font-wide text-2xl tracking-tight text-white md:text-3xl"
          >
            NIZAM CHOWDHURY
            <span className="text-base text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white">↗</span>
          </a>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Built with Next.js · GSAP · Three.js · Motion
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Nizam Chowdhury on ${s.label}`}
              title={s.label}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white/85 transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#5e0410]"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
                <path d={s.icon} />
              </svg>
            </a>
          ))}
        </div>
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
