"use client";

import { Hero8Bit } from "./components/Hero8Bit";

export default function Home() {
  return (
    <div className="relative bg-offwhite-50 text-foreground font-sans selection:bg-vermalion-600/50 min-h-screen flex flex-col">
      {/* Red Gradient Background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-linear-to-b from-vermalion-700 via-vermalion-500 to-vermalion-50" />
      <Hero8Bit />
    </div>
  );
}
