"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Bag from "./Bag";
import { FLAVORS } from "@/lib/flavors";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    title: ["BUILT TO", "PROTECT"],
    body: "A three-layer film blocks light and moisture, so every chip lands the way it left the fryer.",
    callouts: [
      { k: "Tri-layer film", v: "Blocks light & moisture", x: "-118%", y: "-30%" },
      { k: "Heat-sealed crimp", v: "Locks the freshness in", x: "112%", y: "-58%" },
      { k: "N₂ in the bag", v: "Air-cushioned pack", x: "118%", y: "8%" },
    ],
  },
  {
    title: ["SEALED AT", "THE PEAK"],
    body: "Bagged within minutes of seasoning. Nitrogen pushes the oxygen out and keeps the crunch in.",
    callouts: [
      { k: "Minutes, not hours", v: "Fryer to bag", x: "-120%", y: "10%" },
      { k: "Zero oxygen", v: "Zero staleness", x: "115%", y: "-30%" },
    ],
  },
  {
    title: ["CUT", "PAPER-THIN"],
    body: "Each potato is washed, sliced to 1.4mm and fried until it shatters. That's the whole secret.",
    callouts: [
      { k: "1.4mm slice", v: "Thin & golden", x: "115%", y: "10%" },
      { k: "Real potatoes", v: "Never formed", x: "-120%", y: "-40%" },
    ],
  },
];

/** deterministic pseudo random so SSR and client agree */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Chip({ fill = "#f3c96b" }: { fill?: string }) {
  return (
    <svg viewBox="0 0 60 44" className="h-full w-full">
      <defs>
        <radialGradient id="ins-chip" cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#fff2c2" />
          <stop offset="0.55" stopColor={fill} />
          <stop offset="1" stopColor="#c2410c" />
        </radialGradient>
      </defs>
      <path d="M6,22 C4,8 22,2 34,4 C50,6 58,16 55,27 C52,38 38,43 24,40 C12,38 7,32 6,22 Z" fill="url(#ins-chip)" />
      <path d="M18,10 Q26,22 20,36 M30,7 Q38,22 32,39 M42,9 Q48,22 44,35" stroke="#9a3412" strokeOpacity="0.3" fill="none" strokeWidth="1.5" />
    </svg>
  );
}

export default function Inside() {
  const root = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const flavor = FLAVORS[4];

  const chips = useMemo(() => {
    const r = seeded(42);
    return Array.from({ length: 70 }, () => {
      const a = r() * Math.PI * 2;
      const dist = 30 + r() * 70;
      return {
        x: Math.cos(a) * dist,
        y: Math.sin(a) * dist * 0.75,
        rot: (r() - 0.5) * 900,
        size: 24 + r() * 70,
        blur: r() > 0.7 ? 2 + r() * 4 : 0,
      };
    });
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".step"), { autoAlpha: 0 });
      gsap.set(q(".step-0"), { autoAlpha: 1 });
      gsap.set(q(".num"), { autoAlpha: 0, scale: 0.9 });
      gsap.set(q(".num-0"), { autoAlpha: 1, scale: 1 });
      gsap.set(q(".callout"), { autoAlpha: 0, scale: 0.8 });
      gsap.set(q(".fly-chip"), { x: 0, y: 0, scale: 0, autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=450%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const p = gsap.utils.clamp(0, 1, (self.progress - 0.72) / 0.28);
            if (speedRef.current) speedRef.current.textContent = (p * 60).toFixed(1);
          },
        },
      });

      // intro of bag
      tl.fromTo(q(".bag3d"), { rotateY: -40, rotateZ: -18, y: 80, scale: 0.85 }, { rotateY: 0, rotateZ: -12, y: 0, scale: 1, duration: 1 }, 0)
        .to(q(".step-0 .callout"), { autoAlpha: 1, scale: 1, stagger: 0.15, duration: 0.5, ease: "back.out(2)" }, 0.4)
        .to(q(".dot-0"), { backgroundColor: "#fff", color: "#e01434", duration: 0.2 }, 0)

        // -> step 1
        .to(q(".step-0"), { autoAlpha: 0, y: -40, duration: 0.5 }, 2)
        .to(q(".num-0"), { autoAlpha: 0, scale: 1.1, duration: 0.5 }, 2)
        .fromTo(q(".step-1"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.4)
        .to(q(".num-1"), { autoAlpha: 1, scale: 1, duration: 0.5 }, 2.4)
        .to(q(".bag3d"), { rotateZ: 10, rotateY: 25, x: "8vw", scale: 1.12, duration: 1.2 }, 2)
        .to(q(".step-1 .callout"), { autoAlpha: 1, scale: 1, stagger: 0.15, duration: 0.5, ease: "back.out(2)" }, 2.8)
        .to(q(".dot-1"), { backgroundColor: "#fff", color: "#e01434", duration: 0.2 }, 2.2)

        // -> step 2 (flip to back)
        .to(q(".step-1"), { autoAlpha: 0, y: -40, duration: 0.5 }, 4)
        .to(q(".num-1"), { autoAlpha: 0, scale: 1.1, duration: 0.5 }, 4)
        .fromTo(q(".step-2"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 4.4)
        .to(q(".num-2"), { autoAlpha: 1, scale: 1, duration: 0.5 }, 4.4)
        .to(q(".bag3d"), { rotateY: 180 + 18, rotateZ: -6, x: 0, scale: 1.05, duration: 1.4 }, 4)
        .to(q(".step-2 .callout"), { autoAlpha: 1, scale: 1, stagger: 0.15, duration: 0.5, ease: "back.out(2)" }, 4.9)
        .to(q(".dot-2"), { backgroundColor: "#fff", color: "#e01434", duration: 0.2 }, 4.2)

        // -> burst
        .to(q(".step-2"), { autoAlpha: 0, y: -40, duration: 0.5 }, 6)
        .to(q(".num-2"), { autoAlpha: 0, duration: 0.5 }, 6)
        .to(q(".bag3d"), { rotateY: 360, rotateZ: 0, scale: 0.9, duration: 0.8 }, 6)
        .to(q(".bag3d"), { x: "+=6", rotateZ: 4, duration: 0.05, repeat: 7, yoyo: true, ease: "none" }, 6.8)
        .to(q(".flash"), { autoAlpha: 0.9, duration: 0.15 }, 7.2)
        .to(q(".flash"), { autoAlpha: 0, duration: 0.6 }, 7.35)
        .to(q(".bag3d"), { scale: 0.55, rotateZ: -22, y: "4vh", duration: 1.6, ease: "power3.out" }, 7.2)
        .to(
          q(".fly-chip"),
          {
            autoAlpha: 1,
            scale: 1,
            x: (i) => `${chips[i].x}vw`,
            y: (i) => `${chips[i].y}vh`,
            rotate: (i) => chips[i].rot,
            duration: 2,
            ease: "power3.out",
            stagger: 0.004,
          },
          7.2
        )
        .fromTo(q(".burst-label"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 7.6)
        .to({}, { duration: 0.6 });
    },
    { scope: root }
  );

  return (
    <section id="inside" className="relative">
      <div
        ref={root}
        className="grain relative h-[100svh] overflow-hidden text-white"
        style={{ background: "radial-gradient(90% 80% at 55% 50%, #ff2a3d 0%, #d5001c 45%, #7d000f 100%)" }}
      >
        {/* big outlined numerals */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          {["01", "02", "03"].map((n, i) => (
            <span key={n} className={`num num-${i} text-outline-white absolute font-wide text-[44vw] leading-none md:text-[34vw]`}>
              {n}
            </span>
          ))}
        </div>

        {/* step labels */}
        <div className="absolute left-5 top-24 z-20 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 md:left-10">
          <span className="rounded bg-white/15 px-1.5 py-0.5">IN</span>
          <span className="h-px w-16 bg-white/40" />
          Inside the bag
        </div>

        {/* titles */}
        {STEPS.map((s, i) => (
          <div key={i} className={`step step-${i} absolute inset-0 z-20`}>
            <div className="absolute left-5 top-[30%] max-w-[340px] md:left-10 md:top-[34%]">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
                0{i + 1} / 03 — the bag
              </p>
              <h3 className="whitespace-nowrap font-wide text-[11vw] leading-[0.88] md:text-[4.2vw]">
                {s.title[0]}
                <br />
                {s.title[1]}
              </h3>
              <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-white/80">{s.body}</p>
            </div>
            <div className="absolute left-1/2 top-1/2 hidden md:block">
              {s.callouts.map((c) => (
                <div key={c.k} className="callout absolute left-0 top-0 w-48">
                  <div
                    style={{ transform: `translate(-50%, -50%) translate(${c.x}, ${c.y})` }}
                    className="rounded-xl border border-white/25 bg-black/15 px-3 py-2 backdrop-blur-md"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">{c.k}</p>
                    <p className="text-[13px] font-semibold">{c.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* chips burst */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10">
          {chips.map((c, i) => (
            <div
              key={i}
              className="fly-chip absolute"
              style={{ width: c.size, height: c.size * 0.75, marginLeft: -c.size / 2, marginTop: -c.size * 0.37, filter: c.blur ? `blur(${c.blur}px)` : undefined }}
            >
              <Chip fill={i % 3 === 0 ? "#ff5a36" : "#f3a64b"} />
            </div>
          ))}
        </div>

        {/* the bag */}
        <div className="absolute left-1/2 top-1/2 z-[15] -translate-x-1/2 -translate-y-1/2" style={{ perspective: 1400 }}>
          <div className="bag3d relative w-[min(46vw,40vh)] max-w-[300px] md:w-[min(22vw,44vh)]" style={{ transformStyle: "preserve-3d" }}>
            <div style={{ backfaceVisibility: "hidden" }}>
              <Bag flavor={flavor} className="bag-shadow w-full" />
            </div>
            <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              <Bag flavor={flavor} side="back" className="bag-shadow w-full" />
            </div>
          </div>
        </div>

        <div className="flash pointer-events-none invisible absolute inset-0 z-30 bg-[#ffd9a0]" />

        {/* side step indicators */}
        <div className="absolute right-5 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3 md:right-10">
          {["◧", "◎", "≋"].map((ic, i) => (
            <span key={i} className={`dot-${i} grid h-10 w-10 place-items-center rounded-full border border-white/40 text-sm text-white`}>
              {ic}
            </span>
          ))}
        </div>

        <div className="burst-label invisible absolute inset-x-0 bottom-10 z-30 flex items-end justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em]">
          <span className="pb-2 text-white/70">Mid-speed</span>
          <span ref={speedRef} className="font-wide text-5xl tabular-nums tracking-normal md:text-6xl">
            0.0
          </span>
          <span className="pb-2 text-white/70">Chips / sec</span>
        </div>
      </div>
    </section>
  );
}
