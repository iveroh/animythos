import type { ReactNode } from "react";

import { AuroraFlow } from "../components/backgrounds/Aurora";
import { NeonGrid } from "../components/backgrounds/NeonGrid";
import { Starfield } from "../components/backgrounds/Starfield";
import { Topography } from "../components/backgrounds/Topography";

function BackgroundPreview({
  children,
  title,
  alignTop = false,
}: {
  children: ReactNode;
  title: string;
  alignTop?: boolean;
}) {
  return (
    <div
      className={`relative flex h-[28rem] justify-center overflow-hidden md:h-[32rem] ${
        alignTop ? "items-start pt-12" : "items-center"
      }`}
    >
      {children}

      <div className="relative z-10 px-6 text-center">
        <h3 className="text-4xl font-bold drop-shadow-lg md:text-5xl">
          {title}
        </h3>
        <p className="mt-2 text-white/80 drop-shadow">
          Content sits on top of the background.
        </p>
      </div>
    </div>
  );
}

export function AuroraDemo() {
  return (
    <BackgroundPreview title="Aurora Flow">
      <AuroraFlow />
    </BackgroundPreview>
  );
}

export function StarfieldDemo() {
  return (
    <BackgroundPreview title="Starfield">
      <Starfield />
    </BackgroundPreview>
  );
}

export function NeonGridDemo() {
  return (
    <BackgroundPreview title="Neon Grid" alignTop>
      <NeonGrid />
    </BackgroundPreview>
  );
}

export function TopographyDemo() {
  return (
    <BackgroundPreview title="Topography">
      <Topography />
    </BackgroundPreview>
  );
}
