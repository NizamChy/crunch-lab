"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import Bag from "./Bag";
import { FLAVORS } from "@/lib/flavors";
import { useFly } from "@/store/fly";
import { useCart } from "@/store/cart";

function target() {
  const el = document.getElementById("basket-icon");
  if (!el) return { x: window.innerWidth - 80, y: 32 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export default function Flyers() {
  const flyers = useFly((s) => s.flyers);
  const remove = useFly((s) => s.remove);
  return (
    <div className="pointer-events-none fixed inset-0 z-[150]">
      <AnimatePresence>
        {flyers.map((f) => {
          const flavor = FLAVORS.find((x) => x.id === f.flavorId)!;
          const t = target();
          const w = Math.min(f.from.w, 140);
          return (
            <motion.div
              key={f.key}
              className="absolute left-0 top-0"
              style={{ width: w, marginLeft: -w / 2, marginTop: (-w * 1.42) / 2 }}
              initial={{ x: f.from.x, y: f.from.y, scale: 1, rotate: 0, opacity: 1 }}
              animate={{
                x: [f.from.x, (f.from.x + t.x) / 2, t.x],
                y: [f.from.y, Math.min(f.from.y, t.y) - 160, t.y],
                scale: [1, 0.8, 0.12],
                rotate: [0, -25, 200],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.6, 0, 0.4, 1] }}
              onAnimationComplete={() => remove(f.key)}
            >
              <Bag flavor={flavor} className="bag-shadow w-full" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function Toast() {
  const toast = useCart((s) => s.toast);
  const clear = useCart((s) => s.clearToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clear, 2600);
    return () => clearTimeout(t);
  }, [toast, clear]);
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[160] -translate-x-1/2">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white shadow-2xl ring-1 ring-white/15"
          >
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime align-middle" />
            {toast} · concept only, nothing is charged
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
