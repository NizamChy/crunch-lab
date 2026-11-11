import { useCart } from "@/store/cart";

let ctx: AudioContext | null = null;

/** Synthesised "crunch": a short filtered noise burst. Only plays when sound is on. */
export function crunch(intensity = 1) {
  if (typeof window === "undefined" || !useCart.getState().sound) return;
  ctx ??= new AudioContext();
  const dur = 0.09 + Math.random() * 0.05;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3) * (Math.random() > 0.7 ? 1 : 0.35);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2200 + Math.random() * 1800;
  filter.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.value = 0.35 * intensity;
  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start();
}
