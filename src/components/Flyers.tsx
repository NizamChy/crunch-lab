"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";
import Bag from "./Bag";
import { FLAVORS } from "@/lib/flavors";
import { useFly, type Flyer } from "@/store/fly";
import { useCart } from "@/store/cart";
import { crunch } from "@/lib/sound";

/** One bag flying along a smooth quadratic bezier into the basket. */
function FlyingBag({ f }: { f: Flyer }) {
  const land = useFly((s) => s.land);
  const add = useCart((s) => s.add);
  const flavor = FLAVORS.find((x) => x.id === f.flavorId)!;
  const p = useMotionValue(0);

  const cx = (f.from.x + f.to.x) / 2;
  const cy = Math.min(f.from.y, f.to.y) - 220;
  const bez = (a: number, c: number, b: number, t: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
  const x = useTransform(p, (t) => bez(f.from.x, cx, f.to.x, t) - f.from.w / 2);
  const y = useTransform(p, (t) => bez(f.from.y, cy, f.to.y, t) - (f.from.w * 1.425) / 2);
  const scale = useTransform(p, [0, 0.15, 1], [1, 1.08, 0.14]);
  const rotate = useTransform(p, [0, 0.4, 1], [0, -18, 24]);
  const opacity = useTransform(p, [0, 0.88, 1], [1, 1, 0]);

  useEffect(() => {
    const ctl = animate(p, 1, {
      duration: 0.9,
      delay: f.delay,
      ease: [0.55, 0, 0.3, 1],
      onComplete: () => {
        crunch(0.6);
        add([f.flavorId], f.label);
        land(f.key);
      },
    });
    return () => ctl.stop();
    // run once per flyer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="absolute left-0 top-0 will-change-transform"
      style={{ width: f.from.w, x, y, scale, rotate, opacity }}
    >
      <Bag flavor={flavor} className="w-full" lite />
    </motion.div>
  );
}

export default function Flyers() {
  const flyers = useFly((s) => s.flyers);
  return (
    <div className="pointer-events-none fixed inset-0 z-[150]">
      {flyers.map((f) => (
        <FlyingBag key={f.key} f={f} />
      ))}
    </div>
  );
}

export function Toast() {
  const toast = useCart((s) => s.toast);
  const toastId = useCart((s) => s.toastId);
  const clear = useCart((s) => s.clearToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clear, 2600);
    return () => clearTimeout(t);
  }, [toast, toastId, clear]);
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[160] -translate-x-1/2">
      <AnimatePresence mode="popLayout">
        {toast && (
          <motion.div
            key={toastId}
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-ink/95 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white shadow-2xl ring-1 ring-white/15 backdrop-blur"
          >
            <span className="grid h-4 w-4 place-items-center rounded-full bg-lime text-[9px] text-ink">✓</span>
            {toast}
            <span className="hidden text-white/40 md:inline">· concept only</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
