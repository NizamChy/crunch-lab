"use client";

import { useId } from "react";
import type { Flavor } from "@/lib/flavors";

type Props = {
  flavor: Flavor;
  side?: "front" | "back";
  className?: string;
  style?: React.CSSProperties;
  /** skip the raster crinkle textures (for tiny or fast-moving bags) */
  lite?: boolean;
};

/* ---------- geometry (viewBox 0 0 200 285) ---------- */

/** zig-zag crimp edge from x0 -> x1 at baseline y, teeth pointing by `depth` */
function zig(x0: number, x1: number, y: number, depth: number, teeth = 24) {
  const w = (x1 - x0) / teeth;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    d += ` L${(x0 + w * i + w / 2).toFixed(2)},${y + depth} L${(x0 + w * (i + 1)).toFixed(2)},${y}`;
  }
  return d;
}

const TOP_SEAL = `M8,26 L8,7 ${zig(8, 192, 7, -4)} L192,26 Z`;
const BOTTOM_SEAL = `M8,259 L192,259 L192,278 ${zig(192, 8, 278, 4)} Z`;
const BODY = "M11,22 L189,22 C193,48 197,100 197,142 C197,186 194,232 189,263 L11,263 C6,232 3,186 3,142 C3,100 7,48 11,22 Z";
const SILHOUETTE = `${TOP_SEAL} ${BODY} ${BOTTOM_SEAL}`;

/** irregular, wavy-edged chip outline */
const CHIP =
  "M-30,-1 C-31,-9 -24,-17 -14,-19 C-8,-22 -1,-19 5,-21 C14,-22 24,-15 28,-8 C31,-2 29,5 30,9 C27,17 16,20 8,19 C2,21 -6,18 -12,20 C-21,20 -29,13 -30,-1 Z";
/** fold / curl line across the chip */
const CURL = "M-26,6 C-14,0 4,4 26,-4";
const RIDGES = "M-20,-15 Q-15,0 -21,15 M-9,-19 Q-3,0 -10,19 M3,-20 Q9,0 3,19 M15,-17 Q21,0 15,16";
// fx/fy flatten the chip so it reads as a thin wafer seen at an angle
const PILE = [
  { x: -50, y: 18, r: -34, s: 0.92, fy: 0.62 },
  { x: 50, y: 20, r: 30, s: 0.92, fy: 0.6 },
  { x: -26, y: 4, r: -14, s: 1, fy: 0.72 },
  { x: 28, y: 2, r: 16, s: 1, fy: 0.7 },
  { x: -2, y: 22, r: -4, s: 1.06, fy: 0.56 },
  { x: 2, y: -12, r: 8, s: 1.1, fy: 0.78 },
];
const SPECKS = [
  [-14, -7],
  [6, 5],
  [15, -10],
  [-5, 11],
  [19, 8],
  [-19, 3],
  [2, -12],
  [-9, -1],
];
const SPECK_COLOR: Record<string, string> = {
  "flamin-hot": "#b3120a",
  "sour-cream": "#2f7a2a",
  barbecue: "#7a2a10",
  "sweet-heat": "#9c1d12",
  "all-dressed": "#7a3b12",
  cheddar: "#e06a00",
  "bacon-cheese": "#8f3210",
};
const WRINKLES = [24, 44, 63, 84, 103, 122, 141, 160, 178];

export default function Bag({ flavor, side = "front", className, style, lite }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (n: string) => `${n}${uid}`;
  const url = (n: string) => `url(#${id(n)})`;
  const words = flavor.name.toUpperCase().split(" ");
  const lines = words.length > 2 ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : words;
  const nameSize = Math.max(...lines.map((l) => l.length)) > 9 ? 17 : 22;
  const speck = SPECK_COLOR[flavor.id];
  const chipTint = flavor.id === "flamin-hot" ? "#ff5a2e" : "#f8c84a";

  return (
    <svg viewBox="0 0 200 285" className={className} style={style} aria-label={`${flavor.name} chips bag`} role="img">
      <defs>
        <linearGradient id={id("body")} x1="0" x2="1">
          <stop offset="0" stopColor={flavor.bagDark} />
          <stop offset="0.16" stopColor={flavor.bag} />
          <stop offset="0.36" stopColor={flavor.bag} stopOpacity="0.92" />
          <stop offset="0.7" stopColor={flavor.bag} />
          <stop offset="1" stopColor={flavor.bagDark} />
        </linearGradient>
        <linearGradient id={id("seal")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={flavor.bagDark} />
          <stop offset="0.35" stopColor={flavor.bag} />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.7" stopColor={flavor.bag} />
          <stop offset="1" stopColor={flavor.bagDark} />
        </linearGradient>
        <linearGradient id={id("sealSide")} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.1" stopColor="#000" stopOpacity="0" />
          <stop offset="0.9" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id={id("puff")} cx="0.42" cy="0.46" r="0.62">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.85" stopColor="#000" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        <linearGradient id={id("vshade")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.4" />
          <stop offset="0.09" stopColor="#000" stopOpacity="0" />
          <stop offset="0.9" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id={id("spec")}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("foil")} x1="0" x2="1">
          <stop offset="0" stopColor="#8e959c" />
          <stop offset="0.3" stopColor="#f4f6f8" />
          <stop offset="0.55" stopColor="#a7aeb5" />
          <stop offset="0.8" stopColor="#ffffff" />
          <stop offset="1" stopColor="#8e959c" />
        </linearGradient>
        <linearGradient id={id("chip")} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffe9a6" />
          <stop offset="0.3" stopColor={chipTint} />
          <stop offset="0.55" stopColor="#f0b53a" />
          <stop offset="0.8" stopColor={chipTint} />
          <stop offset="1" stopColor="#c27615" />
        </linearGradient>
        <radialGradient id={id("brown")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.6" stopColor="#a3560c" stopOpacity="0" />
          <stop offset="1" stopColor="#a3560c" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id={id("pileShadow")}>
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("sun")} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#fff3a8" />
          <stop offset="0.55" stopColor="#ffd000" />
          <stop offset="1" stopColor="#f29100" />
        </radialGradient>
        <linearGradient id={id("ribbon")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ff2a3d" />
          <stop offset="1" stopColor="#b5001b" />
        </linearGradient>
        <clipPath id={id("clip")}>
          <path d={SILHOUETTE} />
        </clipPath>
        <clipPath id={id("chipClip")}>
          <path d={CHIP} />
        </clipPath>
        <clipPath id={id("bodyClip")}>
          <path d={BODY} />
        </clipPath>
      </defs>

      {/* ---------- crimped seals ---------- */}
      <path d={TOP_SEAL} fill={url("seal")} />
      <path d={BOTTOM_SEAL} fill={url("seal")} />
      <g clipPath={url("clip")}>
        {Array.from({ length: 70 }).map((_, i) => (
          <g key={i}>
            <line x1={9 + i * 2.62} x2={9 + i * 2.62} y1="3" y2="26" stroke="#000" strokeOpacity="0.2" strokeWidth="0.7" />
            <line x1={9 + i * 2.62} x2={9 + i * 2.62} y1="259" y2="282" stroke="#000" strokeOpacity="0.2" strokeWidth="0.7" />
          </g>
        ))}
        <rect x="0" y="0" width="200" height="285" fill={url("sealSide")} />
      </g>
      {/* tear notch */}
      <path d="M192,15 L186,17.5 L192,20 Z" fill="#000" opacity="0.35" />

      {/* ---------- body ---------- */}
      <path d={BODY} fill={url("body")} />

      <g clipPath={url("bodyClip")}>
        {side === "front" ? (
          <>
            {/* header wave */}
            <path d="M0,20 L200,20 L200,84 C150,104 70,62 0,98 Z" fill={flavor.bagDark} opacity="0.5" />
            <path d="M0,98 C70,62 150,104 200,84" stroke="#ffd23f" strokeWidth="3.5" fill="none" />
            <path d="M0,104 C70,68 150,110 200,90" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" fill="none" />

            {/* logo */}
            <g transform="translate(100 66)">
              <circle r="40" fill="#000" opacity="0.18" transform="translate(2 4)" />
              {Array.from({ length: 20 }).map((_, i) => (
                <path key={i} d="M-3,-38 L0,-49 L3,-38 Z" fill="#ffd000" transform={`rotate(${i * 18})`} />
              ))}
              <circle r="38" fill={url("sun")} />
              <circle r="38" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.2" />
              <path d="M-60,-9 Q0,-24 60,-9 L56,15 Q0,0 -56,15 Z" fill="#000" opacity="0.25" transform="translate(1.5 3)" />
              <path d="M-60,-9 Q0,-24 60,-9 L56,15 Q0,0 -56,15 Z" fill={url("ribbon")} />
              <path d="M-58,-7 Q0,-21 58,-7" stroke="#fff" strokeOpacity="0.45" strokeWidth="1" fill="none" />
              <text x="1.2" y="8.6" textAnchor="middle" fontFamily="var(--font-wide)" fontSize="19" fill="#5c0010" letterSpacing="0.5" fontStyle="italic">
                CRUNCH
              </text>
              <text x="0" y="7" textAnchor="middle" fontFamily="var(--font-wide)" fontSize="19" fill="#fff" letterSpacing="0.5" fontStyle="italic">
                CRUNCH
              </text>
              <text x="0" y="29" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="#8a1c00" letterSpacing="2.2">
                LAB · EST 2026
              </text>
            </g>

            {/* flavor name */}
            {lines.map((l, i) => (
              <g key={i}>
                <text x="101.5" y={132 + i * (nameSize - 1) + 2} textAnchor="middle" fontFamily="var(--font-display)" fontSize={nameSize} fill="#000" opacity="0.35">
                  {l}
                </text>
                <text x="100" y={132 + i * (nameSize - 1)} textAnchor="middle" fontFamily="var(--font-display)" fontSize={nameSize} fill={flavor.ink} letterSpacing="0.4">
                  {l}
                </text>
              </g>
            ))}
            <text x="100" y={136 + lines.length * (nameSize - 1)} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="5.6" fill="#fff" opacity="0.85" letterSpacing="1.6">
              POTATO CHIPS
            </text>

            {/* chip pile */}
            <ellipse cx="100" cy="236" rx="78" ry="12" fill={url("pileShadow")} />
            <g transform="translate(100 206) scale(1.18)">
              {PILE.map((c, i) => (
                <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.r}) scale(${c.s} ${c.s * c.fy})`}>
                  <path d={CHIP} fill="#3b1d05" opacity="0.32" transform="translate(1.5 6)" />
                  <path d={CHIP} fill={url("chip")} stroke="#b8690f" strokeWidth="0.9" strokeOpacity="0.7" />
                  <path d={CHIP} fill={url("brown")} />
                  {/* curl: darker underside below the fold, bright lip above */}
                  <path d={`${CURL} L30,22 L-30,22 Z`} fill="#7a3d06" opacity="0.18" clipPath={url("chipClip")} />
                  <path d={CURL} stroke="#fff4cc" strokeOpacity="0.7" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                  <path d={RIDGES} stroke="#8a4a0e" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                  <path d={RIDGES} stroke="#fff3c4" strokeOpacity="0.32" strokeWidth="0.7" fill="none" transform="translate(-1.5 0)" />
                  {speck &&
                    SPECKS.map(([sx, sy], j) => <circle key={j} cx={sx} cy={sy} r={j % 3 ? 1.2 : 1.8} fill={speck} opacity="0.9" />)}
                </g>
              ))}
            </g>

            {/* badges */}
            <g transform="translate(32 246)">
              <circle r="13" fill="#fff" opacity="0.92" />
              <circle r="11" fill="none" stroke={flavor.bagDark} strokeWidth="0.8" strokeDasharray="1.5 1.5" />
              <text y="-1.5" textAnchor="middle" fontFamily="var(--font-display)" fontSize="6.5" fill={flavor.bagDark}>100%</text>
              <text y="5" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="3.4" fill={flavor.bagDark} letterSpacing="0.3">REAL POTATO</text>
            </g>
            <text x="186" y="252" textAnchor="end" fontFamily="var(--font-mono)" fontSize="5.4" fill="#fff" opacity="0.9" letterSpacing="0.8">
              NET WT 7.75 OZ (219.7g)
            </text>
          </>
        ) : (
          <>
            {/* back: nutrition panel, ingredients, barcode */}
            <rect x="24" y="40" width="96" height="160" rx="3" fill="#fff" />
            <text x="30" y="56" fontFamily="var(--font-wide)" fontSize="10" fill="#111">Nutrition Facts</text>
            <rect x="30" y="60" width="84" height="3.5" fill="#111" />
            {Array.from({ length: 12 }).map((_, i) => (
              <g key={i}>
                <rect x="30" y={70 + i * 10.5} width={28 + ((i * 17) % 42)} height="3.6" fill="#111" opacity="0.75" />
                <rect x="102" y={70 + i * 10.5} width="12" height="3.6" fill="#111" opacity="0.75" />
                <rect x="30" y={76.5 + i * 10.5} width="84" height="0.5" fill="#111" opacity="0.4" />
              </g>
            ))}
            <text x="130" y="52" fontFamily="var(--font-mono)" fontSize="5" fill="#fff" opacity="0.9" letterSpacing="0.6">INGREDIENTS</text>
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={i} x="130" y={57 + i * 6} width={44 - (i % 3) * 8} height="2.4" rx="1" fill="#fff" opacity="0.65" />
            ))}
            <rect x="130" y="150" width="48" height="46" rx="2" fill="#fff" />
            {Array.from({ length: 20 }).map((_, i) => (
              <rect key={i} x={133 + i * 2.1} y="154" width={i % 3 === 0 ? 1.5 : 0.8} height="32" fill="#111" />
            ))}
            <text x="154" y="193" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="4.5" fill="#111">0 28400 31042 6</text>
            <text x="154" y="105" textAnchor="middle" fontFamily="var(--font-display)" fontSize="15" fill={flavor.ink} transform="rotate(90 154 105)">
              {flavor.short.toUpperCase()}
            </text>
            <text x="100" y="228" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="5.6" fill="#fff" opacity="0.85" letterSpacing="1">
              PACKED FOR FRESHNESS · N₂ FLUSHED
            </text>
            <text x="100" y="240" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="4.6" fill="#fff" opacity="0.6" letterSpacing="0.8">
              BEST BEFORE 03 MAR 2027 · LOT 26-114B
            </text>
          </>
        )}

        {/* ---------- pillow lighting ---------- */}
        <rect x="0" y="0" width="200" height="285" fill={url("puff")} />
        <rect x="0" y="0" width="200" height="285" fill={url("vshade")} />

        {/* pucker wrinkles under the seals */}
        {WRINKLES.map((x, i) => (
          <g key={i}>
            <path d={`M${x},22 Q${x + 5},${32 + (i % 3) * 3} ${x - 1},${42 + (i % 4) * 5}`} stroke="#fff" strokeOpacity="0.28" strokeWidth="1.3" fill="none" />
            <path d={`M${x + 2.5},22 Q${x + 7},${32 + (i % 3) * 3} ${x + 1.5},${40 + (i % 4) * 5}`} stroke="#000" strokeOpacity="0.2" strokeWidth="1.3" fill="none" />
            <path d={`M${x},263 Q${x + 5},${252 - (i % 3) * 3} ${x - 1},${244 - (i % 4) * 4}`} stroke="#fff" strokeOpacity="0.22" strokeWidth="1.2" fill="none" />
            <path d={`M${x + 2.5},263 Q${x + 7},${252 - (i % 3) * 3} ${x + 1.5},${246 - (i % 4) * 4}`} stroke="#000" strokeOpacity="0.2" strokeWidth="1.2" fill="none" />
          </g>
        ))}

        {/* specular highlights */}
        <ellipse cx="56" cy="146" rx="17" ry="104" fill={url("spec")} />
        <ellipse cx="156" cy="138" rx="6" ry="86" fill={url("spec")} opacity="0.7" />
        <ellipse cx="100" cy="33" rx="80" ry="5" fill={url("spec")} opacity="0.8" />
        <ellipse cx="100" cy="253" rx="70" ry="4" fill={url("spec")} opacity="0.45" />
      </g>

      {/* foil lip where seal meets body */}
      <path d="M11,25.5 L189,25.5" stroke={url("foil")} strokeWidth="1.3" />
      <path d="M11,259.5 L189,259.5" stroke={url("foil")} strokeWidth="1.3" />

      {/* crinkled foil texture (rasterised once by the browser) */}
      {!lite && (
        <g clipPath={url("clip")}>
          <image href="/textures/crinkle.svg" x="0" y="0" width="200" height="285" preserveAspectRatio="none" opacity="0.22" style={{ mixBlendMode: "soft-light" }} />
          <image href="/textures/crinkle-spec.svg" x="0" y="0" width="200" height="285" preserveAspectRatio="none" opacity="0.28" style={{ mixBlendMode: "screen" }} />
        </g>
      )}
    </svg>
  );
}
