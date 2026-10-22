import { Link } from "react-router-dom";

import type { ComponentInfo } from "../data/components";

function ComponentsCard({ component }: { component: ComponentInfo }) {
  return (
    <Link
      to={`/components/${component.slug}`}
      className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition duration-200 group-hover:-translate-y-1 group-hover:border-violet-400/60 group-hover:bg-white/10">
        <div
          className="h-32 w-full border-b border-white/10"
          style={{ background: component.thumbnail }}
          aria-hidden="true"
        />

        <div className="flex flex-1 flex-col gap-3 p-6">
          <span className="w-fit rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium tracking-wide text-violet-200">
            {component.category}
          </span>

          <h2 className="text-xl font-semibold">{component.name}</h2>

          <p className="text-sm leading-relaxed text-white/70">
            {component.description}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default ComponentsCard;
