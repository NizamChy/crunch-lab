"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Bag from "./Bag";
import { FLAVORS, type Flavor } from "@/lib/flavors";
import { useFly } from "@/store/fly";
import AddButton from "./AddButton";
import { crunch } from "@/lib/sound";

function Card({ flavor, index }: { flavor: Flavor; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 200, damping: 18 });
  const sy = useSpring(py, { stiffness: 200, damping: 18 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const bagX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const bagY = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const [pressed, setPressed] = useState(false);
  const launch = useFly((s) => s.launch);

  const big = index === 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotate: index % 2 ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (index % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={big ? "md:row-span-2" : ""}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        data-cursor
        onPointerMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
          setPressed(false);
        }}
        onPointerDown={() => {
          setPressed(true);
          crunch(0.5);
        }}
        onPointerUp={() => setPressed(false)}
        animate={{ scale: pressed ? 0.96 : 1 }}
        style={{ rotateX: rotX, rotateY: rotY, backgroundColor: flavor.card, transformStyle: "preserve-3d" }}
        className="group relative flex h-full min-h-[230px] flex-col overflow-hidden rounded-[22px] p-4 text-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.4)]"
      >
        <h3 className="relative z-10 font-display text-[28px] leading-[0.9] tracking-tight md:text-[32px]" style={{ transform: "translateZ(30px)" }}>
          {flavor.name.toUpperCase().split(" ").slice(0, 2).join(" ")}
          <br />
          {flavor.name.toUpperCase().split(" ").slice(2).join(" ")}
        </h3>

        <motion.div
          ref={bagRef}
          className="relative z-10 mx-auto mt-auto w-[62%] pt-3"
          style={{ x: bagX, y: bagY, translateZ: 60 }}
          whileHover={{ rotate: -6, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
        >
          <Bag flavor={flavor} className="bag-shadow w-full" />
        </motion.div>

        {/* glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(circle at var(--gx) 30%, rgba(255,255,255,0.35), transparent 55%)",
            ["--gx" as string]: glareX,
          }}
        />

        <div className="relative z-20 mt-3" style={{ transform: "translateZ(40px)" }}>
          <p className="mb-2 flex items-center justify-between gap-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-white/75">
            <span>7.75 oz</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_6px_#39ff7a]" /> In stock
            </span>
          </p>
          <AddButton
            label="Add"
            price={flavor.price}
            onAdd={() => {
              crunch(1);
              if (bagRef.current) launch(flavor.id, bagRef.current, { label: `${flavor.name} added to your basket` });
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Shop() {
  return (
    <section id="shop" className="relative bg-paper px-4 pb-10 pt-28 md:px-8">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "100%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[20vw] leading-[0.82] tracking-tight md:text-[9vw]"
          >
            GRAB
            <br />A BAG
          </motion.h2>
        </div>
        <p className="max-w-[260px] text-[13px] leading-relaxed text-ink/60 md:text-right">
          Tilt a card, press it, poke the bag. Hit <span className="inline-grid h-4 w-4 place-items-center rounded-full bg-ink text-[9px] text-white">+</span> to
          drop a flavor into your box.
        </p>
      </div>
      <div className="grid auto-rows-[minmax(230px,auto)] grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {FLAVORS.map((f, i) => (
          <Card key={f.id} flavor={f} index={i} />
        ))}
      </div>
    </section>
  );
}
