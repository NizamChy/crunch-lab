# 🥔 Crunch Lab — Animated Chip-Brand Concept Site

**Live demo → [crunch-lab-peach.vercel.app](https://crunch-lab-peach.vercel.app)**

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88ce02?logo=greensock&logoColor=black)
![Three.js](https://img.shields.io/badge/React%20Three%20Fiber-three.js-000?logo=threedotjs)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)

A heavily animated, single-page concept website for a fictional potato-chip brand. Every section has its own
motion idea: 3D chips, a flavor carousel, a pinned scroll story that ends in a chip explosion, tilt cards,
a pack builder and a draggable rack of swinging bags.

> Crunch Lab is a **design concept**. It is not a real store and nothing is ever charged.
> All bag artwork is drawn in SVG code. The project uses no third-party brand assets.

---

## ✨ Features

| # | Section | What moves |
|---|---------|------------|
| 1 | **Intro** | Procedural 3D ridged chips fall (React Three Fiber), a loader counter runs, *Skip intro* is available, and a circular clip-path wipe reveals the site |
| 2 | **Flavors** | Bags sit on an arc carousel with spring physics. Concentric rings change colour per flavor, title letters flip, mouse parallax tilts the scene. Supports autoplay with a progress bar and swipe/drag |
| 3 | **Inside** | GSAP ScrollTrigger pinned story. The bag rotates through 3 steps (front → back nutrition panel) with pop-in callouts, then shakes, flashes and explodes into chips while a live *chips / sec* counter runs |
| 4 | **Grab a bag** | 3D tilt cards with glare and parallax. Pressing **+** flies the bag into the basket and shows a toast |
| 5 | **Build your 3-pack** | Clip-path reveal. Picked bags drop into slots on a glowing orb, and the price and savings update live |
| 6 | **Pick your crunch** | Draggable rail of hanging bags that swing with drag velocity. Hover nudges a bag and tapping spins it |
| 7 | **Q&A** | Letter reveal and animated accordion |
| 8 | **Footer** | Scroll-driven *STAY CRUNCHY* type, a rising bag and a newsletter form with a success state |

**Global extras:** Lenis smooth scroll, custom blend-mode cursor, section-aware pill nav (`layoutId` indicator),
synthesized Web Audio "crunch" sound (toggle *Off/On*), film-grain overlay and `prefers-reduced-motion` support.

## 🧰 Tech stack

| Concern | Tool |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Scroll storytelling | [GSAP](https://gsap.com) + ScrollTrigger via `@gsap/react` |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering), synced to the GSAP ticker |
| UI and gesture animation | [Motion](https://motion.dev) (Framer Motion): springs, layout, drag, `AnimatePresence` |
| 3D | [React Three Fiber](https://r3f.docs.pmnd.rs) + three.js (instanced procedural geometry) |
| State | [Zustand](https://zustand.docs.pmnd.rs): basket, sound toggle, fly-to-basket |
| Hosting | [Vercel](https://vercel.com) |

## 📁 Structure

```
src/
├─ app/                 # layout (fonts), globals.css, page, icon.svg + apple-icon.tsx
├─ components/
│  ├─ Site.tsx          # composes every section
│  ├─ Intro.tsx         # loader and wipe
│  ├─ ChipField.tsx     # R3F procedural chips
│  ├─ Hero.tsx          # flavor carousel
│  ├─ Inside.tsx        # GSAP pinned scroll story
│  ├─ Shop.tsx          # tilt cards
│  ├─ BuildPack.tsx     # 3-pack builder
│  ├─ Range.tsx         # draggable swinging rack
│  ├─ QA.tsx, Footer.tsx, Nav.tsx, Marquee.tsx
│  ├─ Bag.tsx           # SVG chip bag (front/back), themed per flavor
│  └─ Cursor.tsx, Flyers.tsx, SmoothScroll.tsx
├─ lib/                 # flavors data, lenis helpers, sound synth
└─ store/               # zustand stores
```

To rebrand, edit `src/lib/flavors.ts` (names, colours, prices) and `src/components/Bag.tsx` (logo).

## 🚀 Getting started

```bash
git clone https://github.com/NizamChy/crunch-lab.git
cd crunch-lab
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

## 🗺️ Roadmap

Next steps for the project, in priority order. Ticked items are done.

### Phase 1 — Polish & performance
- [x] Mobile responsive pass: no sideways scroll, Inside text/bag split on phones, hero controls de-collided, last shop card spans the row
- [x] Pinned *Inside* scene made lighter (`will-change`, floor shadow instead of re-rasterised drop-shadows, shared chip gradients)
- [x] Brand favicon (`icon.svg`) + generated Apple touch icon
- [ ] Lazy-load the React Three Fiber intro (`next/dynamic`) and skip it on low-end devices / `prefers-reduced-motion`
- [ ] Fewer burst chips and no blur filters on small screens
- [ ] Lighthouse + Web Vitals budget (LCP < 2.5s, INP < 200ms, CLS < 0.1) checked on every deploy
- [ ] Open Graph / Twitter share image (`opengraph-image.tsx`)
- [ ] Accessibility audit: keyboard control for carousel and rail, visible focus rings, `aria-live` toasts

### Phase 2 — Make the store real
- [ ] Cart drawer with quantities, remove, and a running total
- [ ] Persist the basket across reloads (`zustand/middleware` persist)
- [ ] Flavor detail pages (`/flavors/[id]`) with a shared-element bag transition
- [ ] Checkout in Stripe **test mode**
- [ ] Working newsletter signup (Server Action + email provider)

### Phase 3 — Content, quality & scale
- [ ] Headless CMS for flavors, prices and copy (e.g. Sanity)
- [ ] Bangla / English i18n
- [ ] Playwright e2e tests (add-to-basket, 3-pack, mobile nav) + visual regression screenshots
- [ ] GitHub Actions CI: lint, typecheck and build on every PR
- [ ] Privacy-friendly analytics (e.g. Vercel Analytics)

## 👤 Author

**Nizam Chowdhury** · [@NizamChy](https://github.com/NizamChy)
