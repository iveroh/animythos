import { Link } from "react-router-dom";

import { useDocumentTitle } from "../hooks/useDocumentTitle";

function NotFoundPage({ message }: { message?: string }) {
  useDocumentTitle("Page not found");

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pt-16 text-center">
      <span className="text-sm tracking-[0.3em] text-violet-300">404</span>
      <h1 className="text-4xl font-bold md:text-5xl">Page not found</h1>
      <p className="max-w-md text-white/70">
        {message ?? "The page you are looking for does not exist."}
      </p>
      <Link
        to="/components"
        className="mt-2 rounded-full bg-violet-600 px-8 py-3 font-medium transition hover:bg-violet-500"
      >
        Browse components
      </Link>
    </section>
  );
}

export default NotFoundPage;
