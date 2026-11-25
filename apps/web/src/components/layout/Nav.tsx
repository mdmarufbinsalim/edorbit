import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[var(--paper)]/90 backdrop-blur-sm dark:border-white/10">
      <div className="site-px flex items-center justify-between py-4">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Orbital home">
          <Logo className="transition-transform duration-500 group-hover:rotate-[20deg]" />
          <span className="text-xl font-medium tracking-tight">Orbital</span>
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
