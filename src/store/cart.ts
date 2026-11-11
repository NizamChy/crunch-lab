import { create } from "zustand";

type CartState = {
  items: string[];
  sound: boolean;
  toast: string | null;
  /** bumps on every new toast so repeated identical messages still re-show */
  toastId: number;
  /** label: toast text; null keeps the current toast */
  add: (ids: string[], label?: string | null) => void;
  toggleSound: () => void;
  clearToast: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  sound: false,
  toast: null,
  toastId: 0,
  add: (ids, label) =>
    set((s) =>
      label === null
        ? { items: [...s.items, ...ids] }
        : {
            items: [...s.items, ...ids],
            toast: label ?? `${ids.length} bag${ids.length > 1 ? "s" : ""} added to your basket`,
            toastId: s.toastId + 1,
          }
    ),
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  clearToast: () => set({ toast: null }),
}));
