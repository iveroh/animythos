import type { ComponentType } from "react";

import {
  AuroraDemo,
  NeonGridDemo,
  StarfieldDemo,
  TopographyDemo,
} from "../demos/BackgroundDemos";

import auroraSource from "../components/backgrounds/Aurora/AuroraFlow.tsx?raw";
import neonGridSource from "../components/backgrounds/NeonGrid/NeonGrid.tsx?raw";
import starfieldSource from "../components/backgrounds/Starfield/Starfield.tsx?raw";
import topographySource from "../components/backgrounds/Topography/Topography.tsx?raw";

export type ComponentCategory =
  | "Background"
  | "Animation"
  | "Shaders"
  | "Particles"
  | "Camera";

export interface ComponentProp {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface ComponentInfo {
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  demo: ComponentType;
  /** CSS background used as a static preview on the component cards. */
  thumbnail: string;
  /** Complete, self-contained source the user copies into their project. */
  source: string;
  /** File name the source should be saved as. */
  fileName: string;
  /** Example showing how to use the component. */
  usage: string;
  props: ComponentProp[];
  /** Short note about where the component has to be placed. */
  note?: string;
}

/** Packages every Animythos component needs. */
export const installCommand = "npm install three @react-three/fiber";

const backgroundNote =
  "The background is absolutely positioned and fills its nearest positioned parent, so give the parent position: relative and a height. Put your own content above it with a higher z-index. It ignores pointer events and is hidden from screen readers.";

const backgroundUsage = (name: string, props: string) => `import ${name} from "./${name}";

export default function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100vh" }}>
      <${name}${props} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1>Your content</h1>
      </div>
    </section>
  );
}`;

export const components: ComponentInfo[] = [
  {
    slug: "aurora-flow",
    thumbnail:
      "linear-gradient(180deg, #16002e 0%, #3b1a8f 55%, #3b82f6 100%)",
    name: "Aurora Flow",
    description:
      "Soft northern-lights ribbons that drift across the sky and react to the cursor.",
    category: "Background",
    demo: AuroraDemo,
    source: auroraSource,
    fileName: "AuroraFlow.tsx",
    usage: backgroundUsage(
      "AuroraFlow",
      `
        speed={0.5}
        amplitude={0.7}
        colorA="#16002e"
        colorB="#7c3aed"
        colorC="#3b82f6"
      `,
    ),
    note: backgroundNote,
    props: [
      { name: "speed", type: "number", default: "0.5", description: "Animation speed multiplier." },
      { name: "amplitude", type: "number", default: "0.7", description: "How far the ribbons wander vertically." },
      { name: "colorA", type: "string", default: '"#16002e"', description: "Night-sky base colour." },
      { name: "colorB", type: "string", default: '"#7c3aed"', description: "First ribbon colour." },
      { name: "colorC", type: "string", default: '"#3b82f6"', description: "Second ribbon colour." },
      { name: "className", type: "string", default: "–", description: "Class added to the wrapper element." },
    ],
  },
  {
    slug: "starfield",
    thumbnail:
      "radial-gradient(circle at 20% 30%, #fff 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, #8ab4ff 0 1px, transparent 2px), radial-gradient(circle at 45% 80%, #fff 0 1px, transparent 2px), radial-gradient(ellipse at 50% 120%, #1b1147 0%, #05010f 70%)",
    name: "Starfield",
    description:
      "Thousands of twinkling stars drifting toward you with cursor parallax.",
    category: "Background",
    demo: StarfieldDemo,
    source: starfieldSource,
    fileName: "Starfield.tsx",
    usage: backgroundUsage(
      "Starfield",
      `
        count={2500}
        speed={2}
        size={1}
        colorA="#ffffff"
        colorB="#8ab4ff"
      `,
    ),
    note: backgroundNote,
    props: [
      { name: "count", type: "number", default: "2500", description: "Number of stars." },
      { name: "speed", type: "number", default: "2", description: "Speed the stars drift toward the viewer. Use 0 for a still sky." },
      { name: "size", type: "number", default: "1", description: "Star size multiplier." },
      { name: "colorA", type: "string", default: '"#ffffff"', description: "Colour of the first half of the stars." },
      { name: "colorB", type: "string", default: '"#8ab4ff"', description: "Colour of the second half of the stars." },
      { name: "background", type: "string", default: "radial-gradient(…)", description: "CSS background painted behind the stars." },
      { name: "className", type: "string", default: "–", description: "Class added to the wrapper element." },
    ],
  },
  {
    slug: "neon-grid",
    thumbnail:
      "linear-gradient(180deg, #07011a 0%, #ff2fa8 48%, #0b0220 50%, #0b0220 100%), #07011a",
    name: "Neon Grid",
    description:
      "A retro synthwave sunset above an endless, glowing neon grid.",
    category: "Background",
    demo: NeonGridDemo,
    source: neonGridSource,
    fileName: "NeonGrid.tsx",
    usage: backgroundUsage(
      "NeonGrid",
      `
        speed={0.6}
        skyColor="#07011a"
        glowColor="#ff2fa8"
        gridColor="#22d3ee"
      `,
    ),
    note: backgroundNote,
    props: [
      { name: "speed", type: "number", default: "0.6", description: "How fast the grid rolls toward the viewer." },
      { name: "skyColor", type: "string", default: '"#07011a"', description: "Colour of the sky at the top of the screen." },
      { name: "glowColor", type: "string", default: '"#ff2fa8"', description: "Colour of the sun and horizon glow." },
      { name: "gridColor", type: "string", default: '"#22d3ee"', description: "Colour of the grid lines." },
      { name: "className", type: "string", default: "–", description: "Class added to the wrapper element." },
    ],
  },
  {
    slug: "topography",
    thumbnail:
      "repeating-radial-gradient(ellipse at 30% 40%, transparent 0 10px, #34d39955 11px 12px), #03120d",
    name: "Topography",
    description:
      "A slowly evolving contour map whose hills rise under your cursor.",
    category: "Background",
    demo: TopographyDemo,
    source: topographySource,
    fileName: "Topography.tsx",
    usage: backgroundUsage(
      "Topography",
      `
        speed={1}
        levels={14}
        scale={2.2}
        lineColor="#34d399"
        backgroundColor="#03120d"
      `,
    ),
    note: backgroundNote,
    props: [
      { name: "speed", type: "number", default: "1", description: "How fast the terrain evolves." },
      { name: "levels", type: "number", default: "14", description: "Number of contour levels across the terrain." },
      { name: "scale", type: "number", default: "2.2", description: "Zoom of the terrain. Higher values give smaller, busier features." },
      { name: "lineColor", type: "string", default: '"#34d399"', description: "Colour of the contour lines." },
      { name: "backgroundColor", type: "string", default: '"#03120d"', description: "Background colour." },
      { name: "className", type: "string", default: "–", description: "Class added to the wrapper element." },
    ],
  },
];

export function getComponentBySlug(slug: string) {
  return components.find((component) => component.slug === slug);
}

export const categories: ComponentCategory[] = Array.from(
  new Set(components.map((component) => component.category)),
);
