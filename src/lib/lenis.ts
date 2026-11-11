import type Lenis from "lenis";

let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (instance = l);
export const getLenis = () => instance;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const l = getLenis();
  if (l) l.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}
