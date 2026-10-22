import { useState } from "react";

import { AuroraFlow } from "../components/backgrounds/Aurora";
import { categories, components } from "../data/components";
import type { ComponentCategory } from "../data/components";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ComponentsCard from "../ui/ComponentsCard";

function ComponentsPage() {
  useDocumentTitle("Components");

  const [filter, setFilter] = useState<ComponentCategory | "All">("All");

  const visible =
    filter === "All"
      ? components
      : components.filter((component) => component.category === filter);

  return (
    <div className="relative flex-1 bg-[#16002e]">
      <div className="fixed inset-0">
        <AuroraFlow />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-32 sm:px-6">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-5xl font-bold md:text-6xl">Components</h1>
          <p className="max-w-xl text-lg text-white/70">
            Pick a component, copy the code and drop it into your project.
          </p>
        </header>

        <div
          className="flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Filter by category"
        >
          {(["All", ...categories] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${
                filter === category
                  ? "border-violet-400 bg-violet-500/30 text-white"
                  : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((component) => (
            <ComponentsCard key={component.slug} component={component} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ComponentsPage;
