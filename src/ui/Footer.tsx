import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-white/60 sm:flex-row">
        <p>Animythos · Animated Three.js components for React.</p>

        <div className="flex gap-4">
          <Link to="/components" className="transition hover:text-white">
            Components
          </Link>
          <a
            href="https://github.com/iveroh/Animythos"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
