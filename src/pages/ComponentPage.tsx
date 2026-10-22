import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

import {
  components,
  getComponentBySlug,
  installCommand,
} from "../data/components";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import CodeBlock from "../ui/CodeBlock";
import NotFoundPage from "./NotFoundPage";

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-200">
        {number}
      </span>

      <div className="min-w-0 flex-1 space-y-3">
        <h3 className="pt-1 text-lg font-semibold">{title}</h3>
        {children}
      </div>
    </li>
  );
}

function ComponentPage() {
  const { slug } = useParams();
  const component = slug ? getComponentBySlug(slug) : undefined;

  useDocumentTitle(component?.name ?? "Page not found");

  if (!component) {
    return (
      <NotFoundPage message="We couldn't find a component with that name." />
    );
  }

  const Demo = component.demo;

  const index = components.indexOf(component);
  const previous = components[index - 1];
  const next = components[index + 1];

  return (
    <div className="bg-[#0f0220] pt-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-10 sm:px-6 sm:py-14">
        <header className="flex flex-col gap-4">
          <Link
            to="/components"
            className="w-fit text-sm text-white/60 transition hover:text-white"
          >
            ← All components
          </Link>

          <span className="w-fit rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium tracking-wide text-violet-200">
            {component.category}
          </span>

          <h1 className="text-4xl font-bold md:text-5xl">{component.name}</h1>

          <p className="max-w-2xl text-lg text-white/70">
            {component.description}
          </p>
        </header>

        <section aria-label="Live preview">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <Demo />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guide</h2>

          <ol className="space-y-8">
            <Step number={1} title="Install the dependencies">
              <p className="text-sm text-white/70">
                Requires a React project. If you already use{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                  three
                </code>{" "}
                and{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                  @react-three/fiber
                </code>{" "}
                you can skip this step.
              </p>
              <CodeBlock code={installCommand} title="terminal" />
            </Step>

            <Step number={2} title={`Copy ${component.fileName} into your project`}>
              <p className="text-sm text-white/70">
                Create{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                  {component.fileName}
                </code>{" "}
                anywhere in your source folder and paste the code below. It's a
                single file with no other dependencies.
              </p>
              <CodeBlock
                code={component.source}
                title={component.fileName}
                maxHeight="28rem"
              />
            </Step>

            <Step number={3} title="Use it">
              <CodeBlock code={component.usage} title="Example.tsx" />
              {component.note && (
                <p className="rounded-lg border border-violet-400/20 bg-violet-500/10 p-3 text-sm text-violet-100">
                  {component.note}
                </p>
              )}
            </Step>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Props</h2>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th className="px-4 py-3 font-medium">Prop</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Default</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {component.props.map((prop) => (
                  <tr key={prop.name}>
                    <td className="px-4 py-3 font-mono text-violet-200">
                      {prop.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-white/70">
                      {prop.type}
                    </td>
                    <td className="px-4 py-3 font-mono text-white/70">
                      {prop.default}
                    </td>
                    <td className="px-4 py-3 text-white/70">
                      {prop.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <nav
          aria-label="Other components"
          className="grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2"
        >
          {previous ? (
            <Link
              to={`/components/${previous.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-violet-400/60"
            >
              <span className="text-xs text-white/50">← Previous</span>
              <span className="block font-semibold">{previous.name}</span>
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              to={`/components/${next.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 text-right transition hover:border-violet-400/60 sm:col-start-2"
            >
              <span className="text-xs text-white/50">Next →</span>
              <span className="block font-semibold">{next.name}</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}

export default ComponentPage;
