import { create } from "zustand";

export type Flyer = { key: number; flavorId: string; from: { x: number; y: number; w: number } };

type FlyState = {
  flyers: Flyer[];
  launch: (flavorId: string, el: Element) => void;
  remove: (key: number) => void;
};

let k = 0;
export const useFly = create<FlyState>((set) => ({
  flyers: [],
  launch: (flavorId, el) => {
    const r = el.getBoundingClientRect();
    set((s) => ({ flyers: [...s.flyers, { key: ++k, flavorId, from: { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width } }] }));
  },
  remove: (key) => set((s) => ({ flyers: s.flyers.filter((f) => f.key !== key) })),
}));
