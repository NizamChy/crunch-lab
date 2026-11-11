"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { crunch } from "@/lib/sound";

const QUESTIONS = [
  {
    q: "Are the chips made from real potatoes?",
    a: "Yes. Every chip starts life as a whole potato that is washed, sliced and cooked. For exact ingredients, always check the pack in your hand.",
  },
  { q: "Which flavor should I try first?", a: "Start with Classic to calibrate, then go loud with Flamin' Hot. All Dressed is the people's dark horse." },
  { q: "How do I keep an open bag crunchy?", a: "Squeeze the air out, roll the top down tight and clip it. Keep it somewhere cool and away from sunlight." },
  { q: "Where can I find allergen information?", a: "Allergen info is printed on every bag next to the nutrition panel. Recipes can change, so the pack is always the source of truth." },
  { q: "Is this an official website?", a: "No — Crunch Lab is a design concept. Nothing here is for sale and no payment is ever taken." },
];

export default function QA() {
  const [open, setOpen] = useState(0);
  return (
    <section id="qa" className="relative grid gap-10 bg-paper px-4 py-28 md:grid-cols-[1fr_1.3fr] md:px-8">
      <div>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">Questions · answered</p>
        <h2 className="flex overflow-hidden font-wide text-[30vw] leading-[0.8] tracking-tighter md:text-[13vw]">
          {"Q&A".split("").map((c, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: "100%", rotate: 12 }}
              whileInView={{ y: "0%", rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {c}
            </motion.span>
          ))}
        </h2>
        <p className="mt-4 max-w-[260px] text-[13px] text-ink/60">Everything you wanted to know before tearing the bag open.</p>
      </div>

      <div className="md:pt-10">
        {QUESTIONS.map((item, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="border-b border-ink/10"
            >
              <button
                onClick={() => {
                  crunch(0.4);
                  setOpen(isOpen ? -1 : i);
                }}
                className="flex w-full items-center gap-4 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-mono text-[10px] text-ink/40">0{i + 1}</span>
                <span className="flex-1 text-[17px] font-medium md:text-[20px]">{item.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? "#0d0d0f" : "rgba(0,0,0,0)", color: isOpen ? "#fff" : "#0d0d0f" }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/20 text-lg"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[560px] pb-6 pl-9 text-[14px] leading-relaxed text-ink/65">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
