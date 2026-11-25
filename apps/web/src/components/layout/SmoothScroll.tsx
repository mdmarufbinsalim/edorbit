"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/** Lenis smooth scrolling, including in-page hash links. Disabled for reduced motion. */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']");
      const id = a?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
      history.pushState(null, "", `#${id}`);
    };
    const onScrollTo = (e: Event) => {
      const el = (e as CustomEvent<HTMLElement>).detail;
      if (el) lenis.scrollTo(el, { offset: -80 });
    };
    const onResize = () => lenis.resize();
    document.addEventListener("click", onClick);
    window.addEventListener("edorbit:scroll-to", onScrollTo);
    document.addEventListener("transitionend", onResize, true);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("edorbit:scroll-to", onScrollTo);
      document.removeEventListener("transitionend", onResize, true);
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.resize();
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}

/** Smooth-scroll to an element from anywhere (falls back to native scrolling). */
export function scrollToElement(el: HTMLElement | null) {
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) el.scrollIntoView();
  else window.dispatchEvent(new CustomEvent("edorbit:scroll-to", { detail: el }));
}
