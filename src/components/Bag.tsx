"use client";

import { useId } from "react";
import type { Flavor } from "@/lib/flavors";

type Props = {
  flavor: Flavor;
  side?: "front" | "back";
  className?: string;
  style?: React.CSSProperties;
  /** accepted for API compatibility; this bag has no heavy layers to skip */
  lite?: boolean;
};

/** Crimped top/bottom edge as a zig-zag path segment. */
function crimp(y: number, x0: number, x1: number, teeth: number, depth: number, dir: 1 | -1) {
  const w = (x1 - x0) / teeth;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const xa = x0 + w * i + w / 2;
    const xb = x0 + w * (i + 1);
    d += ` L${xa},${y + depth * dir} L${xb},${y}`;
  }
  return d;
}

const TOP = crimp(10, 14, 186, 18, -5, 1);
const BOTTOM_PTS = (() => {
  // reversed (right -> left) along the bottom
  const teeth = 18;
  const w = 172 / teeth;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const xa = 186 - w * i - w / 2;
    const xb = 186 - w * (i + 1);
    d += ` L${xa},${275} L${xb},${270}`;
  }
  return d;
})();

export const BAG_PATH = `M14,10 ${TOP} C192,40 196,120 192,180 C190,225 194,250 186,270 ${BOTTOM_PTS} C6,250 10,225 8,180 C4,120 8,40 14,10 Z`;

export default function Bag({ flavor, side = "front", className, style }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = (n: string) => `${n}-${uid}`;
  const words = flavor.name.toUpperCase().split(" ");

  return (
    <svg viewBox="0 0 200 285" className={className} style={style} aria-label={`${flavor.name} chips bag`} role="img">
      <defs>
        <linearGradient id={g("body")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={flavor.bagDark} />
          <stop offset="0.18" stopColor={flavor.bag} />
          <stop offset="0.55" stopColor={flavor.bag} />
          <stop offset="1" stopColor={flavor.bagDark} />
        </linearGradient>
        <linearGradient id={g("gloss")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={g("shade")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.12" stopColor="#000" stopOpacity="0" />
          <stop offset="0.88" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id={g("chip")} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff6cf" />
          <stop offset="0.5" stopColor={flavor.chip} />
          <stop offset="1" stopColor="#b8741c" />
        </radialGradient>
        <radialGradient id={g("sun")} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#ffe46b" />
          <stop offset="1" stopColor="#ffb703" />
        </radialGradient>
        <clipPath id={g("clip")}>
          <path d={BAG_PATH} />
        </clipPath>
      </defs>

      <path d={BAG_PATH} fill={`url(#${g("body")})`} />

      <g clipPath={`url(#${g("clip")})`}>
        {/* crimp bands */}
        <rect x="0" y="0" width="200" height="26" fill={flavor.bagDark} opacity="0.55" />
        <rect x="0" y="256" width="200" height="30" fill={flavor.bagDark} opacity="0.55" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={i} x1={8 + i * 8.6} x2={8 + i * 8.6} y1="2" y2="24" stroke="#000" strokeOpacity="0.18" strokeWidth="1.2" />
        ))}
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={`b${i}`} x1={8 + i * 8.6} x2={8 + i * 8.6} y1="258" y2="282" stroke="#000" strokeOpacity="0.18" strokeWidth="1.2" />
        ))}

        {side === "front" ? (
          <>
            {/* chips */}
            <g transform="translate(100 212) scale(0.9)">
              <ellipse cx="-38" cy="10" rx="34" ry="24" fill={`url(#${g("chip")})`} transform="rotate(-18)" />
              <ellipse cx="30" cy="16" rx="36" ry="25" fill={`url(#${g("chip")})`} transform="rotate(14)" />
              <ellipse cx="-4" cy="-6" rx="40" ry="28" fill={`url(#${g("chip")})`} transform="rotate(-4)" />
              {[-20, -8, 4, 16].map((x) => (
                <path key={x} d={`M${x - 14},-24 Q${x},-6 ${x - 10},18`} stroke="#9a5a12" strokeOpacity="0.25" fill="none" strokeWidth="2" />
              ))}
            </g>

            {/* logo */}
            <g transform="translate(100 74) scale(0.82)">
              <circle r="44" fill={`url(#${g("sun")})`} />
              {Array.from({ length: 16 }).map((_, i) => (
                <rect key={i} x="-2" y="-54" width="4" height="9" rx="2" fill="#ffd23f" transform={`rotate(${i * 22.5})`} />
              ))}
              <path d="M-58,-8 Q0,-22 58,-8 L54,14 Q0,0 -54,14 Z" fill="#d90429" />
              <text x="0" y="8" textAnchor="middle" fontFamily="var(--font-wide)" fontSize="19" fill="#fff" letterSpacing="1" style={{ fontStyle: "italic" }}>
                CRUNCH
              </text>
              <text x="0" y="30" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="#9b2226" letterSpacing="2">
                LAB · EST 26
              </text>
            </g>

            {/* flavor name */}
            <g>
              {words.slice(0, 3).map((w, i) => (
                <text
                  key={i}
                  x="100"
                  y={146 + i * 15}
                  textAnchor="middle"
                  fontFamily="var(--font-display)"
                  fontSize={words.length > 2 ? 14 : 17}
                  fill={flavor.ink}
                  stroke="#000"
                  strokeOpacity="0.25"
                  strokeWidth="0.6"
                  letterSpacing="0.5"
                >
                  {w}
                </text>
              ))}
            </g>
            <text x="100" y="250" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6.5" fill="#fff" opacity="0.8" letterSpacing="1.5">
              NET WT 7.75 OZ (219.7g)
            </text>
          </>
        ) : (
          <>
            {/* back: nutrition panel + barcode */}
            <rect x="26" y="44" width="92" height="150" rx="3" fill="#fff" />
            <text x="32" y="60" fontFamily="var(--font-wide)" fontSize="10" fill="#111">Nutrition Facts</text>
            <rect x="32" y="64" width="80" height="3" fill="#111" />
            {Array.from({ length: 11 }).map((_, i) => (
              <g key={i}>
                <rect x="32" y={74 + i * 10.5} width={30 + ((i * 17) % 40)} height="4" fill="#111" opacity="0.75" />
                <rect x="100" y={74 + i * 10.5} width="12" height="4" fill="#111" opacity="0.75" />
              </g>
            ))}
            <rect x="130" y="150" width="46" height="44" fill="#fff" />
            {Array.from({ length: 18 }).map((_, i) => (
              <rect key={i} x={133 + i * 2.3} y="154" width={i % 3 === 0 ? 1.6 : 0.9} height="32" fill="#111" />
            ))}
            <text x="146" y="70" textAnchor="middle" fontFamily="var(--font-display)" fontSize="16" fill={flavor.ink} transform="rotate(90 146 70)">
              {flavor.short.toUpperCase()}
            </text>
            <text x="100" y="230" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6.5" fill="#fff" opacity="0.85" letterSpacing="1">
              PACKED FOR FRESHNESS · N₂ FLUSHED
            </text>
          </>
        )}

        <path d={BAG_PATH} fill={`url(#${g("shade")})`} />
        <rect x="46" y="0" width="34" height="285" fill={`url(#${g("gloss")})`} opacity="0.55" transform="skewX(-6)" />
        <rect x="140" y="0" width="12" height="285" fill={`url(#${g("gloss")})`} opacity="0.3" />
      </g>
    </svg>
  );
}
