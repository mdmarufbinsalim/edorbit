import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

/** Orbit-doodle logo: a planet with a tilted ring of ink. */
function Logo() {
  return (
    <svg viewBox="0 0 32 32" width={28} height={28} fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="6.5" stroke="currentColor" strokeWidth={2.2} />
      <ellipse
        cx="16"
        cy="16"
        rx="14"
        ry="5.5"
        stroke="currentColor"
        strokeWidth={2}
        transform="rotate(-20 16 16)"
        strokeDasharray="60 6"
      />
      <circle cx="28.5" cy="10.8" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[var(--paper)]/90 backdrop-blur-sm dark:border-white/10">
      <div className="site-px flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-xl">Orbital</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/#concepts" className="hover:opacity-60">
            Concepts
          </Link>
          <a href="https://github.com/mdmarufbinsalim/orbital" className="hover:opacity-60">
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
