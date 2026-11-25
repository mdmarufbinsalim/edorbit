import type { Metadata } from "next";
import Script from "next/script";
import { Nav } from "@/components/layout/Nav";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EdOrbit", template: "%s · EdOrbit" },
  description:
    "Interactive stories that explain big ideas from science, maths, history and beyond. Drag, try, and see why things work.",
};

// Light by default; dark is opt-in via the toggle and remembered.
const themeInit = `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
      </head>
      <body className="flex min-h-full flex-col">
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  );
}
