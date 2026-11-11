"use client";

import { useState } from "react";
import SmoothScroll from "./SmoothScroll";
import Cursor from "./Cursor";
import Intro from "./Intro";
import Nav from "./Nav";
import Hero from "./Hero";
import Marquee from "./Marquee";
import Inside from "./Inside";
import Shop from "./Shop";
import BuildPack from "./BuildPack";
import Range from "./Range";
import QA from "./QA";
import Footer from "./Footer";
import Flyers, { Toast } from "./Flyers";

export default function Site() {
  const [ready, setReady] = useState(false);
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Intro onDone={() => setReady(true)} />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Inside />
        <Shop />
        <BuildPack />
        <Range />
        <QA />
      </main>
      <Footer />
      <Flyers />
      <Toast />
    </>
  );
}
