"use client";

import { Hero8Bit } from "./components/Hero8Bit";
import DustStar from "./components/DustStar";
import HeroCharacter from "./components/HeroCharacter";

export default function Home() {
  return (
    <div className="relative bg-offwhite-50 text-foreground font-sans selection:bg-inverse min-h-screen flex flex-col">
      {/* Red Gradient Background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-linear-to-b from-vermalion-700 via-vermalion-500 to-vermalion-50" />
      <DustStar />
      <Hero8Bit />
      <HeroCharacter />
    </div>
  );
}
