"use client";

import { PixelLogoCanvas } from "@/components/gate/pixel-logo-canvas";

export function LandingHero() {
  return (
    <section
      className="relative w-full border-b overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.06)", height: "calc(100dvh - 44px)" }}
    >
      <PixelLogoCanvas asHero />
    </section>
  );
}
