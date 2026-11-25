"use client";

import { motion } from "framer-motion";
import { SketchCircle, SketchUnderline } from "@orbital/ui";

export function Hero() {
  return (
    <section className="site-px pt-20 pb-16 sm:pt-28 sm:pb-24">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.14 }}
        className="mb-4 text-sm tracking-wide text-muted"
      >
        Space physics you can{" "}
        <SketchCircle delay={1.1} paddingX={10} paddingY={6} className="mx-2">
          play with
        </SketchCircle>
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.84, delay: 0.28 }}
        className="max-w-4xl text-4xl leading-tight font-medium sm:text-6xl"
      >
        Throw things into space and{" "}
        <span className="relative inline-block">
          see what happens
          <SketchUnderline
            className="absolute -bottom-2 left-0"
            width={360}
            height={18}
            delay={0.9}
          />
        </span>
        .
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.56 }}
        className="mt-8 max-w-xl text-lg text-muted"
      >
        No boring lectures. Short stories, sliders to drag, and missions to beat, all running on the
        same maths NASA uses.
      </motion.p>
      <motion.a
        href="#concepts"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.84 }}
        className="mt-10 inline-block text-xl underline decoration-2 underline-offset-4"
      >
        Pick something to explore ↓
      </motion.a>
    </section>
  );
}
