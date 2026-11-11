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

function zig(x0: number, x1: number, y: number, depth: number, teeth = 30) {
  const w = (x1 - x0) / teeth;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    d += ` L${(x0 + w * i + w / 2).toFixed(2)},${y + depth} L${(x0 + w * (i + 1)).toFixed(2)},${y}`;
  }
  return d;
}

const TOP_SEAL = `M9,18 L9,6 ${zig(9, 191, 6, -3.5)} L191,18 Z`;
const BOTTOM_SEAL = `M9,267 L191,267 L191,280 ${zig(191, 9, 280, 3.5)} Z`;
const BODY = "M12,14 L188,14 C193,40 196,100 196,142 C196,190 193,236 188,271 L12,271 C7,236 4,190 4,142 C4,100 7,40 12,14 Z";
const SILHOUETTE = `${TOP_SEAL} ${BODY} ${BOTTOM_SEAL}`;

/** irregular wavy chip outline, ~60x42 around 0,0 */
const CHIP =
  "M-30,-1 C-31,-9 -24,-17 -14,-19 C-8,-22 -1,-19 5,-21 C14,-22 24,-15 28,-8 C31,-2 29,5 30,9 C27,17 16,20 8,19 C2,21 -6,18 -12,20 C-21,20 -29,13 -30,-1 Z";

/** big chips spilling across the lower half, like product photography */
const SPILL = [
  { x: 44, y: 222, r: -50, s: 1, fy: 0.6 },
  { x: 158, y: 220, r: 46, s: 1, fy: 0.62 },
  { x: 100, y: 214, r: -4, s: 1.1, fy: 0.95 },
  { x: 72, y: 238, r: 20, s: 1.15, fy: 0.9 },
  { x: 130, y: 236, r: -18, s: 1.15, fy: 0.88 },
  { x: 40, y: 262, r: -30, s: 1.15, fy: 0.85 },
  { x: 160, y: 260, r: 28, s: 1.2, fy: 0.8 },
  { x: 100, y: 252, r: 80, s: 0.95, fy: 0.45 },
  { x: 100, y: 272, r: 8, s: 1.2, fy: 0.75 },
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
  [10, 13],
];
const SPECK_COLOR: Record<string, string> = {
  "flamin-hot": "#a30d06",
  "sour-cream": "#2f7a2a",
  barbecue: "#7a2a10",
  "sweet-heat": "#9c1d12",
  "all-dressed": "#7a3b12",
  cheddar: "#e06a00",
  "bacon-cheese": "#8f3210",
  "salt-vinegar": "#ffffff",
};

/** small hand-built "ingredient" vignette per flavor, drawn behind/next to the chips */
function Ingredient({ id, uid }: { id: string; uid: string }) {
  switch (id) {
    case "sour-cream":
      return (
        <g>
          {[
            [158, 184, -20],
            [36, 186, 15],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
              {[18, 14, 10, 6].map((rr, j) => (
                <ellipse key={j} rx={rr} ry={rr * 0.42} fill="none" stroke={j % 2 ? "#e9e2f0" : "#fbf8ff"} strokeWidth="2.6" />
              ))}
              <ellipse rx="18" ry="7.6" fill="none" stroke="#b9a4cf" strokeWidth="0.8" />
            </g>
          ))}
          {[
            [140, 160, 30],
            [150, 166, 12],
            [48, 162, -24],
            [168, 200, 60],
          ].map(([x, y, r], i) => (
            <rect key={i} x={x} y={y} width="3" height="26" rx="1.5" fill="#2f8f2c" transform={`rotate(${r} ${x} ${y})`} />
          ))}
        </g>
      );
    case "salt-vinegar":
      return (
        <g transform="translate(160 150)">
          <path d="M-6,-34 L6,-34 L6,-22 C14,-16 16,-6 16,4 L16,44 C16,48 13,50 10,50 L-10,50 C-13,50 -16,48 -16,44 L-16,4 C-16,-6 -14,-16 -6,-22 Z" fill={`url(#glass${uid})`} stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1" />
          <rect x="-7" y="-42" width="14" height="9" rx="2" fill="#2b2b2b" />
          <rect x="-14" y="8" width="28" height="22" rx="2" fill="#fff" opacity="0.9" />
          <text y="22" textAnchor="middle" fontFamily="var(--font-display)" fontSize="7" fill="#1667b5">VINEGAR</text>
          <path d="M-10,-14 C-12,0 -12,20 -10,40" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" fill="none" />
        </g>
      );
    case "barbecue":
    case "sweet-heat":
      return (
        <g transform="translate(156 172)">
          <ellipse cx="0" cy="14" rx="30" ry="10" fill="#000" opacity="0.3" />
          <path d="M-28,0 C-26,18 26,18 28,0 Z" fill="#f2efe9" />
          <ellipse rx="28" ry="9" fill="#e6e0d6" />
          <ellipse rx="23" ry="6.5" fill={id === "barbecue" ? "#5c1406" : "#8f1408"} />
          <ellipse cx="-6" cy="-2" rx="8" ry="2" fill="#fff" opacity="0.35" />
          <path d="M14,-4 L40,-40" stroke="#6b3b1a" strokeWidth="4" strokeLinecap="round" />
          <path d="M8,2 L16,-8 L22,-4 L14,6 Z" fill="#3b2412" />
        </g>
      );
    case "flamin-hot":
      return (
        <g>
          <path
            d="M4,285 C0,250 18,232 14,206 C26,222 30,236 28,248 C34,224 44,206 40,180 C58,204 62,226 58,250 C66,236 70,220 68,204 C86,228 88,256 84,285 Z"
            fill={`url(#flame${uid})`}
            opacity="0.95"
          />
          <path
            d="M116,285 C112,256 128,236 124,212 C138,230 142,246 140,258 C148,236 156,220 154,196 C172,222 178,248 172,285 Z"
            fill={`url(#flame${uid})`}
            opacity="0.95"
          />
        </g>
      );
    case "cheddar":
    case "bacon-cheese":
      return (
        <g>
          <g transform="translate(150 176) rotate(-10)">
            <path d="M-26,10 L26,10 L26,-6 L-20,-22 Z" fill="#ffb81c" />
            <path d="M-26,10 L26,10 L26,-6 Z" fill="#f59e0b" opacity="0.6" />
            <circle cx="-4" cy="0" r="3.5" fill="#d97706" />
            <circle cx="12" cy="4" r="2.4" fill="#d97706" />
            <circle cx="-14" cy="-6" r="2" fill="#d97706" />
          </g>
          {id === "bacon-cheese" ? (
            <path d="M18,176 C30,166 40,186 52,176 C64,166 74,186 86,176 L86,186 C74,196 64,176 52,186 C40,196 30,176 18,186 Z" fill="#b5462c" stroke="#f3c2a6" strokeWidth="1.5" transform="rotate(-14 52 180)" />
          ) : (
            <path d="M28,180 C24,168 40,160 46,168 C54,160 66,170 58,180 C62,188 34,190 28,180 Z" fill="#fffdf6" stroke="#e8e0cc" strokeWidth="0.8" />
          )}
        </g>
      );
    case "all-dressed":
      return (
        <g>
          <g transform="translate(160 176)">
            <circle r="20" fill="#e3261b" />
            <circle r="16" fill="#f04a3a" />
            {[0, 60, 120, 180, 240, 300].map((a) => {
              const ex = +(Math.cos((a * Math.PI) / 180) * 9).toFixed(2);
              const ey = +(Math.sin((a * Math.PI) / 180) * 9).toFixed(2);
              return (
                <ellipse key={a} cx={ex} cy={ey} rx="3" ry="4.5" fill="#ffd2a6" transform={`rotate(${a + 90} ${ex} ${ey})`} />
              );
            })}
          </g>
          <g transform="translate(38 182) rotate(20)">
            {[16, 12, 8].map((rr, j) => (
              <ellipse key={j} rx={rr} ry={rr * 0.45} fill="none" stroke="#f5efff" strokeWidth="2.4" />
            ))}
          </g>
        </g>
      );
    default:
      // classic: a few salt crystals
      return (
        <g fill="#ffffff" opacity="0.9">
          {[
            [40, 176],
            [160, 182],
            [150, 170],
            [52, 168],
            [170, 196],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="3" height="3" transform={`rotate(${i * 23} ${x} ${y})`} />
          ))}
        </g>
      );
  }
}

export default function Bag({ flavor, side = "front", className, style, lite }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (n: string) => `${n}${uid}`;
  const url = (n: string) => `url(#${id(n)})`;
  const words = flavor.name.toUpperCase().split(" ");
  const lines = words.length > 2 ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : [flavor.name.toUpperCase()];
  const longest = Math.max(...lines.map((l) => l.length));
  const nameSize = longest > 16 ? 8.5 : longest > 11 ? 10 : 12;
  const speck = SPECK_COLOR[flavor.id];
  const hot = flavor.id === "flamin-hot";
  const chipTint = hot ? "#ff4a1f" : "#f8c84a";
  const chipDeep = hot ? "#b51c06" : "#d48a1a";
  const labelBg = flavor.id === "classic" || flavor.id === "bacon-cheese" ? "#c8102e" : "#ffffff";
  const labelInk = labelBg === "#ffffff" ? flavor.bagDark : "#ffffff";

  return (
    <svg viewBox="0 0 200 285" className={className} style={style} aria-label={`${flavor.name} chips bag`} role="img">
      <defs>
        <linearGradient id={id("body")} x1="0" x2="1">
          <stop offset="0" stopColor={flavor.bagDark} />
          <stop offset="0.14" stopColor={flavor.bag} />
          <stop offset="0.5" stopColor={flavor.bag} />
          <stop offset="0.86" stopColor={flavor.bag} />
          <stop offset="1" stopColor={flavor.bagDark} />
        </linearGradient>
        <linearGradient id={id("seal")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={flavor.bagDark} />
          <stop offset="0.45" stopColor={flavor.bag} />
          <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="0.75" stopColor={flavor.bag} />
          <stop offset="1" stopColor={flavor.bagDark} />
        </linearGradient>
        <linearGradient id={id("sealSide")} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.1" stopColor="#000" stopOpacity="0" />
          <stop offset="0.9" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id={id("puff")} cx="0.45" cy="0.42" r="0.66">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.88" stopColor="#000" stopOpacity="0.16" />
          <stop offset="1" stopColor="#000" stopOpacity="0.42" />
        </radialGradient>
        <linearGradient id={id("vshade")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.07" stopColor="#000" stopOpacity="0" />
          <stop offset="0.93" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={id("streak")} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("fin")} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.25" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={id("foil")} x1="0" x2="1">
          <stop offset="0" stopColor="#8e959c" />
          <stop offset="0.3" stopColor="#f4f6f8" />
          <stop offset="0.55" stopColor="#a7aeb5" />
          <stop offset="0.8" stopColor="#ffffff" />
          <stop offset="1" stopColor="#8e959c" />
        </linearGradient>
        <linearGradient id={id("chip")} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={hot ? "#ffb08a" : "#fff7cf"} />
          <stop offset="0.3" stopColor={hot ? "#ff5a2a" : "#fde27a"} />
          <stop offset="0.6" stopColor={chipTint} />
          <stop offset="0.85" stopColor={hot ? "#e8340e" : "#f4bd45"} />
          <stop offset="1" stopColor={chipDeep} />
        </linearGradient>
        <radialGradient id={id("brown")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.62" stopColor={chipDeep} stopOpacity="0" />
          <stop offset="1" stopColor={hot ? "#7a1004" : "#b8661a"} stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id={id("sun")} cx="0.42" cy="0.36" r="0.72">
          <stop offset="0" stopColor="#fff6b0" />
          <stop offset="0.5" stopColor="#ffd400" />
          <stop offset="1" stopColor="#f5a300" />
        </radialGradient>
        <linearGradient id={id("ribbon")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ff1a2e" />
          <stop offset="1" stopColor="#c0001a" />
        </linearGradient>
        <linearGradient id={`glass${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#c9e6ff" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8cc4f5" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`flame${uid}`} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#ff2a00" />
          <stop offset="0.55" stopColor="#ff8a00" />
          <stop offset="1" stopColor="#ffe066" />
        </linearGradient>
        <clipPath id={id("clip")}>
          <path d={SILHOUETTE} />
        </clipPath>
        <clipPath id={id("bodyClip")}>
          <path d={BODY} />
        </clipPath>
        <clipPath id={id("chipClip")}>
          <path d={CHIP} />
        </clipPath>
      </defs>

      {/* ---------- crimped seals ---------- */}
      <path d={TOP_SEAL} fill={url("seal")} />
      <path d={BOTTOM_SEAL} fill={url("seal")} />
      <g clipPath={url("clip")}>
        {Array.from({ length: 72 }).map((_, i) => (
          <g key={i}>
            <line x1={10 + i * 2.53} x2={10 + i * 2.53} y1="2" y2="18" stroke="#000" strokeOpacity="0.22" strokeWidth="0.7" />
            <line x1={10 + i * 2.53} x2={10 + i * 2.53} y1="267" y2="284" stroke="#000" strokeOpacity="0.22" strokeWidth="0.7" />
          </g>
        ))}
        <rect x="0" y="0" width="200" height="285" fill={url("sealSide")} />
      </g>

      {/* ---------- body ---------- */}
      <path d={BODY} fill={url("body")} />

      <g clipPath={url("bodyClip")}>
        {side === "front" ? (
          <>
            {/* subtle flavour-tinted burst behind logo */}
            <circle cx="100" cy="84" r="72" fill="#fff" opacity="0.08" />
            {hot && <path d="M0,214 C60,200 140,226 200,208 L200,290 L0,290 Z" fill="#140303" />}

            {/* centre fin seal running down from the top */}
            <rect x="92" y="14" width="16" height="36" fill={url("fin")} />

            {/* logo: sun disc + wavy ribbon wordmark */}
            <g transform="translate(100 82) scale(1.08)">
              <ellipse cx="2" cy="5" rx="40" ry="39" fill="#000" opacity="0.2" />
              <circle r="38" fill={url("sun")} />
              <circle r="38" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.4" />
              <circle r="33" fill="none" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="0.8" />
              <path d="M-50,-4 C-30,-18 -10,4 10,-8 C26,-17 40,-12 50,-6 L48,15 C38,9 26,6 12,14 C-8,26 -28,6 -48,18 Z" fill="#000" opacity="0.22" transform="translate(1.5 3)" />
              <path d="M-50,-4 C-30,-18 -10,4 10,-8 C26,-17 40,-12 50,-6 L48,15 C38,9 26,6 12,14 C-8,26 -28,6 -48,18 Z" fill={url("ribbon")} />
              <path d="M-50,-4 C-30,-18 -10,4 10,-8 C26,-17 40,-12 50,-6" stroke="#ffd8dc" strokeOpacity="0.6" strokeWidth="1.1" fill="none" />
              <text x="1.5" y="10.5" textAnchor="middle" fontFamily="var(--font-wide)" fontSize="19" fill="#5c0010" fontStyle="italic" transform="rotate(-6)">
                Crunch
              </text>
              <text x="0" y="9" textAnchor="middle" fontFamily="var(--font-wide)" fontSize="19" fill="#fff" stroke="#ffffff" strokeWidth="0.4" fontStyle="italic" transform="rotate(-6)">
                Crunch
              </text>
            </g>

            {/* flavour label under the logo */}
            <g transform={`translate(100 ${142 + (lines.length - 1) * 2})`}>
              <rect x={-Math.min(80, longest * nameSize * 0.33 + 12)} y={-nameSize - 2} width={Math.min(160, longest * nameSize * 0.66 + 24)} height={lines.length * (nameSize + 1) + 6} rx="4" fill={labelBg} opacity="0.95" />
              {lines.map((l, i) => (
                <text key={i} x="0" y={i * (nameSize + 1) + 1} textAnchor="middle" fontFamily="var(--font-display)" fontSize={nameSize} fill={labelInk} letterSpacing="0.4">
                  {l}
                </text>
              ))}
            </g>

            {/* ingredient vignette + chip spill (product shot) */}
            <g transform="translate(0 18)">
              <Ingredient id={flavor.id} uid={uid} />
            </g>
            {SPILL.map((c, i) => (
              <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.r}) scale(${c.s} ${c.s * c.fy})`}>
                {/* thin wafer: soft contact shadow, no thick "crust" */}
                <path d={CHIP} fill="#3a1d04" opacity="0.2" transform="translate(1 2.5)" />
                <path d={CHIP} fill={url("chip")} stroke={hot ? "#9c1606" : "#d08e1e"} strokeWidth="0.5" strokeOpacity="0.8" />
                <path d={CHIP} fill={url("brown")} />
                {/* fry blisters */}
                <g clipPath={url("chipClip")}>
                  {[
                    [-16, -6, 3.2],
                    [4, -12, 2.4],
                    [14, 4, 3],
                    [-4, 9, 2.2],
                    [22, -6, 1.8],
                  ].map(([bx, by, br], j) => (
                    <g key={j}>
                      <ellipse cx={bx} cy={by} rx={br} ry={br * 0.7} fill="#fff9d8" opacity="0.45" />
                      <ellipse cx={bx + 0.6} cy={by + 0.8} rx={br * 0.6} ry={br * 0.35} fill={hot ? "#a3200a" : "#d9952a"} opacity="0.35" />
                    </g>
                  ))}
                </g>
                {/* curled rim: bright upper lip, darker fried lower edge */}
                <path d="M-26,-8 C-18,-18 4,-22 22,-14" stroke="#fffbe6" strokeOpacity="0.7" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M-24,12 C-10,20 10,20 26,10" stroke={hot ? "#8a1204" : "#c47a1a"} strokeOpacity="0.45" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                {speck && SPECKS.map(([sx, sy], j) => <circle key={j} cx={sx} cy={sy} r={j % 3 ? 0.7 : 1.1} fill={speck} opacity="0.8" />)}
              </g>
            ))}

            <text x="100" y="262" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700" fontSize="5.2" fill="#fff" stroke="#000" strokeOpacity="0.55" strokeWidth="1.4" paintOrder="stroke" letterSpacing="0.3">
              NET WT 7.75 OZ (219.7g)
            </text>
          </>
        ) : (
          <>
            {/* back: nutrition panel, ingredients, barcode */}
            <rect x="92" y="14" width="16" height="257" fill={url("fin")} opacity="0.7" />
            <rect x="22" y="40" width="64" height="160" rx="3" fill="#fff" />
            <text x="26" y="54" fontFamily="var(--font-wide)" fontSize="7" fill="#111">Nutrition Facts</text>
            <rect x="26" y="57" width="56" height="3" fill="#111" />
            {Array.from({ length: 12 }).map((_, i) => (
              <g key={i}>
                <rect x="26" y={66 + i * 10.5} width={20 + ((i * 13) % 26)} height="3.2" fill="#111" opacity="0.75" />
                <rect x="72" y={66 + i * 10.5} width="10" height="3.2" fill="#111" opacity="0.75" />
                <rect x="26" y={72 + i * 10.5} width="56" height="0.5" fill="#111" opacity="0.4" />
              </g>
            ))}
            <text x="116" y="52" fontFamily="var(--font-mono)" fontSize="5" fill="#fff" opacity="0.9" letterSpacing="0.6">INGREDIENTS</text>
            {Array.from({ length: 7 }).map((_, i) => (
              <rect key={i} x="116" y={57 + i * 6} width={60 - (i % 3) * 10} height="2.4" rx="1" fill="#fff" opacity="0.65" />
            ))}
            <rect x="122" y="150" width="56" height="46" rx="2" fill="#fff" />
            {Array.from({ length: 22 }).map((_, i) => (
              <rect key={i} x={126 + i * 2.2} y="154" width={i % 3 === 0 ? 1.5 : 0.8} height="32" fill="#111" />
            ))}
            <text x="150" y="193" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="4.5" fill="#111">0 28400 31042 6</text>
            <text x="100" y="228" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="5.6" fill="#fff" opacity="0.85" letterSpacing="1">
              PACKED FOR FRESHNESS · N₂ FLUSHED
            </text>
            <text x="100" y="240" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="4.6" fill="#fff" opacity="0.6" letterSpacing="0.8">
              BEST BEFORE 03 MAR 2027 · LOT 26-114B
            </text>
          </>
        )}

        {/* ---------- glossy foil lighting ---------- */}
        <rect x="0" y="0" width="200" height="285" fill={url("puff")} />
        <rect x="0" y="0" width="200" height="285" fill={url("vshade")} />
        {/* diagonal reflections */}
        <path d="M18,0 L54,0 L8,285 L-28,285 Z" fill={url("streak")} />
        <path d="M150,0 L166,0 L132,285 L116,285 Z" fill={url("streak")} opacity="0.55" />
        {/* pucker wrinkles under the seals */}
        {[22, 40, 58, 76, 124, 142, 160, 176].map((x, i) => (
          <g key={i}>
            <path d={`M${x},14 Q${x + 4},${22 + (i % 3) * 3} ${x - 1},${30 + (i % 4) * 4}`} stroke="#fff" strokeOpacity="0.3" strokeWidth="1.1" fill="none" />
            <path d={`M${x + 2},14 Q${x + 6},${22 + (i % 3) * 3} ${x + 1},${28 + (i % 4) * 4}`} stroke="#000" strokeOpacity="0.2" strokeWidth="1.1" fill="none" />
            <path d={`M${x},271 Q${x + 4},${263 - (i % 3) * 3} ${x - 1},${255 - (i % 4) * 4}`} stroke="#fff" strokeOpacity="0.22" strokeWidth="1" fill="none" />
          </g>
        ))}
      </g>

      {/* foil lip where seal meets body */}
      <path d="M12,17.5 L188,17.5" stroke={url("foil")} strokeWidth="1.1" />
      <path d="M12,267.5 L188,267.5" stroke={url("foil")} strokeWidth="1.1" />

      {/* crinkled foil texture (rasterised once by the browser) */}
      {!lite && (
        <g clipPath={url("clip")}>
          <image href="/textures/crinkle.svg" x="0" y="0" width="200" height="285" preserveAspectRatio="none" opacity="0.2" style={{ mixBlendMode: "soft-light" }} />
          <image href="/textures/crinkle-spec.svg" x="0" y="0" width="200" height="285" preserveAspectRatio="none" opacity="0.3" style={{ mixBlendMode: "screen" }} />
        </g>
      )}
    </svg>
  );
}
