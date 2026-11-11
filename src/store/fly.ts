import { create } from "zustand";

type Point = { x: number; y: number };

export type Flyer = {
  key: number;
  flavorId: string;
  from: Point & { w: number };
  to: Point;
  /** toast text shown when this bag lands; null = no toast */
  label: string | null;
  delay: number;
};

type FlyState = {
  flyers: Flyer[];
  /** increments every time a bag lands in the basket (drives the basket bump) */
  landed: number;
  launch: (flavorId: string, el: Element, opts?: { label?: string | null; delay?: number }) => void;
  land: (key: number) => void;
};

function basketPoint(): Point {
  const el = document.getElementById("basket-icon");
  if (!el) return { x: window.innerWidth - 80, y: 32 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

let k = 0;
export const useFly = create<FlyState>((set) => ({
  flyers: [],
  landed: 0,
  launch: (flavorId, el, opts) => {
    const r = el.getBoundingClientRect();
    const flyer: Flyer = {
      key: ++k,
      flavorId,
      from: { x: r.left + r.width / 2, y: r.top + r.height / 2, w: Math.min(r.width, 130) },
      to: basketPoint(),
      label: opts?.label === undefined ? null : opts.label,
      delay: opts?.delay ?? 0,
    };
    set((s) => ({ flyers: [...s.flyers, flyer] }));
  },
  land: (key) => set((s) => ({ flyers: s.flyers.filter((f) => f.key !== key), landed: s.landed + 1 })),
}));
