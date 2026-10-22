import { Link, NavLink } from "react-router-dom";

const REPO_URL = "https://github.com/iveroh/Animythos";

function linkClass({ isActive }: { isActive: boolean }) {
  return `rounded-full px-4 py-2 text-sm transition md:text-base ${
    isActive
      ? "bg-white/10 text-white"
      : "text-white/70 hover:bg-white/5 hover:text-white"
  }`;
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main"
      >
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight transition hover:text-violet-300"
        >
          Animythos
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/components" className={linkClass}>
            Components
          </NavLink>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white md:text-base"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
