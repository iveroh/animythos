import { Link } from "react-router-dom";

import { AuroraFlow } from "../components/backgrounds/Aurora";

function HeroSection() {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#16002e]">
      <AuroraFlow />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 pt-16 text-center">
        <span className="text-sm tracking-[0.3em] text-violet-300">
          THREE.JS × REACT
        </span>

        <h1 className="text-6xl font-bold md:text-8xl">Animythos</h1>

        <p className="max-w-xl text-lg text-white/80">
          Animated Three.js backgrounds you can copy into any React website.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/components"
            className="rounded-full bg-violet-600 px-8 py-3 font-medium transition hover:bg-violet-500"
          >
            Explore backgrounds
          </Link>
          <Link
            to="/components/starfield"
            className="rounded-full border border-white/20 px-8 py-3 font-medium transition hover:bg-white/10"
          >
            Try Starfield
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
