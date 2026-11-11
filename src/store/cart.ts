import { create } from "zustand";

type CartState = {
  items: string[];
  sound: boolean;
  toast: string | null;
  add: (ids: string[], label?: string) => void;
  toggleSound: () => void;
  clearToast: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  sound: false,
  toast: null,
  add: (ids, label) =>
    set((s) => ({ items: [...s.items, ...ids], toast: label ?? `${ids.length} bag${ids.length > 1 ? "s" : ""} added to your basket` })),
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  clearToast: () => set({ toast: null }),
}));
