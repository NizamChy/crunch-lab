# Crunch Lab — animated chip-brand concept

A heavily animated single-page concept site for a (fictional) potato-chip brand, built with Next.js.

## Stack

| Concern | Tool |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Styling | Tailwind CSS v4 |
| Scroll storytelling | GSAP + ScrollTrigger (`@gsap/react`) |
| Smooth scroll | Lenis (synced to the GSAP ticker) |
| UI / gesture animation | Motion (Framer Motion) — springs, layout, drag, AnimatePresence |
| 3D | React Three Fiber + three.js (procedural ridged chips in the intro) |
| State | Zustand (basket, sound toggle, fly-to-basket) |

## Sections

1. **Intro** – 3D falling chips, loader counter, *Skip intro*, circular wipe reveal
2. **Flavors** – arc carousel of bags, colour-shifting concentric rings, letter-flip titles, autoplay, drag/swipe, mouse parallax
3. **Inside** – pinned scroll story: bag rotates through 3 steps (front → back), callouts, then a chip explosion with a live "chips / sec" counter
4. **Grab a bag** – 3D tilt cards with glare; `+` launches the bag into the basket
5. **Build your 3-pack** – pick 3 flavors, bags spring into slots, price/savings update
6. **Pick your crunch** – draggable rail of hanging bags that swing with drag velocity; tap to spin
7. **Q&A** – animated accordion
8. **Footer** – scroll-driven "STAY CRUNCHY" type, newsletter form

Extras: custom cursor, synthesized crunch sound (toggle *Off/On*), section-aware pill nav.

## Run

```bash
npm install
npm run dev   # http://localhost:3000
```
