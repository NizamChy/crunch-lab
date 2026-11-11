"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";

type Props = {
  price: number;
  onAdd: () => void;
  label?: string;
  className?: string;
};

const BURST = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  return { x: Math.cos(a) * 26, y: Math.sin(a) * 18 };
});

/** Pill "add to box" button: hover fill sweep, press squish, check-mark morph and a particle burst. */
export default function AddButton({ price, onAdd, label = "Add to box", className }: Props) {
  const [added, setAdded] = useState(0); // increments per add -> re-triggers burst
  const [showAdded, setShowAdded] = useState(false);
  const lock = useRef(0);
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handle(e: React.MouseEvent) {
    e.stopPropagation();
    const now = performance.now();
    if (now - lock.current < 300) return; // debounce double taps
    lock.current = now;
    onAdd();
    setAdded((n) => n + 1);
    setShowAdded(true);
    if (reset.current) clearTimeout(reset.current);
    reset.current = setTimeout(() => setShowAdded(false), 1300);
  }

  return (
    <motion.button
      type="button"
      aria-label={`${label} — $${price.toFixed(2)}`}
      onClick={handle}
      onPointerDown={(e) => e.stopPropagation()}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 26 }}
      className={clsx(
        "group/add relative isolate flex h-11 w-full items-center gap-2 overflow-visible rounded-full pl-1.5 pr-4 text-[12px] font-semibold",
        "shadow-[0_8px_20px_-8px_rgba(0,0,0,0.45),inset_0_-2px_0_rgba(0,0,0,0.06)]",
        className
      )}
    >
      {/* base + hover sweep + added fill */}
      <span className="absolute inset-0 -z-10 overflow-hidden rounded-full bg-white">
        <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-hot transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/add:scale-x-100" />
        <motion.span
          className="absolute inset-0 rounded-full bg-lime"
          initial={false}
          animate={{ clipPath: showAdded ? "circle(150% at 22px 50%)" : "circle(0% at 22px 50%)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>

      {/* icon disc */}
      <span
        className={clsx(
          "relative grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-300",
          showAdded ? "bg-ink text-lime" : "bg-hot text-white group-hover/add:bg-white group-hover/add:text-hot"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {showAdded ? (
            <motion.svg
              key="check"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
            >
              <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.05 }} />
            </motion.svg>
          ) : (
            <motion.svg
              key="plus"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            >
              <path d="M12 5v14M5 12h14" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* burst */}
        {added > 0 &&
          BURST.map((b, i) => (
            <motion.span
              key={`${added}-${i}`}
              className="pointer-events-none absolute h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: i % 2 ? "#39ff7a" : "#ffd23f" }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: b.x, y: b.y, scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
      </span>

      {/* label */}
      <span className="relative h-[1.2em] flex-1 overflow-hidden text-left leading-[1.2em]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={showAdded ? "added" : "add"}
            className={clsx(
              "block whitespace-nowrap transition-colors duration-300",
              showAdded ? "text-ink" : "text-ink group-hover/add:text-white"
            )}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-110%" }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            {showAdded ? "Added!" : label}
          </motion.span>
        </AnimatePresence>
      </span>

      <span
        className={clsx(
          "font-mono text-[11px] tabular-nums transition-colors duration-300",
          showAdded ? "text-ink/70" : "text-ink/55 group-hover/add:text-white/80"
        )}
      >
        ${price.toFixed(2)}
      </span>
    </motion.button>
  );
}
