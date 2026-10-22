import { useEffect, useRef, useState } from "react";

interface CodeBlockProps {
  code: string;
  /** Label shown in the header, e.g. a file name. */
  title?: string;
  /** Limit the visible height and scroll inside the block. */
  maxHeight?: string;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API is unavailable on insecure origins; fall back to execCommand.
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
}

function CodeBlock({ code, title, maxHeight }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  async function handleCopy() {
    if (!(await copyText(code))) return;

    setCopied(true);
    window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-4 py-2">
        <span className="truncate font-mono text-xs text-white/60">
          {title ?? "code"}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 cursor-pointer rounded-md border border-white/10 px-3 py-1 text-xs font-medium text-white/80 transition hover:border-violet-400/60 hover:text-white"
          aria-live="polite"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <pre
        className="overflow-auto p-4 text-sm leading-relaxed text-violet-100"
        style={{ maxHeight }}
      >
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;
